var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
  data: {
    loading:true,//动画变量
    completeList:'',//验收的额数据
    start: [1, 2, 3, 4, 5],
    score1: 5,//星星得分
    score3: 5,//星星得分
    score2: 5,//星星得分
    text1: ['很差 1.0', '差 2.0', '一般 3.0', '好 4.0', '非常好 5.0'],
    text2: ['很慢 1.0', '慢 2.0', '一般 3.0', '快 4.0', '非常快 5.0'],
    text3: ['很差 1.0', '差 2.0', '一般 3.0', '满意 4.0', '非常满意 5.0'],
  },
  onLoad: function (options) {
    let _this=this
    api.acceptGet({
      data: {
        id: options.applyid
      },
      isNoToken: false,
      success: function (res) {
        if (res.data.code == 200) {
          setTimeout(() => {
            _this.setData({
              loading: false,
              completeList: res.data.data
            })
          }, 500)
          console.log(_this.data.completeList)
         
        }

      }
    })
 
  }
})