// pages/polling/editdetail.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')

Page({

  data: {
    disabled:true,
    detail:{},
    assetId:'',
    id:'',
    totastHide:true,
    totastContent:'提交成功，请继续巡检',
    totastHide2: true,
    totastContent2: '',
    tag:1,//tag==1,不完整  tag==2完整
  },

 
  onLoad: function (options) {
    this.setData({
      assetId: options.assetId,
      id: options.id,
      tag:options.tag
    })
     // 需要实施id跟设备id
    api.pollDetail({
      isNoToken: false,
      data: {
        assetId: options.assetId,
        id: options.id
      },
      success: (res)=> {
        if (res.data.code == 200) {
          this.setData({
            detail: res.data.data
          })
          if (!(this.data.detail.answers && this.data.detail.answers.length > 0)) {
            this.data.detail.answers = {}
            this.data.detail.model.map(item => {
              let id = item.id
              item.projects.map(itm => {
                if (itm.isDefault) {
                  this.data.detail.answers[id] = { 'name': itm.name, 'id': itm.id }
                }
              })
            })
          } else {
            this.data.detail.answers = JSON.parse(this.data.detail.answers)
          }
          this.setData({
            detail: this.data.detail
          })
          this.watch()

        }
      }
    })

  },
  // 点击单选框
  choose:function(e){
 
      let innerId = e.currentTarget.dataset.innerId
      let templateId = e.currentTarget.dataset.templateId
      let answersName = e.currentTarget.dataset.answersName
      this.data.detail.answers[templateId] = { 'name': answersName, 'id': innerId }
      this.setData({
        detail: this.data.detail
      })
      this.watch()
    
  },
  // 检测是否是已经全选
 watch:function(){
   if (Object.keys(this.data.detail.answers).length === this.data.detail.model.length){
     this.setData({
       disabled: false
     })
   }
 },
//  备注
 textinput:function(e){
   console.log(e.detail.value)
   this.setData({
     'detail.remarks': e.detail.value
   })

 },
//  点击提交
  btnClick:function(){
    this.setData({
      disabled: true
    })
    this.data.detail.answers = JSON.stringify(this.data.detail.answers)
    api.subpollDetail({
      isNoToken: false,
      data:{
        "answers": this.data.detail.answers,
        "assetId": this.data.assetId,
        "id": this.data.id,
        "status": 2,
        "remarks": this.data.detail.remarks
      } ,
      complete: (res)=> {
        this.setData({
          disabled: false
        })
        if (res.data.code == 200) {
          // 弹窗提示
          this.setData({
            totastHide: false
          })
          setTimeout(() => {
            this.setData({
              totastHide: true
            })
            // 跳转回去
            wx.navigateBack({
            })
          }, 1500)
         
        }
       
        if (res.data.code =='Q_017'){
          console.log('pppppppppppppppppppppppppppp')
          this.setData({
            totastHide2: false,
            totastContent2:res.data.msg
          })
          setTimeout(() => {
            this.setData({
              totastHide2: true
            })
           
          }, 1500)
        }
      }
    })
  }
})