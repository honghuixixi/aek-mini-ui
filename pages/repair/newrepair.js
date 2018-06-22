// pages/assestbook/newassest.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp()
Page({
  data: {
    disabled1:true,
    disabled:false,//按钮是否能用
    content:'提交',//按钮的内容
    hasData:false,//有id可以扫到设备
    noData: false,//没有扫到东西的时候
    loading:true,//动画加载的变量
    text:'无法获取设备信息，请检查二维码',
    imageList: [],//图片的数组
    phoneHide: true,//选择上传图片类型的modal控制显示隐藏
    phoneList: [{ status: '拍照' }, { status: '相册' }],//选择上传图片的模态框的列表
    phoneeq: -1,//选择状态的角标
    phenomenonList: [{ name: '故障停机' }, { name: '部分功能失效' }, { name: '附件损坏' }, { name: '其他' }, { name:'不规则或偶发故障'},
      { name: '性能偏离指标' }, { name:'开机后死机'}],//故障现象的列表
    clickShow:false,//故障现象的上部的显示的变量
    topList:[],//上部的故障描述
    assetsDetailInfo:'',//资产的详情
    decribe:'',//故障描述.API_URL
    PIC_URL:app.globalData.PIC_URL,
    active: false,//超过部分隐藏
    uri:'',
    totastHide: true,//totast提示
    totastContent: '新建成功，请到维修列表页查看！',//totast文字
    totastHide2: true,//totast提示
    totastContent2: '该机构没有任何人有接单权限',//totast文字
    repairHide:true,
    repaireq:0,
    reportStatus:1,
    reportList: [{ status: '送修', statusNum: 1 }, { status: '现场维修', statusNum: 2 }],
    peopleid: 0,
    peopleeq: -1,
    people: '请选择',//选择接单人
    peopleHide: true,
    peopleList: [],
    newpeople:'',
    sendPerson:'',//送修人
    sendPhone:'',//送修人联系电话
    tagNull:false
  },
  // input保存信息
  saveInput:function(e){
    this.data[e.currentTarget.dataset.key] = e.detail.value
    this.setData({
      data:this.data
    })
  },
  // 选择接单人
  choosePeople: function () {
    console.log(this.data.tagNull)
    if (this.data.tagNull){
      this.setData({
        peopleHide: false
      })
    }else{
      this.setData({
        totastHide2:false
      })
      setTimeout(()=>{
        this.setData({
          totastHide2: true
        })
      },1500)
    }
    
  },
  // 选择类型
  chooseType:function(){
    this.setData({
      repairHide:false
    })
  },
  //删除图片
  deltimg: function (e) {
    if (this.data.imageList.length == 1) {
      this.setData({
        imageList: []
      })
    } else {
      var list = this.data.imageList.splice(e.currentTarget.dataset.imgIndex, 1)
      this.setData({
       
        imageList: this.data.imageList
      })
    }
  },
  //点击添加图片,出现弹窗，相册和相机
  addimg: function () {
    this.setData({
      phoneHide: false,
      phoneeq: -1,
      active:true
    })
   
  },
  // 提交验证
  submitAdjust: function () {
    if (this.data.people != '请选择' && (this.data.decribe || this.data.topList.length)) {
      this.setData({
        disabled1: false
      })
    } else {
      this.setData({
        disabled1: true
      })
    }
  },
  // 弹窗方法
  chooseHost: function (event) {
    if (!this.data.peopleHide) {
      this.setData({
        "peopleeq": event.currentTarget.dataset.status,
        "people": event.currentTarget.dataset.statusname,
        "peopleid": event.currentTarget.dataset.status,
        "peopleHide": true,
        newphone: event.currentTarget.dataset.phone
      });
      this.submitAdjust();
    }
    if (!this.data.repairHide){
      this.setData({
        repaireq: event.currentTarget.dataset.hospId,
        reportStatus: event.currentTarget.dataset.status,
        repairHide: true,
        active: false,
      })
    }
    if (!this.data.phoneHide) {
    // 如果是选择图片的弹窗
    let _this = this;
   
      this.setData({
        phoneeq: event.currentTarget.dataset.hospId,
        phoneHide: true,
        active:false,
      
        
      })
      //选择的是拍照
      if (this.data.phoneeq == 0) {
        console.log("拍照");
        wx.chooseImage({
          count: 1, // 默认9
          sourceType: ['camera'],
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths
            console.log(tempFilePaths)
            // 图片上传 http://dev.aek.com:8081/api/upload
            wx.uploadFile({
              url: app.globalData.API_URL + "/upload", //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              name: 'files',
              success: function (res) {
               
                
                _this.setData({
                  imageList: _this.data.imageList.concat(JSON.parse(res.data).data)
                })
              }
            })

          }
        })
      } else {
        // 选择的是从相册里选择
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths
            wx.uploadFile({
              url: app.globalData.API_URL+"/upload", //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              name: 'files',
              formData: {
                'files': tempFilePaths[0]
              },
              success: function (res) {
                _this.setData({
                  imageList: _this.data.imageList.concat(JSON.parse(res.data).data)
                })
              }
            })
          }
        })
      }
    }
    
  },
  // 弹窗消失
  hostModal: function () {
    // 如果是选择图片的弹窗
    if (!this.data.phoneHide) {
      this.setData({
        clickShow: true,
        active:false,
        phoneHide:true,
        activetxt: '请输入故障现象'
        
      })
    }
    if (!this.data.peopleHide) {
      this.setData({
        peopleHide: true
      })
    }
    if (!this.data.repairHide) {
  this.setData({
    clickShow: true,
    active: false,
    repairHide: true,
   

  })
  }
    
  },
  // 添加故障现象
  addphen:function(e){
    this.setData({
      topList: this.data.topList.concat(this.data.phenomenonList.splice(e.currentTarget.dataset.iconIndex, 1)),
      phenomenonList: this.data.phenomenonList
    });
    this.submitAdjust();
  },
  // 删除故障现象
  delicon:function(e){
    this.setData({
      phenomenonList: this.data.phenomenonList.concat(this.data.topList.splice(e.currentTarget.dataset.delIconeq, 1)),
      topList: this.data.topList
    });
    this.submitAdjust();
  },
  // 存入故障描述
  decribe:function(e){
    this.setData({
      decribe: e.detail.value,
    });
    this.submitAdjust();
  },
 
// 点击提交,跳转到资产台账列表页面
  btnClick:function(){
    if (this.data.noData){
      // 如果是返回工作台
    wx.switchTab({
        url: '/pages/workplat/workplat',
      })
    }else{
      var list = this.data.topList.concat({ name: this.data.decribe })
      var faultDesc=''
      for(let i=0;i<list.length;i++){
        faultDesc = faultDesc+list[i].name+'；'
      }
      let _this=this
      wx.showModal({
        // title: '提示',
        confirmColor: '#508cee',
        cancelColor: '#999',
        content: '提交后不可再修改，确定提交报修吗？',
        success: function (res) {
          if (res.confirm) {
            //  发送接单请求
            api.submitRepair({
              data: {
                "tenantId": wx.getStorageSync("userInfo").tenantId,
                "assetsBrand": _this.data.assetsDetailInfo.assetsBrand,
                "assetsDeptId": _this.data.assetsDetailInfo.deptId,
                "assetsDeptName": _this.data.assetsDetailInfo.deptName,
                "assetsId": _this.data.assetsDetailInfo.assetsId,
                "assetsImg": _this.data.imageList.join(),
                "assetsName": _this.data.assetsDetailInfo.assetsName,
                "assetsNum": _this.data.assetsDetailInfo.assetsNum,
                "assetsSpec": _this.data.assetsDetailInfo.assetsSpec,
                "assetsStatus": _this.data.assetsDetailInfo.status,
                "deptId": _this.data.assetsDetailInfo.deptId,
                "factoryName": _this.data.assetsDetailInfo.factoryName,
                "factoryNum": _this.data.assetsDetailInfo.factoryNum,
                "faultDesc": faultDesc.substr(0, faultDesc.length - 1),
                "startUseDate": _this.data.assetsDetailInfo.startUseDate,
                "warrantyDate": _this.data.assetsDetailInfo.warrantyDate,
                "reportStatus": _this.data.reportStatus,
                "assetsDesc":1,
                "serialNum": _this.data.assetsDetailInfo.serialNum,
                "sendPhone": _this.data.sendPhone,
                "sendPerson": _this.data.sendPerson,
                "takeOrderId": _this.data.peopleid,
                "takeOrderName":_this.data.people
              },
              isNoToken: false,
              success: function (res) {
                if (res.data.code == 200) {
                  // wx.redirectTo({
                  //   url: 'repairlist',
                  // })
                  _this.setData({
                    totastHide:false,
                    active:true
                  })
                //   var setinter=setInterval(()=>{
                    setTimeout(() =>{
                    _this.setData({
                      totastHide: true,
                      active: false
                    })
                    wx.switchTab({
                     
                      url: '../workplat/workplat',
                    })
                    // clearTimeout(setinter)
                  },1500)
                 
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
  onLoad:function(options){
    this.setData({
      "deptName": wx.getStorageSync("userInfo").deptName,
      "deptId": wx.getStorageSync("userInfo").deptId
    });
   
      // 资产台账的详情
    console.log(options)
      let _this=this
      api.zatzdetail({
        data: {
          id: options.id
        },
        isNoToken: false,
        success: function (res) {
          console.log(res)
          if (res.data.code == 200 && res.data.data && res.data.data.statusName != '待报损' && res.data.data.statusName != '报损' && res.data.data.statusName != '退货' ) {
           
            _this.setData({
              hasData:true,
              noData: false,
              loading: false,
              disabled: false,
              assetsDetailInfo: res.data.data,
              uri: res.data.data.assetsImg?_this.data.PIC_URL+res.data.data.assetsImg.split(',')[0]:''
              })
            _this.data.assetsDetailInfo.assetsImg = _this.data.assetsDetailInfo.assetsImg? _this.data.PIC_URL + _this.data.assetsDetailInfo.assetsImg:'/static/images/position.png'
            _this.setData({
              assetsDetailInfo: _this.data.assetsDetailInfo,

            })
            api.getmorenName({
              data: {
                deptId: _this.data.assetsDetailInfo.deptId
              },
              isNoToken: false,
              success: (res) => {
                console.log(res.data.data);
                if (res.data.data) {
                  _this.setData({
                    disabled1: false,
                    people: res.data.data.realName,
                    peopleeq: res.data.data.id,
                    peopleid: res.data.data.id,
                    newphone: res.data.data.mobile
                  })
                } else {
                  _this.setData({
                    people: '请选择',
                    peopleeq: '',
                    peopleid: ''
                  })
                }
               

              }
            })
            wx.setNavigationBarTitle({
              title: '提交报修'
            })
          }
          if(!res.data.data){
            setTimeout(() => {
              _this.setData({
                hasData: false,
                noData: true,
                loading: false,
                disabled: false,
                content: '返回工作台',
                text: '暂无数据，请检查二维码...'
              })
            }, 500)
            wx.setNavigationBarTitle({
              title: '提示'
            })
          } 
          if (res.data.data && (res.data.data.statusName == '待报损' || res.data.data.statusName == '报损' || res.data.data.statusName == '退货' )){
            setTimeout(() => {
              _this.setData({
                hasData: false,
                noData: true,
                loading: false,
                disabled: false,
                content: '返回工作台',
                text: '此设备已处于报损/退货状态,无法进行维修...'
              })
            }, 500)
            wx.setNavigationBarTitle({
              title: '提示'
            })
          } 
          if (res.data.data && res.data.data.repairStatusName == '维修中' ) {
            setTimeout(() => {
              _this.setData({
                hasData: false,
                noData: true,
                loading: false,
                disabled: false,
                content: '返回工作台',
                text: '此设备已在维修中...'
              })
            }, 500)
            wx.setNavigationBarTitle({
              title: '提示'
            })
          }
          // if (res.data.data && res.data.data.repairStatusName == '维修中' && res.data.dataassetsStatus == 2) {
          //   setTimeout(() => {
          //     _this.setData({
          //       hasData: false,
          //       noData: true,
          //       loading: false,
          //       disabled: false,
          //       content: '返回工作台',
          //       text: '此设备已在维修中...'
          //     })
          //   }, 500)
          //   wx.setNavigationBarTitle({
          //     title: '提示'
          //   })
          // }
        }
      
      
      })
      // 选择接单人 getAcceptName
      api.getAcceptName({
        isNoToken: false,
        success: (res)=> {
          var list = res.data.data
          var _length = list.length
          if(list.length){
            _this.data.tagNull = true
          }else{
            _this.data.tagNull = false
          }
          console.log(_this.data.tagNull)
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
      
  }

 
})