// pages/assestbook/newassest.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()

Page({
    data: {
        disabled: true,//按钮是否能用
        content: '提交',//按钮的内容
        moreList: true,//点击更多显示隐藏
        devicename: '',//设备名称
        producer: '',//生产商
        statusHide: true,//选择状态的modal控制显示隐藏
        statusList: ['在库', '在用', '维修中'],//选择状态的模态框的列表
        statuseq: 1,//选择状态的角标
        status: '请选择',//选择状态绑定的值
        accountHide: true,//核算类别的modal控制显示隐藏
        accountList: ['核算类别', '核算', '类别'],//核算类别的模态框的列表
        accounteq: -1,//核算类别的角标
        account: '请选择',//核算类别绑定的值
        manageHide: true,//管理的modal控制显示隐藏
        manageList: ['核算类别', '核算', '类别'],//管理的模态框的列表
        manageeq: -1,//管理的角标
        manage: '请选择',//管理绑定的值
        moneyHide: true,//资金来源的modal控制显示隐藏
        moneyList: ['100万', '10万', '1亿'],//资金来源的模态框的列表
        moneyeq: -1,//资金来源的角标
        money: '请选择',//资金来源绑定的值
        dept: '请选择',//所在部门的变量
        size: '',//规格型号
        registeruNum: '',//注册证号
        leavefactoryNum: '',//出厂编号
        classifyNum: '',//三级分类代码
        provider: '',//供应商
        deptName: '',
        deptId: "",
        assestStatus: '在用',          //设备状态
        assestStatusNum: 2,   //设备状态值 
        assestStatusList: [
          { 'status':'在库', 'statusNum':1},
          { 'status': '在用', 'statusNum': 2 },
          { 'status': '预登', 'statusNum': 3 },
          { 'status': '待报损', 'statusNum': 4},
          { 'status': '报损', 'statusNum': 5 },
          { 'status': '退货', 'statusNum': 6 },
        ],
        manage_level: [],         //管理级别
        fund_sources: [],
        startUseDate: "",
        assetsSource:'',//来源
        serialNum:'',//院内编码
    },
    // 字段赋值
    fillField: function (e) {
        let data = {};
        data[e.currentTarget.dataset.key] = e.detail.value;
        this.setData(data);
       
        // 按钮状态校验
        if (e.currentTarget.dataset.check) {
            this.setBtnStatus();
        }
    },
    setBtnStatus: function () {
        this.setData({
            disabled: !(this.data.deptId > 0 && this.data.devicename.length && this.data.producer.length)
        });
    },
    fillChoosePart: function (id, name) {
        this.setData({
            "deptName": name,
            "deptId": id
        });
        this.setBtnStatus();
    },
    // // 点击展开更多
    // more: function () {
    //     this.setData({
    //         moreList: false
    //     })
    // },
    // // 点击收起
    // slidup: function () {
    //     this.setData({
    //         moreList: true
    //     })
    // },
    // 选择部门
    choosedepart: function () {
        wx.navigateTo({
            url: 'choosedepart',
        })
    },

    // 点击选择状态出现弹窗
    choosestatus: function () {
        this.setData({
            statusHide: false,
            
        })
    },
    // 点击核算类别出现弹窗
    chooseaccount: function () {
        this.setData({
            accountHide: false,
        })
    },
    // 点击管理级别出现弹窗
    choosemanage: function () {
        this.setData({
            manageHide: false,
        })
    },
    //选择日期
    bindDateChange: function (e) {
        this.setData({
            startUseDate: e.detail.value
        })
    },
    // 点击管理级别出现弹窗
    choosemoney: function () {
        this.setData({
            moneyHide: false,
        })
    },
    // 弹窗方法
    chooseHost: function (event) {
        // 如果是选择状态的弹窗
        if (!this.data.statusHide) {
            this.setData({
                statuseq: event.currentTarget.dataset.hospId,
                assestStatus: event.currentTarget.dataset.statusname,
                assestStatusNum: event.currentTarget.dataset.status,
                statusHide: true
            })
        }

        // 如果选择是核算类别
        if (!this.data.accountHide) {

            this.setData({
                accounteq: event.currentTarget.dataset.codevalue,
                account: event.currentTarget.dataset.codetext,
                accountHide: true
            })
            console.log(this.data);
        }
        // 如果选择是管理级别
        if (!this.data.manageHide) {
            this.setData({
                manageeq: event.currentTarget.dataset.codevalue,
                manage: event.currentTarget.dataset.codetext,
                manageHide: true
            })
        }
        // 如果选择是资金来源
        if (!this.data.moneyHide) {
            this.setData({
                moneyeq: event.currentTarget.dataset.codevalue,
                money: event.currentTarget.dataset.codetext,
                moneyHide: true
            })
        }
    },
    // //获取状态列表
    // getAssestStatusList: function () {
    //     let _this = this;
    //     api.getAssestStautsList({
    //         isNoToken: false,
    //         success: function (res) {
    //             let arr = [];
    //             if (res.data.data) {
    //                 arr = res.data.data.filter(function (item) {
    //                     return item.statusNum > 0 && item.statusNum !== 6
    //                 })
    //             }
    //             _this.setData({
    //                 assestStatusList: arr
    //             })
    //         }
    //     })
    // },
    //获取字典
    getCodeInfoByType: function () {
        let _this = this;
        api.getCodeInfoByType({
            isNoToken: false,
            success: function (res) {
                console.log("获取字典列表");
                console.log(res);
                _this.setData({
                    accountList: res.data.data.ACCOUNT_CATEGORY     //核算类别
                })
                _this.setData({
                    manage_level: res.data.data.MANAGE_LEVEL         //管理级别
                })
                _this.setData({
                    fund_sources: res.data.data.FUND_SOURCES         //资金来源
                })
                console.log("资金来源");
                console.log(_this.data.fund_sources);
            }
        })
    },
    addAsset: function () {
        if (app.globalData.isSave){
            app.globalData.isSave = false;
            let assestData = {
                // "assetsClassId": this.data.accounteq,       // 核算类别id
                "assetsName": this.data.devicename,         // 设备名称
                "assetsSpec": this.data.size,               // 规格型号
                "assetsStatus": 1,                          // 1：新建台账；2：预台账
                "deptId": this.data.deptId,                 // 部门id
                "factoryName": this.data.producer,          // 厂商
                "factoryNum": this.data.leavefactoryNum,    // 出厂编号
                // "fundSourcesId": this.data.moneyeq,         // 资金来源
                // "manageLevel": this.data.manageeq,          // 管理级别
                // "regNo": this.data.registeruNum,            // 注册证号
                "splName": this.data.provider,              // 供应商
                "startUseDate": this.data.startUseDate,     // 启用日期
                "status": this.data.assestStatusNum,        // 状态
                // "threeLevelCode": this.data.classifyNum,    // 三级分类代码    
                "assetsSource": this.data.assetsSource ,     //录入来源  
                "serialNum": this.data.serialNum            //院内编码
            };

            api.addAssets({
                isNoToken: false,
                data: assestData,
                success: function (res) {
                    // wx.redirectTo({
                    //     url: 'assestlist',
                    // })
                    wx.navigateBack({
                        delta: 1
                    })
                },
                complete: function () {
                    app.globalData.isSave = true;
                }
            })
        }
    },
    // 弹窗消失
    hostModal: function () {
        // 如果是选择状态的弹窗
        if (!this.data.statusHide) {
            this.setData({
                statusHide: true
            })
        }
        // 如果选择是核算类别
        if (!this.data.accountHide) {
            this.setData({
                accountHide: true
            })
        }
        // 如果选择是管理类别
        if (!this.data.manageHide) {
            this.setData({
                manageHide: true
            })
        }
        // 如果选择是资金来源
        if (!this.data.moneyHide) {
            this.setData({
                moneyHide: true
            })
        }
    },
    // 点击提交,跳转到资产台账列表页面
    btnClick: function () {
        this.addAsset()       //添加资产台账

    },
    onLoad: function (options) {
        this.setData({
          assetsSource: options.assetsSource
        })
        this.getCodeInfoByType()
        if (options.assetsSource == 2){
          wx.setNavigationBarTitle({
            title: '验收录入'
          })
        }
        if (options.assetsSource == 3){
          wx.setNavigationBarTitle({
            title: '清查录入'
          })
        }

      }
})