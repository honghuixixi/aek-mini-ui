// pages/repair/repair.js
const app = getApp()
const util = require('../../utils/util.js')
const model = require('../../model/repair.js')
const api = require('../../utils/api.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        repairLocal: new model.RepairLocal(),
        tabIndex: 1,        // 1:维修中 2：操作记录
        sideIndex: 1,       // 1:接单类型 2：工作方式 3：故障现象 4：故障原因 5：工作内容 6：配件信息 7：维修结果
        dialog: {
            show: false,    // 对话框显示标识
            title: '',      // 对话框标题
            holder: '',     // 输入框的placeholder
            val: '',        // 输入的自定义内容
            okFun: ''
        },
        showParts: false,   // 显示或隐藏配件对话框
        parts: {
            id: (new Date()).getTime(),   // 配件id
            partName: '',                 // 配件名称
            partSpec: '',                 // 规格型号
            partProduce: '',              // 生产商
            partPrice: '',                // 单价
            num: '1',                     // 数量
            unit: 0,                      // 单位key值
            unitName: '',                 // 单位名称
            status: 0                     // 来源 1：领用 2：购买
        },
        canSubmit: false,   // 是否可以提交
        isUserInput: false, // 材料费是否是用户输入
        showOrigin: false,  // 配件对话框-来源
        showUnit: false,    // 配件对话框-单位
        writeRepaotLimit: false,
        isSelf: false,
        isSaveTemp: true,
        isSubmit: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this
        let keys = Object.keys(this.data.repairLocal.dic)
        this.data.repairLocal.applyId = options.applyid
        this.data.writeRepaotLimit = wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_REPAIR') != -1 : false//填写维修报告的权限
        this.data.repairLocal.repairEndDate = util.formatday(new Date())      // 维修结束时间-工作方式-自主维修
        this.data.repairLocal.repairEndTime = util.formatsec(new Date())
        for (let i = 0, len = keys.length; i < len; i++) {
            api.loookdictionary({
                data: {
                    typeKey: keys[i]
                },
                isNoToken: false,
                success: (res) => {
                    if (res.data.code == 200) {
                        _this.data.repairLocal.dic[keys[i]] = res.data.data
                    }
                    if (i === (len - 1)) {
                        api.getRepairreport({
                            data: {
                                id: options.applyid
                            },
                            isNoToken: false,
                            success(res) {
                                let isFirst = res.data.data.id ? false : true
                                _this.data.isSelf = res.data.data.flag
                                if (res.data.data.id) {
                                    _this.fillData(res.data.data)
                                    // _this.checkSubmit()                                   
                                }

                                api.repairdetail({
                                    data: {
                                        id: options.applyid
                                    },
                                    isNoToken: false,
                                    success(res) {
                                        if (res.data.data.id) {

                                            if (isFirst) {
                                                _this.data.repairLocal.reportStatus = res.data.data.reportStatus ? res.data.data.reportStatus : 1
                                                _this.data.repairLocal.sendPerson = res.data.data.sendPerson          // 送修人
                                                _this.data.repairLocal.sendPhone = res.data.data.sendPhone            // 送修人手机号
                                                _this.data.repairLocal.repairStartDate = util.formatday(new Date(res.data.data.reportRepairDate))
                                                _this.data.repairLocal.repairStartTime = util.formatsec(new Date(res.data.data.reportRepairDate))
                                            }
                                            // _this.setData(_this.data)                                    
                                        }
                                        _this.checkSubmit()
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
        console.log(this.data.repairLocal)
    },
    showOperators: function (e) {
        wx.redirectTo({
            url: 'repairoperate?applyid=' + this.data.repairLocal.applyId + '&newTag=true'
        })
    },
    // 暂存
    saveTemp: function (e) {
        if (this.data.isSaveTemp) {
            this.data.isSaveTemp = false;
            api.postRepairreport({
                data: new model.RepairServer(this.data.repairLocal, 1),
                isNoToken: false,
                success: (res) => {
                    wx.showToast({
                        title: '保存成功'
                    })
                },
                complete: (res) => {
                    this.data.isSaveTemp = true
                    if (res.data.code == 'W_016') {
                        // console.log('error')
                        setTimeout(() => {
                            wx.redirectTo({
                                url: 'repairlist',
                            })
                        }, 1500)

                    }
                }
            })
        }
    },
    // 完修提交
    submit: function (e) {
        if (this.data.isSubmit) {
            this.data.isSubmit = false
            api.postRepairreport({
                data: new model.RepairServer(this.data.repairLocal, 2),
                isNoToken: false,
                success: (res) => {
                    if (res.data.code == 200) {
                        wx.navigateBack({
                            url: 'repairlist'
                        })
                    }
                },
                complete: (res) => {
                    this.data.isSubmit = true
                    if (res.data.code == 'W_016') {
                        setTimeout(() => {
                            wx.redirectTo({
                                url: 'repairlist',
                            })
                        }, 1500)

                    }
                }
            })
        }
    },
    // tab页切换、左侧切换、接单类型、工作方式、故障原因、维修结果
    changeTab: function (e) {
        let val = +e.currentTarget.dataset.id
        this.data[e.currentTarget.dataset.field] = val
        if (e.currentTarget.dataset.fun) {
            this[e.currentTarget.dataset.fun](val)
        }
        this.setData(this.data)
        this.checkSubmit()
    },
    // 工作方式切换
    changeWorkType: function (arg) {
        let list = this.data.repairLocal.sideList,
            flag = !(arg === 3)
        console.log(flag)
        for (let i = 2, len = list.length; i < len; i++) {
            list[i].display = flag
        }
    },
    // 获取input值
    getInputField: function (e) {
        this.data[e.currentTarget.dataset.field] = e.detail.value
        this.setData(this.data)
        this.checkSubmit()
    },
    getPartsInputField: function (e) {
        this.data.parts[e.currentTarget.dataset.field] = e.detail.value
        this.setData(this.data)
    },
    getPartsCostInputField: function (e) {
        this.data[e.currentTarget.dataset.field] = e.detail.value
        this.data.isUserInput = true
        this.setData(this.data)
        this.checkSubmit()
    },
    // 添加故障现象
    showFaultPhenomenonDialog: function () {
        this.data.dialog = {
            show: true,
            title: '新建故障现象',
            holder: '请输入故障现象',
            val: '',
            okFun: 'addFaultPhenomenon'
        }
        this.setData(this.data)
    },
    addFaultPhenomenon: function (e) {
        this.data.repairLocal.dic['FAULT_PHENOMENON'].push({
            id: (new Date()).getTime(),
            name: this.data.dialog.val,
            keyId: this.data.dialog.val,
            checked: true
        })
        this.closeDicDialog()
        this.checkSubmit()
    },
    // 添加故障原因
    showFaultReasonDialog: function () {
        this.data.dialog = {
            show: true,
            title: '新建故障原因',
            holder: '请输入故障原因',
            val: '',
            okFun: 'addFaultReason'
        }
        this.setData(this.data)
    },
    addFaultReason: function (e) {
        let key = 'OTHER_FACTOR'
        // if (this.data.repairLocal.faultReason === 1) {
        //     key = 'HUMAN_FACTOR'
        // } else if (this.data.repairLocal.faultReason === 2) {
        //     key = 'EQUIPMENT_FAILURE'
        // }
        this.data.repairLocal.dic[key].push({
            id: (new Date()).getTime(),
            name: this.data.dialog.val,
            keyId: this.data.dialog.val,
            checked: true
        })
        this.closeDicDialog()
        this.checkSubmit()
    },
    // 添加工作内容
    showWorkContentDialog: function () {
        this.data.dialog = {
            show: true,
            title: '新建工作内容',
            holder: '请输入工作内容',
            val: '',
            okFun: 'addWorkContent'
        }
        this.setData(this.data)
    },
    addWorkContent: function (e) {
        this.data.repairLocal.dic['JOB_CONTENT'].push({
            id: (new Date()).getTime(),
            name: this.data.dialog.val,
            keyId: this.data.dialog.val,
            checked: true
        })
        this.closeDicDialog()
        this.checkSubmit()
    },
    // 添加配件
    showPartsDialog: function () {
        let units = this.data.repairLocal.dic['PARTS_UNIT']
        this.data.parts.id = (new Date()).getTime()
        this.data.parts.partName = ''
        this.data.parts.partSpec = ''
        this.data.parts.partProduce = ''
        this.data.parts.partPrice = ''
        this.data.parts.num = '1'
        this.data.parts.unit = 0
        this.data.parts.unitName = ''
        this.data.parts.status = 0
        if (units && units.length > 0) {
            this.data.parts.unit = units[0].keyId
            this.data.parts.unitName = units[0].name
        }
        this.data.showParts = true
        this.setData(this.data)
    },
    addParts: function (e) {
        if (this.data.parts.partName.length
            && this.data.parts.status
            && this.data.parts.num.length
            && this.data.parts.unitName.length) {
            let index = this.getPartsIndex(this.data.repairLocal.list, this.data.parts.id)
            if (index >= 0) {
                this.data.repairLocal.list[index] = this.data.parts
            } else {
                this.data.repairLocal.list.push(this.data.parts)
            }
            if (!this.data.isUserInput) {
                let sum = 0
                this.data.repairLocal.list.map(item => {
                    if (parseInt(item.partPrice) > 0) {
                        sum += +item.partPrice * +item.num
                    }
                })
                this.data.repairLocal.partsCost = sum.toFixed(2)
            }
            this.closePartsDialog()
        }
    },
    // 编辑配件
    editParts: function (e) {
        let arg = e.currentTarget.dataset.parts
        this.data.parts.id = arg.id
        this.data.parts.partName = arg.partName
        this.data.parts.partSpec = arg.partSpec
        this.data.parts.partProduce = arg.partProduce
        this.data.parts.partPrice = arg.partPrice
        this.data.parts.num = arg.num
        this.data.parts.unit = arg.unit
        this.data.parts.unitName = arg.unitName
        this.data.parts.status = arg.status
        this.data.showParts = true
        this.setData(this.data)
    },
    showPartsOrigin: function (e) {
        this.data.showOrigin = true
        this.setData(this.data)
    },
    choosePartsOrigin: function (e) {
        this.data.parts.status = +e.currentTarget.dataset.id
        this.data.showOrigin = false
        this.setData(this.data)
    },
    showPartsUnits: function (e) {
        this.data.showUnit = true
        this.setData(this.data)
    },
    choosePartsUnits: function (e) {
        this.data.parts.unit = +e.currentTarget.dataset.id
        this.data.parts.unitName = e.currentTarget.dataset.name
        this.data.showUnit = false
        this.setData(this.data)
    },
    getPartsIndex: function (list, id) {
        let index = -1
        for (let i = 0, len = list.length; i < len; i++) {
            if (list[i].id === id) {
                index = i
                break
            }
        }
        return index
    },
    closeDicDialog: function () {
        this.data.dialog = {
            show: false,
            title: '',
            holder: '',
            val: '',
            okFun: ''
        }
        this.setData(this.data)
    },
    sureDicDialog: function (e) {
        this[this.data.dialog.okFun](e)
    },
    closePartsDialog: function () {
        this.data.showParts = false
        this.setData(this.data)
    },
    // 长按删除配件
    removePart: function (e) {
        wx.showModal({
            title: '提示',
            content: '确定要删除配件' + e.currentTarget.dataset.parts.partName + '吗？',
            success: (res) => {
                if (res.confirm) {
                    this.data.repairLocal.list.splice(e.currentTarget.dataset.addpartIndex, 1);
                    this.setData(this.data)
                }
            }
        })
    },
    // 复选
    checkboxChange: function (e) {
        let list = this.data.repairLocal.dic[e.currentTarget.dataset.field]
        this.muiltyCheck(list, e.detail.value)
        this.setData(this.data)
        this.checkSubmit()
    },
    muiltyCheck: function (list, ids) {
        list.map(item => {
            item.checked = this.isContain(ids, item.id)
        })
    },
    isContain: function (list, id) {
        let result = false
        for (let item of list) {
            if (+item === +id) {
                result = true
                break
            }
        }
        return result
    },
    checkSubmit: function () {
        let flag = true
        if (this.data.repairLocal.modeStatus < 3) {
            flag = this.hasChecked(this.data.repairLocal.dic.FAULT_PHENOMENON)
                && (this.hasChecked(this.data.repairLocal.dic.HUMAN_FACTOR)
                    || this.hasChecked(this.data.repairLocal.dic.EQUIPMENT_FAILURE)
                    || this.hasChecked(this.data.repairLocal.dic.EXTERNAL_FACTORS)
                    || this.hasChecked(this.data.repairLocal.dic.OTHER_FACTOR))
                && this.hasChecked(this.data.repairLocal.dic.JOB_CONTENT)
                // && (this.data.repairLocal.repairCost + '').length
                // && (this.data.repairLocal.partsCost + '').length
            if (this.data.repairLocal.modeStatus === 1) {
                flag = flag && this.checkSelfSubmit()
            } else {
                flag = flag && this.checOutSubmit()
            }
        }

        this.data.canSubmit = flag
        this.setData(this.data)
    },
    hasChecked: function (list) {
        let result = false
        for (let item of list) {
            if (item.checked) {
                result = true
                break
            }
        }
        return result
    },
    checkSelfSubmit: function () {
      return   this.data.repairLocal.actualEndDate.length
            && this.data.repairLocal.actualEndTime.length
            && this.data.repairLocal.repairEndDate.length
            && this.data.repairLocal.repairEndTime.length
    },
    checOutSubmit: function () {
        return this.data.repairLocal.outsideCompany.length
            && this.data.repairLocal.outsidePhone.length
            && this.data.repairLocal.engineerName.length
            && this.data.repairLocal.engineerNum.length
            && this.data.repairLocal.callRepairDate.length
            && this.data.repairLocal.callRepairTime.length
            && this.data.repairLocal.arrivalDate.length
            && this.data.repairLocal.arrivalTime.length
            && this.data.repairLocal.leaveDate.length
            && this.data.repairLocal.leaveTime.length
            && (this.data.repairLocal.repairHours + '').length
    },
    fillData: function (arg) {
        // this.data.repairLocal.applyId = arg.applyId             // 申请单id
        this.data.repairLocal.reportStatus = arg.reportStatus        // 接单类型 1：送修（默认） 2：现场维修
        if (arg.modeStatus) {
            this.data.repairLocal.modeStatus = arg.modeStatus         // 工作方式-维修方式（1：自主维修（默认） 2：外修 3：现场解决）
            this.data.repairLocal.faultType = arg.modeStatus === 1 ? arg.faultType : 0          // 工作方式-故障类型（1~3）
            this.data.repairLocal.faultTypeOut = arg.modeStatus === 2 ? arg.faultType : 0        // 工作方式-故障类型（4~7）
        }
        this.data.repairLocal.outsideCompany = arg.outsideCompany     // 工作方式-外修单位
        this.data.repairLocal.outsidePhone = arg.outsidePhone       // 工作方式-外修电话
        this.data.repairLocal.engineerName = arg.engineerName       // 工作方式-工程师姓名
        this.data.repairLocal.engineerNum = arg.engineerNum        // 工作方式-工程师编号
        this.data.repairLocal.workRemarks = ""        // 工作方式-现场解决备注
        this.data.repairLocal.faultReason = 0         // 故障原因类型（1：人为因素 2：设备因素 3：外界环境因素）
        this.data.repairLocal.list = []               // 配件数组
        this.data.repairLocal.repairResult = arg.repairResult || 1       // 维修结果-维修结果 1：正常工作（默认值） 2：基本功能正常 3：需进一步修理 4：需外送修理 5：无法修复 6：其他
        this.data.repairLocal.actualEndDate = ""    // 维修开始时间-工作方式-自主维修 维修时间
        this.data.repairLocal.actualEndTime = ""    
        this.data.repairLocal.repairEndDate = ""      // 维修结束时间-工作方式-自主维修 完修时间
        this.data.repairLocal.repairEndTime = ""
        this.data.repairLocal.callRepairDate = ""     // 维修结果-叫修时间-工作方式-外修
        this.data.repairLocal.callRepairTime = ""
        this.data.repairLocal.arrivalDate = ""        // 维修结果-到达时间-工作方式-外修
        this.data.repairLocal.arrivalTime = ""
        this.data.repairLocal.leaveDate = ""          // 维修结果-离开时间-工作方式-外修
        this.data.repairLocal.leaveTime = ""
        this.data.repairLocal.repairHours = arg.repairHours        // 维修结果-维修工时
        this.data.repairLocal.repairCost = arg.repairCost          // 维修结果-维修费用 
        this.data.repairLocal.partsCost = arg.partsCost            // 维修结果-材料费用
        this.data.repairLocal.repairInvoice = arg.repairInvoice    // 维修结果-发票号码（用；分割）
        this.data.repairLocal.sendPerson = arg.sendPerson          // 送修人
        this.data.repairLocal.sendPhone = arg.sendPhone            // 送修人手机号
        this.data.repairLocal.troubleCode = arg.troubleCode        // 故障代码

        this.data.repairLocal.remarks = arg.modeStatus > 2 ? "" : arg.remarks            // 维修结果-维修备注
        if (arg.modeStatus === 1) {
            this.data.repairLocal.actualEndDate = arg.actualEndDate && util.formatday(new Date(arg.actualEndDate))
            this.data.repairLocal.actualEndTime = arg.actualEndDate && util.formatsec(new Date(arg.actualEndDate))
            this.data.repairLocal.repairEndDate = arg.repairEndDate && util.formatday(new Date(arg.repairEndDate))
            this.data.repairLocal.repairEndTime = arg.repairEndDate && util.formatsec(new Date(arg.repairEndDate))
        } else if (arg.modeStatus === 2) {
            this.data.repairLocal.callRepairDate = arg.callRepairDate && util.formatday(new Date(arg.callRepairDate))
            this.data.repairLocal.callRepairTime = arg.callRepairDate && util.formatsec(new Date(arg.callRepairDate))
            this.data.repairLocal.arrivalDate = arg.arrivalDate && util.formatday(new Date(arg.arrivalDate))
            this.data.repairLocal.arrivalTime = arg.arrivalDate && util.formatsec(new Date(arg.arrivalDate))
            this.data.repairLocal.leaveDate = arg.leaveDate && util.formatday(new Date(arg.leaveDate))
            this.data.repairLocal.leaveTime = arg.leaveDate && util.formatsec(new Date(arg.leaveDate))
        } else if (arg.modeStatus === 3) {
            this.data.repairLocal.workRemarks = arg.remarks
            this.changeWorkType(3)
        }
        this.fillDic(this.data.repairLocal.dic.FAULT_PHENOMENON, arg.faultPhenomenon ? arg.faultPhenomenon.split(',') : [])
        this.fillDic(this.data.repairLocal.dic.JOB_CONTENT, arg.workContent ? arg.workContent.split(',') : [])
        let self = this.getSelfDic([].concat(this.data.repairLocal.dic.HUMAN_FACTOR, this.data.repairLocal.dic.EQUIPMENT_FAILURE, this.data.repairLocal.dic.EXTERNAL_FACTORS), arg.faultReason ? arg.faultReason.split(',') : [])
        let step = 1;
        self.map(item => {
            step--;
            this.data.repairLocal.dic.OTHER_FACTOR.push({
                id: (new Date()).getTime() - step,
                name: item,
                keyId: item,
                checked: true
            })
        })
        if (self.length > 0) {
            this.data.repairLocal.faultReason = 4
        }
        let flag = true
        let list = arg.faultReason ? arg.faultReason.split(',') : []
        for (let item of this.data.repairLocal.dic.HUMAN_FACTOR) {
            let has = false
            for (let id of list) {
                if (id === (item.keyId + '')) {
                    this.data.repairLocal.faultReason = 1
                    has = true
                    flag = false
                    break
                }
            }
            if (has) {
                break
            }
        }
        if (flag) {
            for (let item of this.data.repairLocal.dic.EQUIPMENT_FAILURE) {
                let has = false
                for (let id of list) {
                    if (id === (item.keyId + '')) {
                        this.data.repairLocal.faultReason = 2
                        has = true
                        flag = false
                        break
                    }
                }
                if (has) {
                    break
                }
            }
            if (flag) {
                for (let item of this.data.repairLocal.dic.EXTERNAL_FACTORS) {
                    let has = false
                    for (let id of list) {
                        if (id === (item.keyId + '')) {
                            this.data.repairLocal.faultReason = 3
                            has = true
                            flag = false
                            break
                        }
                    }
                    if (has) {
                        break
                    }
                }
            }
        }
        arg.list.map(item => {
            this.data.repairLocal.list.push({
                id: item.id,
                partName: item.partName,
                partSpec: item.partSpec,
                partProduce: item.partProduce,
                partPrice: item.partPrice,
                num: item.num,
                unit: item.unit,
                unitName: item.unitName,
                status: item.status
            })
        })
    },
    fillDic: function (arr, list) {
        let self = this.getSelfDic(arr, list)
        self.map(item => {
            arr.push({
                id: (new Date()).getTime(),
                name: item,
                keyId: item,
                checked: true
            })
        })
    },
    getSelfDic: function (arr, list) {
        let self = []
        list.map(item => {
            let flag = false
            for (let obj of arr) {
                // if (obj.keyId == item) {
                if (obj.name == item) {
                    obj.checked = true
                    flag = true
                    break
                }
            }
            if (!flag) {
                self.push(item)
            }
        })
        return self
    }
})