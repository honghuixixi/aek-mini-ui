// pages/beforeassestbook/choosedepart.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        deptList: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /**
     * 获取部门列表树
     * @params
     */
    getDeptListTree: function () {
        let _this = this;
        api.getdeptTree({
            isNoToken: false,
            data: {
                "tenantId": wx.getStorageSync("userInfo").tenantId
            },
            success: function (res) {
                _this.setData({
                    deptList: _this.converToList(res.data.data)
                })
                //console.log(JSON.stringify(_this.data.deptList));
            }
        })
    },
    converToList: function (obj) {
        var arr = [];
        function getChild(obj, level) {
            arr.push({id: obj.id, name: obj.name, preset: obj.preset, level: level});
            if(obj.subDepts.length){
                for(var index in obj.subDepts){
                    getChild(obj.subDepts[index], level + 1);
                }
            }
        }
        getChild(obj, 1);
        return arr;
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getDeptListTree()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    chooseDeptId: function (e) {
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];   //当前页面
        let prevPage = pages[pages.length - 2];  //上一个页面
        //设置搜索记录
        // prevPage.setData({
        //   "deptName": e.currentTarget.dataset.name,
        //   "deptId": e.currentTarget.dataset.id
        // });
        // prevPage.setBtnStatus();
        prevPage.fillChoosePart(e.currentTarget.dataset.id, e.currentTarget.dataset.name)
        wx.navigateBack({
            url: 'newassest'
        });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})