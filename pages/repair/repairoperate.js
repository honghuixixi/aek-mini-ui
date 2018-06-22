// pages/assestbook/assestedit.js

var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()
Page({

    data: {
        baseImgUrl: app.globalData.PIC_URL.substr(0, app.globalData.PIC_URL.length - 1),
        totastHide1: true,                        //自定义的totast显示隐藏变量
        totastContent1: "该附件无法预览，请从网页版下载查看...",
        totastHide3: true,                        //自定义的totast显示隐藏变量
        totastContent3: "维修单已验收",
        disabled1: true,//接单按钮的变量不可点击
        totastHide: true,//totast提示
        totastContent: '保存成功',//totast文字
        disabled: false,//按钮是否能用
        content: '接单',//按钮的内容
        index: 0,//点击上部导航实现还会切换
        title: '',//头部左边的文字
        loading: true,//动画变量
        status: '',//从上个页面传来的参数
        start: [1, 2, 3, 4, 5],
        score1: 5,//星星得分
        score3: 5,//星星得分
        score2: 5,//星星得分
        text1: ['很差 1.0', '差 2.0', '一般 3.0', '好 4.0', '非常好 5.0'],
        text2: ['很慢 1.0', '慢 2.0', '一般 3.0', '快 4.0', '非常快 5.0'],
        text3: ['很差 1.0', '差 2.0', '一般 3.0', '满意 4.0', '非常满意 5.0'],
        operateList: '',//操作的对象
        msgData: '',//接单时获取的对象
        appyid: '',//申请单id
        time: '',//预计时间
        date: '',
        timeend: util.formatsec(new Date()),//预计时间
        dateend: util.formatday(new Date()),
        orderremark: '',//接单备注
        acceptremark: '',//验收备注
        userInfo: wx.getStorageSync("userInfo"),
        orderLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_TAKE_NEW') != -1 : false,//接单的权限
        acceptLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_CHECK') != -1 : false,//验收的权限
        writeRepaotLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_REPAIR') != -1 : false,//填写维修报告的权限
        allPathLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_TAKE_CHECK_VIEW') != -1 : false,//查看接单提交申请，验收的的权限
        lookreprtLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_REPORT_VIEW') != -1 : false,//查看维修报告单的权限
        completeList: '',//已完成的数据
        disabledrepair: true,//维修中的完修提交按钮置灰不可点击
        leftList: ['工作方式', '故障现象', '故障原因', '工作内容', '配件信息', '维修结果'],
        repairIndex: 0,//维修报告的左边切换
        workmethods: ['自主维修', '外修', '现场解决'],
        troublemethods: ['人为因素', '设备故障', ' 外界环境因素'],
        methodsIndex: 0,//工作方式的右边角标
        myfaulttype: [{ name: '故障维修', key: 1 }, { name: '预防性维修', key: 2 }, { name: '计量、检测后维修', key: 3 }],//选择自主维修下边对应的故障类型
        myfaulttypeIndex: 0,//自主维修下边的故障类型的角标
        faulttype: [{ name: '质保期内维修', key: 4 }, { name: '厂家合同维修', key: 5 }, { name: '第三方合同维修', key: 6 }, { name: '临时维修', key: 7 }],//选择自主维修下边对应的故障类型
        faulttypeIndex: 0,//自主维修下边的故障类型的角标
        failurepheno: [],//故障脏现象的数组，请求字典表
        add: false,//新建故障现象的变量
        work: false,//新建工作内容的变量
        reason: false,//新建工作内容的变量
        worktxt: [],//工作内容的数组
        peopelereason: [],//人为因素的字典表数组
        assestReason: [],//设备因素的字典表数组
        outReason: [],//外界环境因素的字典表
        num: 1,//配件默认的数量
        unitName: '个',//配件的单位
        unitkey: 1001,//配件的默认key
        unitList: [],//配件单位的数组，关联字典表
        unitHidden: true,//单位出现下拉菜单
        unitIndex: -1,//单位的下标
        part: false,//添加配件弹窗的变量
        nopart: true,//有没有配件的控制变量
        repairReasult: ['正常工作', '基本功能正常', '需进一步修理', '需外送修理', '无法修复', '其他'],
        reasultIndex: 0,
        faultType: '',//故障类型的传值
        faultPhenomenon: '',//故障现象
        addphoneStr: '',//自定义的故障现象
        faultReason: '',//故障原因
        faultReasonStr: '',//自定义的故障原因
        workStr: '',//自定义的工作内容
        workContent: '',//工作内容
        repairCost: 0.00,//维修费
        partsCost: 0.00,//材料费
        repairDate: '',//开始时间
        repairEndDate: '',//结束时间
        repairInvoice: '',//发票号
        repairremarks: '',//维需修备注
        outsideCompany: '',//外修单位
        outsidePhone: '',//外修电话
        methodsSumit: '',//暂存还是提教
        partList: [],//配件的数组
        partListShow: [],//页面现实的额配件数组
        disabled1: true,
        disabled2: true,
        partId: -1,
        reportId: '',
        parteq: '',
        PIC_URL: app.globalData.PIC_URL,
        parttxt: '添加配件',
        longtapEq: -1,//长按的角标
        over: false,
        partstatus: [{ name: '领用', statusEq: 1 }, { name: '购买', statusEq: 2 }],
        partStatusHidden: true,
        callRepair1: '请选择',//叫修时间
        callRepair2: '请选择',//叫修时间
        arrival1: '请选择',//到达时间
        arrival2: '请选择',//到达时间
        leave1: '请选择',//离开时间
        leave2: '请选择',//离开时间
        repairHours: '',
        nosum: false,
        watch1: true,
        watch11: true,
        watch6: true,
        peopleid: 0,
        peopleeq: -1,
        people: '请选择',//选择维修人
        peopleHide: true,
        peopleList: [],
        newFiles: '',
        isAccept: "",//是否可以接单
    },
    // 默认维修人
    defaultPeople: function () {
        let temp = this.data.msgData,
            _this = this;
        api.adjustPeople({
            data: {
                id: temp.takeOrderId
            },
            isNoToken: false,
            success: function (res) {
                if (res.data.code == 200 && res.data.data == 3) { // 1:无权限 2:已停用 3:通过
                    _this.setData({
                        peopleid: temp.takeOrderId,
                        people: temp.takeOrderName, //选择维修人
                        disabled1: false
                    });
                }
            }
        });
    },
    // 选择维修人=======================================================new
    choosePeople: function () {
        this.setData({
            peopleHide: false
        })
    },
    // 弹窗消失
    hostModal: function () {
        // 如果是选择图片的弹窗
        if (!this.data.peopleHide) {
            this.setData({
                peopleHide: true
            })
        }
    },
    // 弹窗方法
    chooseHost: function (event) {
        console.log(event)
        if (!this.data.peopleHide) {
            this.setData({
                "peopleeq": event.currentTarget.dataset.status,
                "people": event.currentTarget.dataset.statusname,
                "peopleid": event.currentTarget.dataset.status,
                "peopleHide": true,
            })
        }
        if (this.data.people != '请选择') {
            this.setData({
                disabled1: false
            })
        }
    },
    // 查看大图
    lookBignew: function (e) {
        var uri = e.currentTarget.dataset.filesUrl
        var canlook = uri.indexOf('.jpg') != -1 || uri.indexOf('.jpeg') != -1 || uri.indexOf('.png') != -1
        if (canlook) {
            // 能查看
            wx.navigateTo({
                url: '../bigpicture/bigpicture?uri=' + uri,
            })

        } else {
            this.setData({
                totastHide1: false
            })
            setTimeout(() => {
                this.setData({
                    totastHide1: true
                })
            }, 500)
        }
    },
    onShow() {
        // 防止获取页面当前打开时间过长
        this.setData({
            time: util.formatsec(new Date()),//预计时间
            date: util.formatday(new Date()),
            timeend: util.formatsec(new Date()),//结束时间
            dateend: util.formatday(new Date()),
        })

    },
    // 选择日期
    bindDateChange: function (e) {
        // console.log('picker发送日期改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
    // 选择时间
    bindTimeChange: function (e) {
        // console.log('picker发送时间改变，携带值为', e.detail.value)
        this.setData({
            time: e.detail.value
        })
    },
    // 选择日期
    bindDateChange1: function (e) {
        // console.log('picker发送日期改变，携带值为', e.detail.value)
        this.setData({
            datestart: e.detail.value
        })

    },
    // 选择时间开始时间
    bindTimeChange1: function (e) {
        // console.log('picker发送时间改变，携带值为', e.detail.value)
        this.setData({
            timestart: e.detail.value
        })
        console.log(this.data.timestart)
    },
    // 选择日期结束时间
    bindDateChange2: function (e) {
        // console.log('picker发送日期改变，携带值为', e.detail.value)
        this.setData({
            dateend: e.detail.value
        })

    },
    // 选择时间
    bindTimeChange2: function (e) {
        // console.log('picker发送时间改变，携带值为', e.detail.value)
        this.setData({
            timeend: e.detail.value
        })

    },




    // ww选择叫修时间
    jiaoxiuChange1: function (e) {
        // console.log('picker发送日期改变，携带值为', e.detail.value)
        this.setData({
            callRepair1: e.detail.value
        })
        this.watch()
    },
    // ww选择叫修时间
    jiaoxiuChange2: function (e) {
        // console.log('picker发送时间改变，携带值为', e.detail.value)
        this.setData({
            callRepair2: e.detail.value
        })
        this.watch()
    },
    // ww选择到达日期结束时间
    daodaChange1: function (e) {
        // console.log('picker发送日期改变，携带值为', e.detail.value)
        this.setData({
            arrival1: e.detail.value
        })
        this.watch()
    },
    // ww选择到达日期结束时间
    daodaChange2: function (e) {
        // console.log('picker发送时间改变，携带值为', e.detail.value)
        this.setData({
            arrival2: e.detail.value
        })
        this.watch()
    },
    // ww选择离开日期结束时间
    likaiChange1: function (e) {
        // console.log('picker发送日期改变，携带值为', e.detail.value)
        this.setData({
            leave1: e.detail.value
        })
        this.watch()
    },
    // ww选择离开日期结束时间
    likaiChange2: function (e) {
        // console.log('picker发送时间改变，携带值为', e.detail.value)
        this.setData({
            leave2: e.detail.value
        })
        this.watch()
    },
    // 时间转化
    transformData: function (data) {
        let _length = data.length;
        for (var i = 0; i < _length; i++) {
            if (data[i].reportRepairDate) {
                data[i].reportRepairDate = util.formatTime(new Date(data[i].reportRepairDate))
            }
        }
        return data;
    },
    // 查看大图
    lookbigImg: function (e) {
        this.setData({
            current: e.currentTarget.dataset.currentIndex
        })
        wx.navigateTo({
            url: 'bigImg?applyid=' + this.data.imageId + '&current=' + this.data.current,
        })
    },

    //提交维修报告的接口
    // postReport: function () {
    //   console.log(this.data.faultType)
    //     // 时间转化
    //     var strstart = this.data.datestart + ' ' + this.data.timestart
    //     strstart = strstart.replace(new RegExp(/-/gm), "/");
    //     var repairStartDate = ''
    //     repairStartDate = new Date(strstart).getTime()

    //     var strend = this.data.dateend + ' ' + this.data.timeend
    //     strend = strend.replace(new RegExp(/-/gm), "/");
    //     var repairEndDate = ''
    //     repairEndDate = new Date(strend).getTime()
    //     // 叫修时间
    //     if ((this.data.callRepair1 != '请选择') && (this.data.callRepair2 != '请选择')) {
    //         var jiaoxiu = this.data.callRepair1 + ' ' + this.data.callRepair2
    //         jiaoxiu = jiaoxiu.replace(new RegExp(/-/gm), "/");
    //         var callRepairDate = ''
    //         callRepairDate = new Date(jiaoxiu).getTime()
    //     } else {
    //         var callRepairDate = ''
    //     }

    //     // 到达时间
    //     if ((this.data.arrival1 != '请选择') && (this.data.arrival2 != '请选择')) {
    //         var daoda = this.data.arrival1 + ' ' + this.data.arrival2
    //         daoda = daoda.replace(new RegExp(/-/gm), "/");
    //         var arrivalDate = ''
    //         arrivalDate = new Date(daoda).getTime()
    //     } else {
    //         var arrivalDate = ''
    //     }

    //     // 离开时间
    //     if ((this.data.leave1 != '请选择') && (this.data.leave2 != '请选择')) {
    //         var likai = this.data.leave1 + ' ' + this.data.leave2
    //         likai = likai.replace(new RegExp(/-/gm), "/");
    //         var leaveDate = ''
    //         leaveDate = new Date(likai).getTime()
    //     } else {
    //         var leaveDate = ''
    //     }



    //     // 故障现象字段
    //     var faultPhenomenon = ''
    //     for (let i = 0; i < this.data.failurepheno.length; i++) {
    //         if (this.data.failurepheno[i].checked) {

    //             faultPhenomenon = faultPhenomenon + this.data.failurepheno[i].keyId + ','

    //         }
    //     }
    //     faultPhenomenon = faultPhenomenon.substr(0, faultPhenomenon.length - 1)
    //     this.setData({
    //         faultPhenomenon: faultPhenomenon
    //     })
    //     // 故障原因字段
    //     // 人为
    //     var faultReason = ''
    //     for (let i = 0; i < this.data.peopelereason.length; i++) {
    //         if (this.data.peopelereason[i].checked) {

    //             faultReason = faultReason + this.data.peopelereason[i].keyId + ','

    //         }
    //     }

    //     // 设备
    //     var faultPhenomenon = ''
    //     for (let i = 0; i < this.data.assestReason.length; i++) {
    //         if (this.data.assestReason[i].checked) {

    //             faultReason = faultReason + this.data.assestReason[i].keyId + ','

    //         }
    //     }

    //     // 外界
    //     var faultPhenomenon = ''
    //     for (let i = 0; i < this.data.outReason.length; i++) {
    //         if (this.data.outReason[i].checked) {

    //             faultReason = faultReason + this.data.outReason[i].keyId + ','

    //         }
    //     }
    //     faultReason = faultReason.substr(0, faultReason.length - 1)
    //     this.setData({
    //         faultReason: faultReason
    //     })

    //     // workContent
    //     // 外界
    //     var workContent = ''
    //     for (let i = 0; i < this.data.worktxt.length; i++) {
    //         if (this.data.worktxt[i].checked) {

    //             workContent = workContent + this.data.worktxt[i].keyId + ','

    //         }
    //     }
    //     workContent = workContent.substr(0, workContent.length - 1)
    //     this.setData({
    //         workContent: workContent
    //     })
    //     if (this.data.methodsIndex == 0) {
    //         //自主维修
    //         this.setData({
    //             repairHours: '',
    //             outsideCompany: '',
    //             outsidePhone: '',
    //             engineerName: '',
    //             engineerNum: '',
    //             repairremarks: this.data.repairremarks2
    //         })
    //         leaveDate = '',
    //             arrivalDate = '',
    //             callRepairDate = ''
    //     } else if (this.data.methodsIndex == 2) {
    //         //现场解决
    //         this.setData({
    //             repairHours: '',
    //             outsideCompany: '',
    //             outsidePhone: '',
    //             engineerName: '',
    //             engineerNum: '',
    //             repairremarks: this.data.repairremarks1,
    //             faultPhenomenon: '',
    //             faultReason: '',
    //             faultType: '',
    //             partList: [],
    //             repairCost: '',
    //             partsCost: '',
    //             repairInvoice: '',
    //             reasultIndex: '',
    //             workContent: ''
    //         })
    //         repairStartDate = ''
    //         repairEndDate = ''
    //         leaveDate = '',
    //             arrivalDate = '',
    //             callRepairDate = ''

    //     } else {
    //         this.setData({
    //             repairremarks: this.data.repairremarks2
    //         })
    //         repairStartDate = ''
    //         repairEndDate = ''
    //     }
    //     let _this = this
    //     api.postRepairreport({
    //         data: {
    //             "engineerName": this.data.engineerName,//工程师姓名
    //             "engineerNum": this.data.engineerNum,//工程师编号
    //             "applyId": this.data.applyid,//申请单id
    //             "faultPhenomenon": this.data.faultPhenomenon,// 故障现象(自定义单独拼接成串,格式1，2，3，电源问题)
    //             "faultReason": this.data.faultReason,//故障原因(自定义单独拼接成串,格式1，2，3，电源问题) ,
    //             "faultType": this.data.faultType,// 故障类型(1，故障维修2，预防性维修3，计量检测性维修 4，质保期内维修 5，厂家合同维修 6，第三方合同维修 7，临时叫修) ,
    //             "list": this.data.partList,//配件数组
    //             "modeStatus": this.data.methodsIndex + 1,// 维修方式（1，自主维修 2，外修 3，现场解决） ,
    //             "outsideCompany": this.data.outsideCompany,//外修单位 ,
    //             "outsidePhone": this.data.outsidePhone,//外修电话 ,
    //             "partsCost": this.data.partsCost,//材料费用 ,
    //             "remarks": this.data.repairremarks,//维修备注
    //             "repairCost": this.data.repairCost,//维修费用 
    //             "repairEndDate": repairEndDate,// 维修结束日期 ,
    //             "repairInvoice": this.data.repairInvoice,//发票号码（用，分割） ,
    //             "repairResult": this.data.reasultIndex + 1,//维修结果(1,正常工作 2，基本功能正常 3，需进一步修理 4，需外送修理 5，无法修复 6，其他) ,
    //             "repairStartDate": repairStartDate,//维修开始日期 ,
    //             "status": this.data.methodsSumit,// 报告方式（1，暂存 2，完修） ,
    //             "workContent": this.data.workContent,//工作内容(自定义单独拼接成串,格式1，2，3，电源问题)
    //             "arrivalDate": arrivalDate,//到达时间
    //             "callRepairDate": callRepairDate,//叫修时间
    //             "leaveDate": leaveDate,//离开时间
    //             "repairHours": this.data.repairHours,//维修工时
    //         },
    //         isNoToken: false,

    //         success: function (res) {
    //             // 提交晚修的时候才返回页面

    //             if (_this.data.methodsSumit == 2) {
    //                 if (res.data.code == 200) {
    //                     wx.navigateBack({
    //                         url: 'repairlist'
    //                     })
    //                 }
    //             } else {
    //                 // 点击暂存之后再请求一次
    //                 api.getRepairreport({
    //                     data: {
    //                         id: _this.data.applyid
    //                     },
    //                     isNoToken: false,
    //                     success: function (res) {
    //                         if (res.data.data.list.length > 0) {
    //                             _this.setData({
    //                                 nopart: false,//提示还没有添加配件消失
    //                                 partList: res.data.data.list,
    //                                 partListShow: res.data.data.list
    //                             })

    //                         } else {
    //                             _this.setData({
    //                                 nopart: true,//提示还没有添加配件消失

    //                             })
    //                         }
    //                     }
    //                 })
    //                 _this.setData({
    //                     totastHide: false
    //                 })
    //                 setTimeout(() => {
    //                     _this.setData({
    //                         totastHide: true
    //                     })
    //                 }, 1500)
    //             }

    //         }
    //     })
    // },

    //点击暂存
    // zancun: function () {

    //     // 提交方式是暂存
    //     this.setData({
    //         methodsSumit: 1
    //     })
    //     this.postReport()

    // },


    // 首次加载
    onLoad: function (options) {
        if (options.newTag) {
            this.data.index = 1
            this.setData({
                title: '维修中',
            })
            wx.setNavigationBarTitle({
                title: '维修中'
            })
        } else {
            this.data.index = 0
        }
        this.setData({
            index: this.data.index
        })
        var _this = this
        // 操作记录的接口
        this.setData({
            imageId: options.applyid,
            appyid: options.applyid
        })
        api.repairopreate({
            data: {
                id: options.applyid
            },
            isNoToken: false,
            success: function (res) {
                if (res.data.code == 200) {
                    // repairCheckName: 验收人姓名, repairCheckTime : 验收时间,
                    // repairDate: 维修时间, repairName: 维修人姓名,
                    // reportRepairDate: 报修申请时间, reportRepairName: 报修申请人姓名,   
                    // takeOrderName: 接单人姓名, takeOrderTime: 接单时间   
                    _this.setData({
                        operateList: res.data.data
                    })
                    if (_this.data.operateList.reportRepairDate) {
                        _this.data.operateList.reportRepairDate = util.formatTime(new Date(_this.data.operateList.reportRepairDate))
                    }
                    if (_this.data.operateList.takeOrderTime) {
                        _this.data.operateList.takeOrderTime = util.formatTime(new Date(_this.data.operateList.takeOrderTime))
                    }
                    if (_this.data.operateList.repairDate) {
                        _this.data.operateList.repairDate = util.formatTime(new Date(_this.data.operateList.repairDate))
                    }
                    if (_this.data.operateList.repairCheckTime) {


                        _this.data.operateList.repairCheckTime = util.formatTime(new Date(_this.data.operateList.repairCheckTime))
                    }
                    _this.setData({
                        operateList: _this.data.operateList
                    })
                    // time: util.formatsec(new Date()),//预计时间
                    //   date: util.formatday(new Date()),
                    api.getRepairreport({
                        data: {
                            id: options.applyid
                        },
                        isNoToken: false,
                        success: function (res) {
                            if (!res.data.data) {
                                _this.setData({
                                    watch7: true,
                                    watch8: true,
                                    watch1: true,
                                    watch11: true,
                                    watch6: true,
                                    faultType: 1
                                })
                            }
                            _this.data.operateList.reportRepairDate = _this.data.operateList.reportRepairDate.replace(new RegExp(/-/gm), "/");
                            if (res.data.data && res.data.data.repairStartDate && res.data.data.modeStatus == 1) {
                                // 如果用户自己存入了开始日期
                                _this.data.datestart = util.formatday(new Date(res.data.data.repairStartDate))
                                _this.data.timestart = util.formatsec(new Date(res.data.data.repairStartDate))

                            } else {
                                _this.data.datestart = util.formatday(new Date(_this.data.operateList.reportRepairDate))
                                _this.data.timestart = util.formatsec(new Date(_this.data.operateList.reportRepairDate))
                            }

                            if (res.data.data && res.data.data.repairEndDate && res.data.data.modeStatus == 1) {
                                _this.data.dateend = util.formatday(new Date(res.data.data.repairEndDate))
                                _this.data.timeend = util.formatsec(new Date(res.data.data.repairEndDate))
                            }
                            _this.setData({
                                datestart: _this.data.datestart,
                                timestart: _this.data.timestart,
                                dateend: _this.data.dateend,
                                timeend: _this.data.timeend
                            })
                        }
                    })
                }
            }
        })

        this.setData({
            applyid: options.applyid,
            orderLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_TAKE_NEW') != -1 : false,//接单的权限
            acceptLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_CHECK') != -1 : false,//验收的权限
            writeRepaotLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_REPAIR') != -1 : false,//填写维修报告的权限
            allPathLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_TAKE_CHECK_VIEW') != -1 : false,//查看接单提交申请，验收的的权限
            lookreprtLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('REP_APPLY_REPORT_VIEW') != -1 : false,//查看维修报告单的权限
        })
        // console.log(this.data.writeRepaotLimit)


        // 维修单详情的接口
        api.repairdetail({
            data: {
                id: options.applyid
            },
            isNoToken: false,
            success: function (res) {
                if (res.data.code == 200) {
                    _this.setData({
                        status: res.data.data.status,
                        msgData: res.data.data,
                        faultDesc: res.data.data.faultDesc ? res.data.data.faultDesc.split(',') : '',
                        isAccept: res.data.data.flag
                    })
                    _this.data.msgData.assetsImg = _this.data.msgData.assetsImg ? _this.data.msgData.assetsImg.split(',') : ''
                    _this.newFiles = _this.data.msgData.assetsFile ? JSON.parse(_this.data.msgData.assetsFile) : ''
                    _this.data.msgData.reportRepairDate = util.formatTime(new Date(_this.data.msgData.reportRepairDate))
                    _this.setData({
                        newFiles: _this.newFiles,
                        msgData: _this.data.msgData
                    })
                    _this.setImgFlag();

                    setTimeout(() => {
                        _this.setData({
                            loading: false,
                        })
                        if (_this.data.status == 1) {
                            _this.setData({
                                title: '接单',
                                content: '接单',

                            })
                            _this.defaultPeople();
                            wx.setNavigationBarTitle({
                                title: '接单'
                            })
                            // 调用维修人接口 getRepairName statusNum: 1, status
                            api.getRepairName({
                                isNoToken: false,
                                success: function (res) {
                                    var list = res.data.data
                                    var _length = list.length
                                    for (let i = 0; i < _length; i++) {
                                        _this.data.peopleList[i] = {
                                            statusNum: list[i].id,
                                            status: list[i].realName,
                                            phone: list[i].mobile
                                        }
                                    }
                                    _this.setData({
                                        peopleList: _this.data.peopleList,
                                    })
                                }
                            })

                        } else if (_this.data.status == 2) {
                            // // 待维修
                            _this.setData({
                                title: '维修中',
                            })
                            wx.setNavigationBarTitle({
                                title: '维修中'
                            })
                            // // 字典表请求故障现象
                            // api.loookdictionary({
                            //     data: {
                            //         typeKey: 'FAULT_PHENOMENON'
                            //     },
                            //     isNoToken: false,
                            //     success: function (res) {
                            //         if (res.data.code == 200) {
                            //             _this.setData({
                            //                 failurepheno: res.data.data

                            //             })


                            //         }
                            //     }
                            // })
                            // // 字典表请求故障现象
                            // api.loookdictionary({
                            //     data: {
                            //         typeKey: 'FAULT_PHENOMENON'
                            //     },
                            //     isNoToken: false,
                            //     success: function (res) {
                            //         if (res.data.code == 200) {
                            //             _this.setData({
                            //                 failurepheno: res.data.data
                            //             })
                            //         }
                            //     }
                            // })
                            // // 字典表请求工作内容
                            // api.loookdictionary({
                            //     data: {
                            //         typeKey: 'JOB_CONTENT'
                            //     },
                            //     isNoToken: false,
                            //     success: function (res) {
                            //         if (res.data.code == 200) {
                            //             _this.setData({
                            //                 worktxt: res.data.data
                            //             })
                            //         }
                            //     }
                            // })
                            // // 字典表请求人为因素
                            // api.loookdictionary({
                            //     data: {
                            //         typeKey: 'HUMAN_FACTOR'
                            //     },
                            //     isNoToken: false,
                            //     success: function (res) {
                            //         if (res.data.code == 200) {
                            //             _this.setData({
                            //                 peopelereason: res.data.data
                            //             })
                            //         }
                            //     }
                            // })
                            // // 字典表请求设备因素
                            // api.loookdictionary({
                            //     data: {
                            //         typeKey: 'EQUIPMENT_FAILURE'
                            //     },
                            //     isNoToken: false,
                            //     success: function (res) {
                            //         if (res.data.code == 200) {
                            //             _this.setData({
                            //                 assestReason: res.data.data
                            //             })
                            //         }
                            //     }
                            // })
                            // // 字典表请求外界环境因素
                            // api.loookdictionary({
                            //     data: {
                            //         typeKey: 'EXTERNAL_FACTORS'
                            //     },
                            //     isNoToken: false,
                            //     success: function (res) {
                            //         if (res.data.code == 200) {
                            //             _this.setData({
                            //                 outReason: res.data.data
                            //             })
                            //         }
                            //     }
                            // })
                            // // 字典表请求外界环境因素
                            // api.loookdictionary({
                            //     data: {
                            //         typeKey: 'PARTS_UNIT'
                            //     },
                            //     isNoToken: false,
                            //     success: function (res) {
                            //         if (res.data.code == 200) {
                            //             _this.setData({
                            //                 unitList: res.data.data
                            //             })
                            //         }
                            //     }
                            // })

                            // // this.getReport()
                            // api.getRepairreport({
                            //     data: {
                            //         id: options.applyid
                            //     },
                            //     isNoToken: false,
                            //     success: function (res) {
                            //         var listarr0 = []

                            //         listarr0 = listarr0.concat(_this.data.peopelereason)

                            //         listarr0 = listarr0.concat(_this.data.assestReason)

                            //         listarr0 = listarr0.concat(_this.data.outReason)

                            //         if (res.data.code == 200) {

                            //             if (res.data.data) {
                            //                 var data = res.data.data

                            //                 console.log(data.repairCost)
                            //                 data.faultPhenomenonList = data.faultPhenomenonList?data.faultPhenomenonList: []
                            //                 data.faultReasonList = data.faultReasonList ? data.faultReasonList : []
                            //                 data.workContentList = data.workContentList ? data.workContentList : []
                            //                 if (data.modeStatus == 2) {
                            //                     if (data.outsideCompany) {
                            //                         _this.data.watch9 = true
                            //                     } else {
                            //                         _this.data.watch9 = false
                            //                     }
                            //                     if (data.outsidePhone) {
                            //                         _this.data.watch10 = true
                            //                     } else {
                            //                         _this.data.watch10 = false
                            //                     }
                            //                     if (data.engineerName) {
                            //                         _this.data.watch13 = true
                            //                     } else {
                            //                         _this.data.watch13 = false
                            //                     }
                            //                     if (data.engineerNum) {
                            //                         _this.data.watch14 = true
                            //                     } else {
                            //                         _this.data.watch14 = false
                            //                     }

                            //                 } else {
                            //                     _this.data.watch9 = false
                            //                     _this.data.watch10 = false
                            //                     _this.data.watch13 = false
                            //                     _this.data.watch14 = false
                            //                 }
                            //                 var str = ''

                            //                 str = (data.faultType) && (data.faultPhenomenon) && (data.faultReason) && (data.workContent) && (data.repairResult) && (data.repairCost || data.repairCost === 0) && (data.partsCost || data.partsCost === 0)
                            //                 // 如果是现场解决
                            //                 if (data.modeStatus == 3) {
                            //                     _this.setData({
                            //                         disabledrepair: false,
                            //                         watch2:true
                            //                     })
                            //                     console.log(_this.data.disabledrepair)
                            //                 }
                            //                 // 如果自主维需必填字段已经填写完毕
                            //                 if (data.modeStatus == 1) {
                            //                     if (str) {
                            //                         _this.setData({
                            //                             disabledrepair: false
                            //                         })

                            //                     }
                            //                     if (data.faultType) {
                            //                         _this.setData({
                            //                             watch1: true
                            //                         })
                            //                     }
                            //                 }
                            //                 if (data.modeStatus == 2) {
                            //                     if (str && _this.data.watch9 && _this.data.watch10 && _this.data.watch13 && _this.data.watch14 && data.repairHours && data.leaveDate && data.arrivalDate && data.callRepairDate) {
                            //                         _this.setData({
                            //                             disabledrepair: false
                            //                         })
                            //                         console.log(_this.data.disabledrepair)
                            //                     }
                            //                     if (data.faultType) {
                            //                         _this.setData({
                            //                             watch11: true
                            //                         })
                            //                     }
                            //                 }

                            //                 if (data.faultPhenomenon) {
                            //                     _this.setData({
                            //                         watch3: true
                            //                     })

                            //                 }
                            //                 if (data.faultReason) {
                            //                     _this.setData({
                            //                         watch5: true
                            //                     })

                            //                 }
                            //                 if (data.workContent) {
                            //                     _this.setData({
                            //                         watch4: true
                            //                     })

                            //                 }
                            //                 if (data.repairResult) {
                            //                     _this.setData({
                            //                         watch6: true
                            //                     })

                            //                 }

                            //                 if (data.repairCost || data.repairCost === 0) {
                            //                     _this.setData({
                            //                         watch7: true
                            //                     })
                            //                 }

                            //                 if (data.partsCost || data.partsCost === 0) {
                            //                     _this.setData({
                            //                         watch8: true
                            //                     })

                            //                 }


                            //                 // 
                            //                 // 找到被暂存过的故障现象
                            //                 var listarr = []
                            //                 var listarr9 = []

                            //                 for (let i = 0; i < data.faultPhenomenonList.length; i++) {
                            //                     for (let j = 0; j < _this.data.failurepheno.length; j++) {
                            //                         if (data.faultPhenomenonList[i] == _this.data.failurepheno[j].name) {
                            //                             _this.data.failurepheno[j].checked = true
                            //                             break;
                            //                         }
                            //                         if (j == _this.data.failurepheno.length - 1) {
                            //                             listarr = listarr.concat({ name: data.faultPhenomenonList[i], keyId: data.faultPhenomenonList[i], checked: true })
                            //                         }
                            //                     }
                            //                 }

                            //                 _this.setData({
                            //                     failurepheno: _this.data.failurepheno.concat(listarr)
                            //                 })

                            //                 // // 找到被暂存过的故障原因   peopelereason  assestReason   outReason  
                            //                 var listarr1 = []

                            //                 for (let i = 0; i < data.faultReasonList.length; i++) {
                            //                     // 人为因素
                            //                     for (let j = 0; j < _this.data.peopelereason.length; j++) {
                            //                         if (data.faultReasonList[i] == _this.data.peopelereason[j].name) {
                            //                             _this.setData({
                            //                                 reasonIndex: 0
                            //                             })
                            //                             _this.data.peopelereason[j].checked = true
                            //                             break;
                            //                         }


                            //                     }
                            //                     // 设备因素
                            //                     for (let m = 0; m < _this.data.assestReason.length; m++) {
                            //                         if (data.faultReasonList[i] == _this.data.assestReason[m].name) {
                            //                             _this.setData({
                            //                                 reasonIndex: 1
                            //                             })
                            //                             _this.data.assestReason[m].checked = true
                            //                             break;
                            //                         }

                            //                     }
                            //                     // 外界环境
                            //                     for (let n = 0; n < _this.data.outReason.length; n++) {
                            //                         if (data.faultReasonList[i] == _this.data.outReason[n].name) {
                            //                             _this.setData({
                            //                                 reasonIndex: 0
                            //                             })
                            //                             _this.data.outReason[n].checked = true

                            //                             break;
                            //                         }

                            //                     }

                            //                     for (let g = 0; g < listarr0.length; g++) {
                            //                         if (data.faultReasonList[i] == listarr0[g].name) {

                            //                             break;
                            //                         }

                            //                         if (g == listarr0.length - 1) {
                            //                             listarr9 = listarr9.concat({ name: data.faultReasonList[i], keyId: data.faultReasonList[i], checked: true })
                            //                         }
                            //                     }
                            //                 }
                            //                 _this.setData({
                            //                     peopelereason: _this.data.peopelereason.concat(listarr9),
                            //                     assestReason: _this.data.assestReason,
                            //                     outReason: _this.data.outReason
                            //                 })


                            //                 // 找到被暂存过的工作内容
                            //                 var listarr2 = []
                            //                 for (let i = 0; i < data.workContentList.length; i++) {
                            //                     for (let j = 0; j < _this.data.worktxt.length; j++) {
                            //                         if (data.workContentList[i] == _this.data.worktxt[j].name) {
                            //                             _this.data.worktxt[j].checked = true
                            //                             break;
                            //                         }
                            //                         if (j == _this.data.worktxt.length - 1) {
                            //                             listarr2 = listarr2.concat({ name: data.workContentList[i], keyId: data.workContentList[i], checked: true })
                            //                         }
                            //                     }
                            //                 }

                            //                 _this.setData({
                            //                     worktxt: _this.data.worktxt.concat(listarr2)
                            //                 })
                            //                 if (data.modeStatus == 3) {
                            //                     _this.setData({
                            //                         repairremarks1: data.remarks
                            //                     })
                            //                 } else if (data.modeStatus == 2) {
                            //                     _this.setData({
                            //                         repairremarks2: data.remarks
                            //                     })
                            //                 } else {
                            //                     _this.setData({
                            //                         repairremarks2: data.remarks
                            //                     })
                            //                 }


                            //                 // // 找到被暂存过的维修结果
                            //                 _this.setData({

                            //                     reasultIndex: data.repairResult ? data.repairResult - 1 : 0,//维修结果
                            //                     partsCost: data.partsCost,//配件费
                            //                     repairCost: data.repairCost,//维修费
                            //                     repairInvoice: data.repairInvoice,//发票
                            //                     outsidePhone: data.outsidePhone,//外修电话
                            //                     outsideCompany: data.outsideCompany,//外修单位
                            //                     methodsIndex: data.modeStatus - 1,//找到工作方式
                            //                     engineerName: data.engineerName,//工程师姓名
                            //                     engineerNum: data.engineerNum,//工程师编号
                            //                     repairHours: data.repairHours,//维修工时
                            //                 })


                            //                 if (_this.data.methodsIndex == 0) {
                            //                     _this.setData({
                            //                       faultType: data.faultType,
                            //                       myfaulttypeIndex: data.faultType ? data.faultType -1 : 0 

                            //                     })

                            //                 } else if (_this.data.methodsIndex == 1) {
                            //                     _this.data.callRepair1 = res.data.data.callRepairDate ? util.formatday(new Date(res.data.data.callRepairDate)) : '请选择'
                            //                     _this.data.callRepair2 = res.data.data.callRepairDate ? util.formatsec(new Date(res.data.data.callRepairDate)) : '请选择'
                            //                     _this.data.arrival1 = res.data.data.arrivalDate ? util.formatday(new Date(res.data.data.arrivalDate)) : '请选择'
                            //                     _this.data.arrival2 = res.data.data.arrivalDate ? util.formatsec(new Date(res.data.data.arrivalDate)) : "请选择"
                            //                     _this.data.leave1 = res.data.data.leaveDate ? util.formatday(new Date(res.data.data.leaveDate)) : '请选择'
                            //                     _this.data.leave2 = res.data.data.leaveDate ? util.formatsec(new Date(res.data.data.leaveDate)) : '请选择'
                            //                     _this.setData({
                            //                       faultType: data.faultType,
                            //                         faulttypeIndex: data.faultType - 4 ,
                            //                         callRepair1: _this.data.callRepair1,
                            //                         callRepair2: _this.data.callRepair2,
                            //                         arrival1: _this.data.arrival1,
                            //                         arrival2: _this.data.arrival2,
                            //                         leave1: _this.data.leave1,
                            //                         leave2: _this.data.leave2

                            //                     })
                            //                 }

                            //                 //  配件

                            //                 if (data.listdata.list.length > 0) {
                            //                     _this.setData({
                            //                         nopart: false,//提示还没有添加配件消失
                            //                         partList: data.list,
                            //                         partListShow: data.list
                            //                     })
                            //                     console.log('load')
                            //                     console.log(_this.data.partList)
                            //                 }

                            //                 _this.watch()
                            //             }
                            //         }
                            //     }
                            // })
                        } else if (_this.data.status == 3) {
                            // 待验收
                            _this.setData({
                                title: '待验收',
                                content: '验收',

                            })
                            wx.setNavigationBarTitle({
                                title: '待验收'
                            })
                        } else {
                            // 完成
                            _this.setData({
                                title: '已完成',
                            })
                            wx.setNavigationBarTitle({
                                title: '已完成'
                            })
                            // 已完成左边是验收详情
                            api.acceptGet({
                                data: {
                                    id: options.applyid
                                },
                                isNoToken: false,
                                success: function (res) {
                                    if (res.data.code == 200) {
                                        _this.setData({
                                            completeList: res.data.data
                                        })
                                    }

                                }
                            })
                        }
                    }, 500)
                }
            }
        })

        console.log(this.data.disabledrepair)

    },
    // 切换基本信息和采购信息
    changeMsg: function (e) {
        this.setData({
            index: e.currentTarget.dataset.setIndex,
            tag: false//让悬浮按钮变回原来的样子  
        })
        if (e.currentTarget.dataset.setIndex == 1) {
            this.setData({
                disabled: false
            })
        }
        if (this.data.status == 2 && this.data.index == 0) {
            //切换维修报告的时候，都要获取最新的
            this.setData({
                timeend: util.formatsec(new Date()),//结束时间
                dateend: util.formatday(new Date()),
            })
            wx.redirectTo({
                url: 'repair?applyid=' + this.data.appyid
            })
        }

    },
    //  点击星星
    clickstart: function (e) {
        if (e.currentTarget.dataset.list == 1) {
            this.setData({
                score1: e.currentTarget.dataset.score
            })
        } else if (e.currentTarget.dataset.list == 2) {
            this.setData({
                score2: e.currentTarget.dataset.score
            })
        } else {
            this.setData({
                score3: e.currentTarget.dataset.score
            })
        }

    },
    // 查看提交申请
    apply: function () {
        console.log('权限')
        console.log(this.data.allPathLimit)
        if (this.data.allPathLimit) {

            wx.navigateTo({
                url: 'apply?applyid=' + this.data.applyid,
            })
        }

    },
    // 查看接单
    order: function () {
        console.log('权限')
        console.log(this.data.allPathLimit)
        if (this.data.allPathLimit) {
            wx.navigateTo({
                url: 'order?applyid=' + this.data.applyid,
            })
        }
    },
    // 查看维修报告
    report: function () {
        console.log('权限')
        console.log(this.data.allPathLimit)
        if (this.data.lookreprtLimit) {
            wx.navigateTo({
                url: 'report?applyid=' + this.data.applyid,
            })
        }
    },
    // 查看验收
    accept: function () {
        console.log('权限')
        console.log(this.data.allPathLimit)
        if (this.data.allPathLimit) {
            wx.navigateTo({
                url: 'accept?applyid=' + this.data.applyid,
            })
        }
    },
    //接单时的备注
    orderRemark: function (e) {
        this.setData({
            orderremark: e.detail.value
        })
    },
    // acceptTxt
    //验收时的备注
    acceptTxt: function (e) {
        this.setData({
            acceptremark: e.detail.value
        })
    },
    // 填写维修报告的事件======================================
    repairChange: function (e) {
        this.setData({
            repairIndex: e.currentTarget.dataset.repairIndex
        })


    },
    // 计算配件的方法
    complutepart: function () {
        var sum = 0
        for (let i = 0; i < this.data.partList.length; i++) {
            if (!this.data.partList[i].delFlag) {
                // 配件没有被删除的
                sum = sum + this.data.partList[i].partPrice * this.data.partList[i].num
            }
        }
        this.setData({
            partsCost: sum.toFixed(2),
            watch8: true
        })
        if (this.data.repairCost || this.data.repairCost === 0) {
            this.setData({

                watch7: true
            })
        }


    },
    // // 选择工作方式
    // work: function (e) {
    //     this.setData({
    //         methodsIndex: e.currentTarget.dataset.methodsIndex,

    //     })
    //     if (this.data.methodsIndex == 2) {
    //         this.setData({
    //             watch2: true
    //         })

    //     }
    //     if (this.data.methodsIndex == 0) {
    //       this.setData({
    //         faultType: 1
    //       })

    //     }
    //     if (this.data.methodsIndex == 1) {
    //       this.setData({
    //         faultType: 4
    //       })

    //     }
    //     this.watch()
    // },
    // //选择自主维修的故障类型 
    // myfaulttypeClick: function (e) {

    //     this.setData({
    //         myfaulttypeIndex: e.currentTarget.dataset.myfaulttypeIndex,
    //         faultType: e.currentTarget.dataset.myfaulttypeKey,
    //         watch1: true
    //     })

    //     this.watch()
    // },
    // //选择外修的故障类型 
    // faulttypeClick: function (e) {

    //     this.setData({
    //         faulttypeIndex: e.currentTarget.dataset.faulttypeIndex,
    //         faultType: e.currentTarget.dataset.faulttypeKey,
    //         watch11: true
    //     })

    //     this.watch()
    // },
    // //故障现象的check
    // phonecheckboxChange: function (e) {

    //     var arr1 = []
    //     var arr2 = []
    //     arr2 = e.detail.value
    //     for (let i = 0; i < this.data.failurepheno.length; i++) {
    //         arr1.push(i)
    //     }
    //     var tem1 = []
    //     var tem2 = []
    //     for (var i = 0; i < arr2.length; i++) {
    //         tem1[arr2[i]] = true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
    //     }
    //     for (var i = 0; i < arr1.length; i++) {
    //         if (!tem1[arr1[i]]) {
    //             tem2.push(arr1[i]);//过滤array1 中与array2 相同的元素；
    //         }
    //     }
    //     for (let i = 0; i < tem2.length; i++) {
    //         this.data.failurepheno[tem2[i]].checked = false
    //     }
    //     for (let i = 0; i < arr2.length; i++) {
    //         this.data.failurepheno[arr2[i]].checked = true
    //     }
    //     this.setData({
    //         failurepheno: this.data.failurepheno,

    //     })
    //     for (let i = 0; i < this.data.failurepheno.length; i++) {
    //         if (this.data.failurepheno[i].checked) {
    //             this.setData({
    //                 watch3: true
    //             })
    //             break;
    //         } else {
    //             this.setData({
    //                 watch3: false
    //             })
    //         }
    //     }
    //     this.watch()
    // },
    // //点击添加故障现象
    // addphonement: function (e) {
    //     this.setData({
    //         add: true,
    //         addphoneStr:''
    //     })
    // },
    // // 取消添加故障现象的弹窗
    // cancel: function () {
    //     this.setData({
    //         add: false
    //     })
    // },
    // nocancel: function () {
    //     this.setData({
    //         add: true
    //     })
    // },
    // // 现象的自定义
    // phonecontent: function (e) {

    //     this.setData({
    //         addphoneStr: e.detail.value,

    //     })

    // },
    // // 点击添加故障现象的弹窗的确定按钮的时候,需要在数组里push进去
    // addPhone: function () {
    //     if (this.data.addphoneStr) {
    //         this.setData({
    //             add: false,
    //             watch3: true,
    //             failurepheno: this.data.failurepheno.concat({ name: this.data.addphoneStr, checked: true, keyId: this.data.addphoneStr })
    //         })
    //         this.watch()
    //     } else {
    //         this.setData({
    //             add: false,
    //         })
    //     }

    // },
    // //工作内容的check
    // // 
    // workcheckboxChange: function (e) {

    //     // this.data.worktxt[e.detail.value.length - 1].checked = true
    //     var arr1 = []
    //     var arr2 = []
    //     arr2 = e.detail.value
    //     for (let i = 0; i < this.data.worktxt.length; i++) {
    //         arr1.push(i)
    //     }
    //     var tem1 = []
    //     var tem2 = []
    //     for (var i = 0; i < arr2.length; i++) {
    //         tem1[arr2[i]] = true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
    //     }
    //     for (var i = 0; i < arr1.length; i++) {
    //         if (!tem1[arr1[i]]) {
    //             tem2.push(arr1[i]);//过滤array1 中与array2 相同的元素；
    //         }
    //     }
    //     for (let i = 0; i < tem2.length; i++) {
    //         this.data.worktxt[tem2[i]].checked = false
    //     }
    //     for (let i = 0; i < arr2.length; i++) {
    //         this.data.worktxt[arr2[i]].checked = true
    //     }
    //     this.setData({
    //         worktxt: this.data.worktxt,

    //     })
    //     for (let i = 0; i < this.data.worktxt.length; i++) {
    //         if (this.data.worktxt[i].checked) {

    //             this.setData({
    //                 watch4: true

    //             })
    //             break
    //         } else {
    //             this.setData({
    //                 watch4: false

    //             })
    //         }
    //     }
    //     this.watch()
    // },
    // //点击添加工作内容
    // addwork: function () {
    //     this.setData({
    //         work: true,
    //         workStr:''
    //     })
    // },
    // // 取消添加工作内容的弹窗
    // workcancel: function () {
    //     this.setData({
    //         work: false
    //     })
    // },
    // worknocancel: function () {
    //     this.setData({
    //         work: true
    //     })
    // },
    // // 工作的自定义
    // workcontent: function (e) {

    //     this.setData({
    //         workStr: e.detail.value,

    //     })

    // },
    // // 点击添加工作内容的弹窗的确定按钮的时候,需要在数组里push进去
    // workaddPhone: function () {
    //     if (this.data.workStr) {
    //         this.setData({
    //             work: false,
    //             watch4: true,
    //             worktxt: this.data.worktxt.concat({ name: this.data.workStr, checked: true, keyId: this.data.workStr })
    //         })
    //         this.watch()
    //     } else {
    //         this.setData({
    //             work: false
    //         })
    //     }
    // },
    // // 故障原因checl
    // reasoncheckboxChange: function (e) {

    //     // this.data.failurepheno[e.detail.value.length - 1].checked = true
    //     if (this.data.reasonIndex == 0) {
    //         // this.data.peopelereason[e.detail.value.length - 1].checked = true
    //         var arr1 = []
    //         var arr2 = []
    //         arr2 = e.detail.value
    //         for (let i = 0; i < this.data.peopelereason.length; i++) {
    //             arr1.push(i)
    //         }
    //         var tem1 = []
    //         var tem2 = []
    //         for (var i = 0; i < arr2.length; i++) {
    //             tem1[arr2[i]] = true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
    //         }
    //         for (var i = 0; i < arr1.length; i++) {
    //             if (!tem1[arr1[i]]) {
    //                 tem2.push(arr1[i]);//过滤array1 中与array2 相同的元素；
    //             }
    //         }
    //         for (let i = 0; i < tem2.length; i++) {
    //             this.data.peopelereason[tem2[i]].checked = false
    //         }
    //         for (let i = 0; i < arr2.length; i++) {
    //             this.data.peopelereason[arr2[i]].checked = true
    //         }
    //         this.setData({
    //             peopelereason: this.data.peopelereason,

    //         })
    //         for (let i = 0; i < this.data.peopelereason.length; i++) {
    //             if (this.data.peopelereason[i].checked) {
    //                 this.setData({

    //                     watch5: true
    //                 })
    //                 break


    //             } else {
    //                 this.setData({

    //                     watch5: false
    //                 })
    //             }
    //         }
    //     } else if (this.data.reasonIndex == 1) {
    //         // this.data.assestReason[e.detail.value.length - 1].checked = true
    //         var arr1 = []
    //         var arr2 = []
    //         arr2 = e.detail.value
    //         for (let i = 0; i < this.data.assestReason.length; i++) {
    //             arr1.push(i)
    //         }
    //         var tem1 = []
    //         var tem2 = []
    //         for (var i = 0; i < arr2.length; i++) {
    //             tem1[arr2[i]] = true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
    //         }
    //         for (var i = 0; i < arr1.length; i++) {
    //             if (!tem1[arr1[i]]) {
    //                 tem2.push(arr1[i]);//过滤array1 中与array2 相同的元素；
    //             }
    //         }
    //         for (let i = 0; i < tem2.length; i++) {
    //             this.data.assestReason[tem2[i]].checked = false
    //         }
    //         for (let i = 0; i < arr2.length; i++) {
    //             this.data.assestReason[arr2[i]].checked = true
    //         }
    //         this.setData({
    //             assestReason: this.data.assestReason,

    //         })
    //         for (let i = 0; i < this.data.assestReason.length; i++) {
    //             if (this.data.assestReason[i].checked) {
    //                 this.setData({

    //                     watch5: true
    //                 })
    //                 break


    //             } else {
    //                 this.setData({

    //                     watch5: false
    //                 })
    //             }
    //         }
    //     } else {
    //         // this.data.outReason[e.detail.value.length - 1].checked = true
    //         var arr1 = []
    //         var arr2 = []
    //         arr2 = e.detail.value
    //         for (let i = 0; i < this.data.outReason.length; i++) {
    //             arr1.push(i)
    //         }
    //         var tem1 = []
    //         var tem2 = []
    //         for (var i = 0; i < arr2.length; i++) {
    //             tem1[arr2[i]] = true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
    //         }
    //         for (var i = 0; i < arr1.length; i++) {
    //             if (!tem1[arr1[i]]) {
    //                 tem2.push(arr1[i]);//过滤array1 中与array2 相同的元素；
    //             }
    //         }
    //         for (let i = 0; i < tem2.length; i++) {
    //             this.data.outReason[tem2[i]].checked = false
    //         }
    //         for (let i = 0; i < arr2.length; i++) {
    //             this.data.outReason[arr2[i]].checked = true
    //         }
    //         this.setData({
    //             outReason: this.data.outReason,

    //         })
    //         for (let i = 0; i < this.data.outReason.length; i++) {
    //             if (this.data.outReason[i].checked) {
    //                 this.setData({

    //                     watch5: true
    //                 })
    //                 break


    //             } else {
    //                 this.setData({

    //                     watch5: false
    //                 })
    //             }
    //         }
    //     }

    //     this.watch()
    // },

    // //点击添加故障原因
    // troublereason: function () {
    //     this.setData({
    //         reason: true,
    //         faultReasonStr:''
    //     })
    // },
    // // 取消添加故障原因的弹窗
    // reasoncancel: function () {
    //     this.setData({
    //         reason: false
    //     })

    // },
    // reasonnocancel: function () {
    //     this.setData({
    //         reason: true
    //     })
    // },
    // //自定义故障原因
    // reasoncontent: function (e) {

    //     this.setData({
    //         faultReasonStr: e.detail.value,

    //     })

    // },
    // // 点击添加故障原因的弹窗的确定按钮的时候,需要在数组里push进去
    // reasonaddPhone: function () {
    //     if (this.data.faultReasonStr) {
    //         this.setData({
    //             reason: false,
    //             watch5: true
    //         })
    //         if (this.data.reasonIndex == 0) {
    //             this.setData({
    //                 peopelereason: this.data.peopelereason.concat({ name: this.data.faultReasonStr, checked: true, keyId: this.data.faultReasonStr })
    //             })

    //         } else if (this.data.reasonIndex == 1) {
    //             this.setData({
    //                 assestReason: this.data.assestReason.concat({ name: this.data.faultReasonStr, checked: true, keyId: this.data.faultReasonStr })
    //             })
    //         } else {
    //             this.setData({
    //                 outReason: this.data.outReason.concat({ name: this.data.faultReasonStr, checked: true, keyId: this.data.faultReasonStr })
    //             })
    //         }
    //         this.watch()
    //     } else {
    //         this.setData({
    //             reason: false,

    //         })
    //     }
    // },
    // // 点击上部的故障原因
    // reasonclick: function (e) {
    //     this.setData({
    //         reasonIndex: e.currentTarget.dataset.reasonIndex
    //     })
    // },
    // // 点击下拉出现单位
    // unitShow: function () {
    //     this.setData({
    //         unitHidden: !this.data.unitHidden
    //     })

    // },
    // // 点击下拉出现来源
    // partStatusShow: function () {
    //     this.setData({
    //         partStatusHidden: !this.data.partStatusHidden
    //     })

    // },
    // // partStatusClick
    // //点击下拉菜单出现对勾
    // partStatusClick: function (e) {
    //     this.setData({
    //         partStatus: e.currentTarget.dataset.partStatus,
    //         partStatusHidden: !this.data.partStatusHidden,
    //         partStatusName: e.currentTarget.dataset.partStatusname,
    //     })
    // },
    // //点击下拉菜单出现对勾
    // unitClick: function (e) {
    //     this.setData({
    //         unitIndex: e.currentTarget.dataset.unitIndex,
    //         unitHidden: !this.data.unitHidden,
    //         unitName: e.currentTarget.dataset.unitName,
    //         unitkey: e.currentTarget.dataset.unitKey
    //     })
    // },

    // //点击添加配件
    // addpart: function () {
    //     this.setData({
    //         part: true,
    //         partStatusHidden:true,
    //         unitHidden:true,
    //         num: 1,
    //         partSpec: '',
    //         partProduce: '',
    //         partPrice: '',
    //         unitName: '个',
    //         unitKey: 1001,
    //         partName: '',
    //         partFlag: false,
    //         parttxt: '添加配件',
    //         over: true,
    //         partStatusName: '',//来源
    //         partStatus: -1,//来源数字
    //     })
    // },
    // // 取消添加配件的弹窗
    // partcancel: function () {
    //     this.setData({
    //         part: false,
    //         over: false,
    //         partStatusName: '',//来源
    //         partStatus: -1,//来源数字
    //     })
    // },
    // partnocancel: function () {
    //     this.setData({
    //         part: true,
    //         over: true
    //     })
    // },

    // // 点击添加配件的弹窗的    确定按钮的时候,需要在数组里push进去
    // partaddPhone: function () {
    //     console.log(this.data)

    //     if (this.data.partName && this.data.num && this.data.unitName && this.data.partStatusName) {
    //         if (!this.data.partFlag) {
    //             //放到数组里面
    //             var obj = {
    //                 "num": this.data.num,//操作数量 ,
    //                 "partName": this.data.partName,//配件名称 ,
    //                 "partPrice": this.data.partPrice,//配件单价 ,
    //                 "partProduce": this.data.partProduce,//配件生产商 ,
    //                 "partSpec": this.data.partSpec,//规格型号
    //                 "reportId": '',//维修报告ID ,
    //                 "status": 2,// 操作类型（1入库 2 出库） ,
    //                 "tenantId": wx.getStorageSync("userInfo").tenantId,//机构ID
    //                 "unit": this.data.unitkey,// 计数单位 ,
    //                 "unitName": this.data.unitName,
    //                 "status": this.data.partStatus,//配件来源
    //             }
    //             this.data.partList.push(obj)

    //         } else {
    //             //说明是修改的配件
    //             // parteq修改的角标
    //             this.data.partList[this.data.parteq] = {


    //                 "num": this.data.num,//操作数量 ,
    //                 "partName": this.data.partName,//配件名称 ,
    //                 "partPrice": this.data.partPrice,//配件单价 ,
    //                 "partProduce": this.data.partProduce,//配件生产商 ,
    //                 "partSpec": this.data.partSpec,//规格型号
    //                 "reportId": this.data.reportId,//维修报告ID ,
    //                 //"status": 2,// 操作类型（1入库 2 出库） ,
    //                 "tenantId": wx.getStorageSync("userInfo").tenantId,//机构ID
    //                 "unit": this.data.unitkey,// 计数单位 ,
    //                 "unitName": this.data.unitName,
    //                 "status": this.data.partStatus,//配件来源
    //             }

    //         }
    //         this.setData({
    //             nopart: false,
    //             part: false,
    //             partList: this.data.partList,
    //             over: false

    //         })

    //     }
    //     if (!this.data.partName && !this.data.partSpec && !this.data.partProduce) {

    //         this.setData({
    //             part: false,
    //             over: false

    //         })
    //     }
    //     // 计算配件
    //     if (!this.data.nosum) {
    //       this.complutepart()
    //     }
    // },
    // //点击修改配件
    // repart: function (e) {
    //     let i = e.currentTarget.dataset.addpartIndex
    //     this.setData({
    //         partFlag: true,//修改配件
    //         part: true,//弹窗出现
    //         partStatusHidden: true,
    //         unitHidden: true,
    //         over: true,
    //         parttxt: '修改配件',
    //         num: this.data.partList[i].num,
    //         partSpec: this.data.partList[i].partSpec,
    //         partProduce: this.data.partList[i].partProduce || '',
    //         partPrice: this.data.partList[i].partPrice,
    //         unitName: this.data.partList[i].unitName,
    //         unitkey: this.data.partList[i].unit,
    //         partName: this.data.partList[i].partName,
    //         reportId: this.data.partList[i].reportId,
    //         parteq: i

    //     })
    //     if (this.data.partList[i].status == 1) {
    //         this.setData({
    //             partStatusName: '领用',//来源
    //             partStatus: 1,//来源数字

    //         })
    //     } else {
    //         this.setData({
    //             partStatusName: '购买',//来源
    //             partStatus: 2,//来源数字

    //         })
    //     }
    //     if(this.data.partList[i].unitName=='个'){
    //       this.data.unitIndex=0
    //     } else if (this.data.partList[i].unitName == '盒'){
    //       this.data.unitIndex = 1
    //     }else{
    //       this.data.unitIndex = 2
    //     }
    //     this.setData({
    //       unitIndex: this.data.unitIndex

    //     })
    // },
    // // 长按删除配件
    // removePart: function (e) {
    //     this.setData({
    //         longtapEq: e.currentTarget.dataset.addpartIndex
    //     })
    //     setTimeout(() => {
    //         this.setData({
    //             longtapEq: -1
    //         })
    //     }, 10000)


    // },
    // //删除配件
    // delPart: function () {

    //         // 说明新增加的没有暂存过，又去删除了，这时候不应该传给后台
    //     this.data.partList.splice(this.data.longtapEq, 1)


    //     this.setData({
    //         part: false,//弹窗出现
    //         partList: this.data.partList,
    //         longtapEq: -1,
    //         over: false
    //     })
    //     if (!this.data.nosum) {
    //       this.complutepart()
    //     }
    // },
    // reasult: function (e) {

    //     this.setData({
    //         reasultIndex: e.currentTarget.dataset.reasultIndex,
    //         watch6: true
    //     })
    //     this.watch()

    // },
    // //失去焦点外修单位
    // company: function (e) {
    //     this.setData({
    //         outsideCompany: e.detail.value
    //     })
    //     this.watch()
    // },
    // //失去焦点外修电话
    // phone: function (e) {
    //     this.setData({
    //         outsidePhone: e.detail.value
    //     })
    //     this.watch()
    // },
    // //失去焦点工程师名字
    // outName: function (e) {
    //     this.setData({
    //         engineerName: e.detail.value
    //     })
    //     this.watch()
    // },
    // //失去焦点工程师编号
    // outNum: function (e) {
    //     this.setData({
    //         engineerNum: e.detail.value
    //     })
    //     this.watch()
    // },
    // //维修工时
    // gongshi: function (e) {
    //     this.setData({
    //         repairHours: e.detail.value,

    //     })
    //     this.watch()
    // },
    // //失去焦点维修费
    // weixiumoney: function (e) {
    //     let val = '';
    //     if (e.detail.value) {
    //         val = e.detail.value.match(/^[0-9]\d*(?:\.\d{0,2})?/)[0]
    //     }
    //     this.setData({
    //         repairCost: val
    //     })

    //     // this.setData({
    //     //   repairCost: e.detail.value,

    //     // })

    //     if (this.data.repairCost === 0 || this.data.repairCost) {
    //         this.setData({

    //             watch7: true
    //         })
    //     } else {
    //         this.setData({

    //             watch7: false
    //         })
    //     }
    //     this.watch()
    // },
    // //失去焦点材料费
    // partmoney: function (e) {
    //     let val = '';
    //     if (e.detail.value) {
    //         val = e.detail.value.match(/^[0-9]\d*(?:\.\d{0,2})?/)[0]
    //     }
    //     this.setData({
    //         partsCost: val,
    //         nosum:true
    //     })

    //     if (this.data.partsCost === 0 || this.data.partsCost) {
    //         this.setData({

    //             watch8: true
    //         })
    //     } else {
    //         this.setData({

    //             watch8: false
    //         })
    //     }
    //     this.watch()
    // },
    // // 失去焦点发票号码
    // fapiaomoney: function (e) {
    //     this.setData({
    //         repairInvoice: e.detail.value,

    //     })
    //     this.watch()
    // },
    // // 失去焦点备注

    // textremark1: function (e) {
    //     this.setData({
    //         repairremarks1: e.detail.value
    //     })
    // },
    // textremark2: function (e) {
    //     this.setData({
    //         repairremarks2: e.detail.value
    //     })
    //     console.log(this.data.repairremarks2)
    // },
    // //失去焦点配件名字
    // partname: function (e) {
    //     this.setData({
    //         partName: e.detail.value
    //     })
    // },
    // //失去焦点的生产商
    // partcom: function (e) {
    //     this.setData({
    //         partProduce: e.detail.value
    //     })
    // },
    // //规格型号
    // partsize: function (e) {
    //     this.setData({
    //         partSpec: e.detail.value
    //     })
    // },
    // //失去焦点的单价
    // peijianunit: function (e) {
    //     let val = '';
    //     if (e.detail.value) {
    //         val = e.detail.value.match(/^[0-9]\d*(?:\.\d{0,2})?/)[0]
    //     }
    //     this.setData({
    //         partPrice: val
    //     })
    // },
    // //失去焦点的数量
    // partnum: function (e) {
    //     if (/^\d{1,}$/.test(e.detail.value)) {


    //         this.setData({
    //             num: e.detail.value
    //         })
    //     } else {

    //         this.setData({
    //             num: ''
    //         })
    //     }
    // },

    // // 监听完修的方法
    // watch: function () {
    //   console.log(this.data.methodsIndex)
    //     var str = ''
    //     //工作方式：自主维修、---watch1 外修-----watch11    现场解决----watch2     故障现象------watxh3
    //     //工作内容：watch4  故障原因----watch5    维修结果-----watch6  维修费---watch7 
    //     //材料费 ----watch8  选择外修是外修单位-----watch9  外修电话-------watch10  工程师名字------watch13 工程师编号---watch14  
    //     if (this.data.methodsIndex == 1) {
    //         if (this.data.outsideCompany) {
    //             this.data.watch9 = true
    //         } else {
    //             this.data.watch9 = false
    //         }
    //         if (this.data.outsidePhone) {
    //             this.data.watch10 = true
    //         } else {
    //             this.data.watch10 = false
    //         }
    //         if (this.data.engineerName) {
    //             this.data.watch13 = true
    //         } else {
    //             this.data.watch13 = false
    //         }
    //         if (this.data.engineerNum) {
    //             this.data.watch14 = true
    //         } else {
    //             this.data.watch14 = false
    //         }
    //     }
    //     str = (this.data.watch1) && (this.data.watch3) && (this.data.watch4) && (this.data.watch5) && (this.data.watch6) && (this.data.watch7) && (this.data.watch8)

    //     if (this.data.methodsIndex == 0) {
    //         if (str) {
    //             this.setData({
    //                 disabledrepair: false
    //             })
    //         } else {
    //             this.setData({
    //                 disabledrepair: true
    //             })
    //         }
    //     } else if (this.data.methodsIndex == 2) {
    //         if (this.data.watch2) {
    //             this.setData({
    //                 disabledrepair: false
    //             })
    //         } else {
    //             this.setData({
    //                 disabledrepair: true
    //             })
    //         }
    //         console.log('kkkkkk')
    //         console.log(this.data.disabledrepair)
    //     } else {
    //         if ((this.data.watch11) && (this.data.watch3) && (this.data.watch4) && (this.data.watch5) && (this.data.watch6) && (this.data.watch7) && (this.data.watch8) && (this.data.watch9) && (this.data.watch10) && (this.data.watch13) && (this.data.watch14) && this.data.repairHours && (this.data.callRepair1 != '请选择') && (this.data.callRepair2 != '请选择') && (this.data.arrival1 != '请选择') && (this.data.arrival2 != '请选择') && (this.data.leave1 != '请选择') && (this.data.leave2 != '请选择')) {
    //             this.setData({
    //                 disabledrepair: false
    //             })
    //         } else {
    //             this.setData({
    //                 disabledrepair: true
    //             })
    //         }
    //     }

    // },
    // //完修
    // complate: function () {
    //     let _this = this
    //     wx.showModal({
    //         // title: '提示',
    //         confirmColor: '#508cee',
    //         cancelColor: '#999',
    //         content: '提交后不可再修改，确定提交吗？',
    //         success: function (res) {
    //             if (res.confirm) {

    //                 _this.setData({
    //                     methodsSumit: 2
    //                 })

    //                 _this.postReport()
    //             } else if (res.cancel) {
    //                 console.log('用户点击取消')
    //             }
    //         }
    //     })


    // },
    // 点击提交按钮
    btnClick: function () {
        if (this.data.status == 1) {
            let _this = this
            //  接单
            var strings = _this.data.date + ' ' + _this.data.time
            strings = strings.replace(new RegExp(/-/gm), "/");
            var predictReachDate = ''
            predictReachDate = new Date(strings).getTime()

            wx.showModal({
                // title: '提示',
                confirmColor: '#508cee',
                cancelColor: '#999',
                content: '提交后不可再修改，确定接单吗？',
                success: function (res) {
                    if (res.confirm) {
                        //  发送接单请求======================================================new
                        api.optionPost({
                            data: {
                                "repairId": _this.data.peopleid,
                                "repairName": _this.data.people,
                                "applyId": _this.data.applyid,
                                "predictReachDate": predictReachDate,
                                "remarks": _this.data.orderremark,
                            },
                            isNoToken: false,
                            success: function (res) {
                                if (res.data.code == 200) {
                                    wx.navigateBack({
                                        url: 'repairlist',
                                    })
                                }
                            }
                        })


                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        } else if (this.data.status == 2) {


        } else if (this.data.status == 3) {
            // 验收
            let _this = this

            wx.showModal({
                // title: '提示',
                confirmColor: '#508cee',
                cancelColor: '#999',
                content: '提交后不可再修改，确定验收吗？',
                success: function (res) {
                    if (res.confirm) {
                        //  发送验收请求
                        api.acceptPost({
                            data: {
                                "applyId": _this.data.applyid,
                                "remarks": _this.data.acceptremark,
                                "repairAttitude": _this.data.score3,
                                "repairQuality": _this.data.score1,
                                "responseSpeed": _this.data.score2
                            },
                            isNoToken: false,
                            success: function (res) {
                                if (res.data.code == 200) {
                                    wx.navigateBack({
                                        url: 'repairlist',
                                    })
                                }
                            },
                            fail(msg, res) {
                                if (res.data.code == "W_023") {
                                    this.setData({
                                        totastHide3: false
                                    })
                                    setTimeout(() => {
                                        this.setData({
                                            totastHide3: true
                                        })
                                        wx.navigateBack({
                                            delta: 1,
                                        })
                                    }, 500)
                                }
                            }
                        })


                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    onUnload: function () {
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];   //当前页面
        let prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
            "child": true,

        })
    },
    setImgFlag: function () {
        if (this.data.newFiles && this.data.newFiles.length > 0) {
            for (var i = 0, len = this.data.newFiles.length; i < len; i++) {
                this.data.newFiles[i].isImg = this.isImg(this.data.newFiles[i].uploadUrl);
            }
            this.setData(this.data);
        }
    },
    isImg: function (name) {
        var suportsuffix = "png|jpg|jpeg|gif|bmp",
            suffix = name.substr(name.lastIndexOf('.') + 1).toLocaleLowerCase();
        console.log("url:" + name + "  ==> " + suportsuffix.indexOf(suffix) >= 0);
        return suportsuffix.indexOf(suffix) >= 0;
    }

})