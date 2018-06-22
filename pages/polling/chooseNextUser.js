var api = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        api.getQcUserList({
            isNoToken: false,
            data: {},
            success: (res) => {
                if (res.data.code == 200) {
                    this.setData({
                        list: res.data.data
                    });
                }
            }
        });
    },
    chooseUser: function (e) {
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        prevPage.setData({
            nextChargeMan: {
                id: e.currentTarget.dataset.user.id,
                name: e.currentTarget.dataset.user.realName
            }
        });
        wx.navigateBack({});
    }
})