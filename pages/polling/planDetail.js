// pages/assestbook/assestdetail.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()
Page({
    data: {
        pullDown: true,
        confirm: true,
        loading: true,
        toasterShow: false,
        toasterTxt: '',
        startBtn: true,
        multiArray: [['a','b','c','d'],[1,2,3,4],['z','x','c','v'],['q','w','e','r']],
        btn: { disabled: false, content: '开始巡检'},
        planInfo: {},
        //editapplyLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_EDIT') != -1 : false, // 资产编辑权限
        totastHide: true,                        //自定义的totast显示隐藏变量
        totastContent: "您还没有权限..."
    },
    onLoad: function (options) {
      this.setData({
          planId: options.id || 20,
          editapplyLimit: wx.getStorageSync("userInfo").authoritiesStr ? wx.getStorageSync("userInfo").authoritiesStr.indexOf('ASS_ASSETS_EDIT') != -1 : false
      })
      let _this = this;
      api.planDetail({
        data: {
            id: this.data.planId
        },
        isNoToken: false,
        complete: function (res) {
          setTimeout(() => {
            _this.setData({
              loading: false
            })
          }, 500);
          if (res.data.code == 200) {
            // 上次巡检日期
            res.data.data.preDate = res.data.data.preDate ? util.formatday(new Date(res.data.data.preDate)) : '无';
            // 下次巡检日期
            res.data.data.nextDate = res.data.data.nextDate ? util.formatday(new Date(res.data.data.nextDate)) : '';
            // 创建日期
            res.data.data.createTime = res.data.data.createTime ? util.formatTime(new Date(res.data.data.createTime)) : '';
            _this.setData({
              planInfo: res.data.data
            });
          }
        }
      })
    },
    btnClick: function (e) {
      if (!this.data.startBtn){
        return
      }
      this.setData({
        confirm: false
      });
    },
    confirm: function(){
      if (!this.data.startBtn) {
        return
      }
      this.setData({
        startBtn: false,
        confirm: true
      });
      let answers = {};
      let resultStatus = 2;
      let resStatus = false;
      let temp = this.data.planInfo.template;
      for (let i = 0; i < temp.length; ++i) {
        resStatus=false;
        for (let j = 0; j < temp[i].projects.length; ++j) {
          if (temp[i].projects[j].isDefault) {
            answers[temp[i].id] = temp[i].projects[j];
            resStatus=true;
          } else {
          }
        }
        !resStatus && (resStatus=1);
      }
      let _this = this;
      api.planStart({
        data: {
          id: this.data.planId,
          answers: JSON.stringify(answers),
          resultStatus: resultStatus
        },
        isNoToken: false,
        complete: function (res) {
          if (res.data.code == 200) {
            app.globalData.pollIndex = 2
            wx.redirectTo({
              url: 'managelist',
            })
          }
          _this.setData({
            startBtn: true
          });
        },
        fail: function(res){
          _this.setData({
            toasterShow: true,
            toasterTxt: res
          });
          // 跳转回去
          setTimeout(function () {
            _this.setData({
              toasterShow: false
            });
            // 跳转回去
            wx.navigateBack({
            })
          }, 3000);
        }
      });
    },
    cancel: function(){
      this.setData({
        confirm: true
      });
    },
    onReachBottom: function () {

    },
    onShow: function () {
        
    }
})