// pages/assestbook/newassest.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
  data: {
    disabled: true,//按钮是否能用
    content:'提交',//按钮的内容
    moreList:true,//点击更多显示隐藏
    devicename:'',//设备名称
    producer:'',//生产商
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
    dept:'请选择',//所在部门的变量
    size:'',//规格型号
    registeruNum:'',//注册证号
    leavefactoryNum:'',//出厂编号
    classifyNum:'',//三级分类代码
    provider:'',//供应商
    userInfo: wx.getStorageSync("userInfo"),
    deptName:"",//部门名称
    deptId:0, //部门id
    manage_level:[],//管理级别
    fund_sources:[], //资金来源
  },
  // 字段赋值
  fillField: function (e) {
    let data = {};
    data[e.currentTarget.dataset.key] = e.detail.value;
    this.setData(data);
   // console.log(this.data);
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
  // 点击展开更多
  more:function(){
    this.setData({
      moreList: false
    })
  },
  // 点击收起
  slidup:function(){
    this.setData({
      moreList: true
    })
  },
  //获取字典
  getCodeInfoByType: function () {
    let _this = this;
    api.getCodeInfoByType({
      isNoToken: false,
      success: function (res) {
        _this.setData({
          accountList: res.data.data.ACCOUNT_CATEGORY     //核算类别
        })
        _this.setData({
          manage_level: res.data.data.MANAGE_LEVEL         //管理级别
        })
        _this.setData({
          fund_sources: res.data.data.FUND_SOURCES         //资金来源
        })
        //console.log("资金来源");
        //console.log(_this.data.fund_sources);
      }
    })
  },
   addPreAssets:function(){
     api.addPreAssets({
       isNoToken:false,
      data:{
        "assetsName": this.data.devicename,         // 设备名称
        "assetsSource": 2,                          // 设备来源  2表示新建
        "assetsSpec": this.data.size,               // 规格型号
        "assetsStatus": 2,                          // 1：新建台账；2：预台账
        "deptId": this.data.deptId,                 // 部门id
        "factoryName": this.data.producer,          // 厂商
        "factoryNum": this.data.leavefactoryNum,    // 出厂编号
        "fundSourcesId": this.data.moneyeq,         // 资金来源
        "manageLevel": this.data.manageeq,          // 管理级别
        "regNo": this.data.registeruNum,            // 注册证号
        "splName": this.data.provider,              // 供应商
        "startUseDate": this.data.startUseDate,     // 启用日期
        //"status": this.data.assestStatusNum,        // 状态
        "threeLevelCode": this.data.classifyNum,    // 三级分类代码   
      },
       success:function(res){
         wx.navigateTo({
           url: 'beforeassestlist',
         })
       }
     })
   },
   bindDateChange:function(e){
      this.setData({
        startUseDate: e.detail.value
      })
   },  
  // 选择部门
  choosedepart:function(){
    wx.navigateTo({
      url: 'choosedepart',
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
  // 点击管理级别出现弹窗
  choosemoney: function () {
    this.setData({
      moneyHide: false,
    })
  },
  // 弹窗方法
  chooseHost: function (event) {
  // 如果选择是核算类别
    if (!this.data.accountHide){
      this.setData({
        accounteq: event.currentTarget.dataset.codevalue,
        account: event.currentTarget.dataset.codetext,
        accountHide: true
      })
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
  // 弹窗消失
  hostModal: function () {
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
  btnClick:function(){
    this.addPreAssets()
   
  },
  fillChoosePart: function (id, name) {
    this.setData({
      "deptName": name,
      "deptId": id
    });
    this.setBtnStatus();
  },
  onLoad:function(){
    this.getCodeInfoByType()
  }
})