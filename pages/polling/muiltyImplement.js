// pages/polling/editdetail.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')

Page({

    data: {
        disabled: true,
        detail: {},
        id: '',
        totastHide: true,
        totastContent: '提交成功，请继续巡检',
        tag: 1,//tag==1,不完整  tag==2完整
    },


    onLoad: function (options) {
        this.setData({
            id: options.id,
            tag: options.tag
        })
        api.getMuiltyTemplate(options.id, {
            isNoToken: false,
            success: (res) => {
                if (res.data.code == 200) {
                    this.data.detail.model = res.data.data
                    this.data.detail.answers = {}
                    this.data.detail.model.map(item => {
                        let id = item.id
                        item.projects.map(itm => {
                            if (itm.isDefault) {
                                this.data.detail.answers[id] = { 'name': itm.name, 'id': itm.id }
                            }
                        })
                    })
                    this.setData({
                        detail: this.data.detail
                    })
                    this.watch()
                }
            }
        })

    },
    // 点击单选框
    choose: function (e) {
        if (this.data.tag != 2) {
            let innerId = e.currentTarget.dataset.innerId
            let templateId = e.currentTarget.dataset.templateId
            let answersName = e.currentTarget.dataset.answersName
            this.data.detail.answers[templateId] = { 'name': answersName, 'id': innerId }
            this.setData({
                detail: this.data.detail
            })
            this.watch()
        }
    },
    // 检测是否是已经全选
    watch: function () {
        if (Object.keys(this.data.detail.answers).length === this.data.detail.model.length) {
            this.setData({
                disabled: false
            })
        }
    },
    //  备注
    textinput: function (e) {
        // console.log(e.detail.value)
        this.setData({
            'detail.remarks': e.detail.value
        })

    },
    //  点击提交
    btnClick: function () {
        this.setData({
            disabled: true
        })
        this.data.detail.answers = JSON.stringify(this.data.detail.answers)
        api.muiltyImplement({
            isNoToken: false,
            data: {
                "answers": this.data.detail.answers,
                "id": this.data.id,
                "status": 2,
                "remarks": this.data.detail.remarks
            },
            success: (res) => {
                
            },
            complete: (res) => {
                this.setData({
                    disabled: false
                })
                let msg = res.data.msg
                if (res.data.code == 200) {
                    msg = '提交成功，请继续巡检'
                }
                // 弹窗提示
                this.setData({
                    totastContent: msg,
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
            },
            fail: (msg, code) => {
                this.setData({
                    totastContent: msg,
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
        })
    }
})