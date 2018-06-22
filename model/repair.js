const util = require('../utils/util.js')

function RepairServer(apply, status) {
    function getIds(list) {
        let ids = []
        list.map(item => {
            if (item.checked) {
                ids.push(item.name)
            }
        })
        return ids.join(',')
    } 

    function getTime(date, time) {
        if((date && date.length) || (time && time.length)){
            if(date.length) {
                date = date.replace(new RegExp(/-/gm), "/")
            }
            return (new Date((date || '') + ' ' + (time || '00:00') + ':00')).getTime() 
        }
        return ''
    }    

    this.applyId = apply.applyId                         // 申请单id
    this.reportStatus = apply.reportStatus          // 接单类型 1：送修 2：现场维修
    this.modeStatus = apply.modeStatus              // 工作方式-维修方式（1：自主维修 2：外修 3：现场解决）
    this.faultType = apply.modeStatus > 1 ? apply.faultTypeOut : apply.faultType           // 工作方式-故障类型
    this.outsideCompany = apply.outsideCompany      // 工作方式-外修单位
    this.outsidePhone = apply.outsidePhone          // 工作方式-外修电话
    this.engineerName = apply.engineerName          // 工作方式-工程师姓名
    this.engineerNum = apply.engineerNum            // 工作方式-工程师编号
    this.faultPhenomenon = getIds(apply.dic.FAULT_PHENOMENON)                       // 故障现象(自定义单独拼接成串,格式1，2，3，电源问题)
    this.faultReason = getIds([].concat(apply.dic.HUMAN_FACTOR, apply.dic.EQUIPMENT_FAILURE, apply.dic.EXTERNAL_FACTORS, apply.dic.OTHER_FACTOR))                          // 故障原因(自定义单独拼接成串,格式1，2，3，电源问题)
    this.workContent = getIds(apply.dic.JOB_CONTENT)                           // 工作内容(自定义单独拼接成串,格式1，2，3，电源问题)
    this.list = apply.list                          // 配件数组
    this.repairResult = apply.repairResult          // 维修结果-维修结果
    this.actualEndDate = ""                         // 维修开始时间-工作方式-自主维修 完修时间
    this.repairEndDate = ""                         // 维修结束时间-工作方式-自主维修 维修时间 
    this.callRepairDate = ""                        // 维修结果-叫修时间-工作方式-外修
    this.arrivalDate = ""                           // 维修结果-到达时间-工作方式-外修
    this.leaveDate = ""                             // 维修结果-离开时间-工作方式-外修
    this.repairHours = apply.repairHours            // 维修结果-维修工时
    this.repairCost = apply.repairCost              // 维修结果-维修费用 
    this.partsCost = apply.partsCost                // 维修结果-材料费用
    this.repairInvoice = apply.repairInvoice        // 维修结果-发票号码（用；分割）
    this.remarks = apply.remarks                    // 维修结果-维修备注/工作方式-现场解决备注
    this.status = status                            // 报告方式（1，暂存 2，完修）
    this.sendPerson = apply.sendPerson          //送修人
    this.sendPhone = apply.sendPhone            //送修人电话
    this.troubleCode = apply.troubleCode            //故障代码
    if (apply.modeStatus === 1){
        this.actualEndDate = getTime(apply.actualEndDate, apply.actualEndTime)   
        this.repairEndDate = getTime(apply.repairEndDate, apply.repairEndTime) 
    } else if (apply.modeStatus === 2){
        this.callRepairDate = getTime(apply.callRepairDate, apply.callRepairTime)      
        this.arrivalDate = getTime(apply.arrivalDate, apply.arrivalTime)         
        this.leaveDate = getTime(apply.leaveDate,  apply.leaveTime)  
    } else if (apply.modeStatus === 3){
        this.remarks = apply.workRemarks
    }
}

function RepairLocal() {
    this.applyId = 0             // 申请单id
    this.reportStatus = 1        // 接单类型 1：送修（默认） 2：现场维修
    this.modeStatus = 1          // 工作方式-维修方式（1：自主维修（默认） 2：外修 3：现场解决）
    this.faultType = 1           // 工作方式-故障类型（1~3）
    this.faultTypeOut = 0        // 工作方式-故障类型（4~7）
    this.outsideCompany = ""     // 工作方式-外修单位
    this.outsidePhone = ""       // 工作方式-外修电话
    this.engineerName = ""       // 工作方式-工程师姓名
    this.engineerNum = ""        // 工作方式-工程师编号
    this.workRemarks = ""        // 工作方式-现场解决备注
    this.faultReason = 0         // 故障原因类型（1：人为因素 2：设备因素 3：外界环境因素）
    this.list = []               // 配件数组
    this.repairResult = 1        // 维修结果-维修结果 1：正常工作（默认值） 2：基本功能正常 3：需进一步修理 4：需外送修理 5：无法修复 6：其他
    this.actualEndDate = ""    // 维修开始时间-工作方式-自主维修
    this.actualEndTime = ""
    this.repairEndDate = ""      // 维修结束时间-工作方式-自主维修
    this.repairEndTime = ""
    this.callRepairDate = ""     // 维修结果-叫修时间-工作方式-外修
    this.callRepairTime = ""
    this.arrivalDate = ""        // 维修结果-到达时间-工作方式-外修
    this.arrivalTime = ""
    this.leaveDate = ""          // 维修结果-离开时间-工作方式-外修
    this.leaveTime = ""
    this.repairHours = ""        // 维修结果-维修工时
    this.repairCost = ""         // 维修结果-维修费用 
    this.partsCost = ""          // 维修结果-材料费用
    this.repairInvoice = ""      // 维修结果-发票号码（用；分割）
    this.remarks = ""            // 维修结果-维修备注
    this.sendPerson = ""         //送修人
    this.sendPhone = ""          //送修人电话
    this.troubleCode = ""        //故障代码
    this.dic = {
        'FAULT_PHENOMENON': [],   // 故障现象
        'HUMAN_FACTOR': [],       // 故障原因-人为因素
        'EQUIPMENT_FAILURE': [],  // 故障原因-设备因素
        'EXTERNAL_FACTORS': [],   // 故障原因-外界环境因素
        'JOB_CONTENT': [],        // 工作内容
        'PARTS_UNIT': [],         // 配件信息-配件单位
        'OTHER_FACTOR': []        // 故障原因-其它
    }

    this.sideList = [
        { id: 1, name: '接单类型', display: true, require: true },
        { id: 2, name: '工作方式', display: true, require: true },
        { id: 3, name: '故障现象', display: true, require: true },
        { id: 4, name: '故障代码', display: true, require: false },
        { id: 5, name: '故障原因', display: true, require: true },
        { id: 6, name: '工作内容', display: true, require: true },
        { id: 7, name: '配件信息', display: true, require: false },
        { id: 8, name: '维修结果', display: true, require: true }
    ]

    this.reportStatusList = [
        { id: 1, name: '送修' },
        { id: 2, name: '现场维修' }
    ]

    this.repairTypeList = [
        { id: 1, name: '自主维修' },
        { id: 2, name: '外修' },
        { id: 3, name: '现场解决' }
    ]

    this.selfRepairList = [
        { id: 1, name: '故障维修' },
        { id: 2, name: '预防性维修' },
        { id: 3, name: '计量、检测后维修' }
    ]

    this.outRepairList = [
        { id: 4, name: '质保期内维修' },
        { id: 5, name: '厂家合同维修' },
        { id: 6, name: '第三方合同维修' },
        { id: 7, name: '临时维修' }
    ]

    this.faultReasonList = [
        { id: 1, name: '人为因素' },
        { id: 2, name: '设备故障' },
        { id: 3, name: '外界环境因素' },
        { id: 4, name: '其他'}
    ]

    this.repairResultList = [
        { id: 1, name: '正常工作' },
        { id: 2, name: '基本功能正常' },
        { id: 3, name: '需进一步修理' },
        { id: 4, name: '需外送修理' },
        { id: 5, name: '无法修复' },
        { id: 6, name: '其他' }
    ]
}

module.exports = {
    RepairServer,
    RepairLocal
}