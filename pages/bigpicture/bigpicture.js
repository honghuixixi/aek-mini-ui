
var app = getApp()
Page({
    data: {
        PIC_URL: app.globalData.PIC_URL,
        uri: ''
    },

    onLoad: function (options) {
        this.setData({
            uri: options.uri
        })
    }
})