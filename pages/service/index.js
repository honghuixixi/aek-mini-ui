// pages/service/index.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({
    data: {
        list: [],//首页下边列表
        noticeHas: '',
        newsHas: '',
        articleHas: '',
        complaintHas: '',
        consultationHas: ''
    },
    // 获取消息的状态
    getStatistics: function () {
        api.getStatistics({
            isNoToken: false,
            success: (res) => {
                if (res.data.code == 200) {
                    if (res.data.data) {
                        this.setData({
                            noticeHas: res.data.data.notice ? res.data.data.notice.hasNews : '',
                            newsHas: res.data.data.news ? res.data.data.news.hasNews : '',
                            articleHas: res.data.data.article ? res.data.data.article.hasNews : '',
                            complaintHas: res.data.data.complaint ? res.data.data.complaint.hasNews : '',
                            consultationHas: res.data.data.consultation ? res.data.data.consultation.hasNews : '',
                        })
                    }
                }
            }
        })
    },
    // 消息首页列表
    gethomeList: function () {
        // 消息首页列表
        api.gethomeList({
            isNoToken: false,
            success: (res) => {
                if (res.data.code == 200) {
                    // console.log(res)
                    var data = res.data.data
                    var _length = res.data.data.length
                    for (var i = 0; i < _length; i++) {
                        data[i].publishTime2 = util.formatTime(new Date(data[i].publishTime))
                        data[i].title2 = data[i].title ? data[i].title.length > 30 ? data[i].title.substring(0, 30) + '...' : data[i].title : ''
                        data[i].content2 = util.getSubContent(data[i].content, 43) //data[i].content ? data[i].content.length > 43 ? data[i].content.substring(0, 43) + '...' : data[i].content : ''
                    }
                    this.setData({
                        list: data
                    })
                    // console.log(this.data)
                }
            }
        })
    },
    onShow: function () {
        this.setData({
            tag: false
        })
        this.getStatistics()
        this.gethomeList()
    },
    // 跳转对应的详情页面
    goDetail: function (e) {
        var detailId = e.currentTarget.dataset.infoId
        var type = e.currentTarget.dataset.infoType
        if (type == 1) {
            wx.navigateTo({
                url: './noticedetail?id=' + detailId,
            })
        } else if (type == 2) {
            wx.navigateTo({
                url: './newsdetail?id=' + detailId,
            })
        } else if (type == 3) {
            wx.navigateTo({
                url: './articledetail?id=' + detailId,
            })
        } else if (type == 4) {
            wx.navigateTo({
                url: './complaintdetail?id=' + detailId,
            })
        } else if (type == 5) {
            wx.navigateTo({
                url: './consultdetail?id=' + detailId,
            })
        }
    },
    // 跳转到通知列表
    goNotice: function () {
        wx.navigateTo({
            url: './noticelist',
        })
    },
    // 跳转到消息列表
    goNews: function () {
        wx.navigateTo({
            url: './newslist',
        })
    },
    // 跳转到文章列表
    goArticle: function () {
        wx.navigateTo({
            url: './articlelist',
        })
    },
    // 跳转到投诉列表
    gocomplaint: function () {
        wx.navigateTo({
            url: './complaintlist',
        })
    },
    // 跳转到咨询
    goconsult: function () {
        wx.navigateTo({
            url: './consultlist',
        })
    },
    //点击悬浮按钮显示菜单
    show: function () {
        this.setData({
            tag: true
        })
    },
    //点击悬浮按钮消失菜单
    hidden: function () {
        this.setData({
            tag: false
        })
    },
    // 悬浮按钮投诉
    complat: function () {
        wx.navigateTo({
            url: './complaintnew',
        })
    },
    //悬浮按钮咨询
    consult: function () {
        wx.navigateTo({
            url: './consultnew',
        })
    },
    // 刷新页面
    onPullDownRefresh: function () {
        this.setData({
            tag: false
        })
        this.getStatistics()
        this.gethomeList()
        wx.stopPullDownRefresh()
    },

})