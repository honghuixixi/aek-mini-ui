var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabIndex: 1,
        searchName: '',
        list: [],
        pageNo: 1,
        pageSize: 12,
        showLoading: false,
        showEmpty: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        this.refresh();
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        this.refresh(() => {
            wx.stopPullDownRefresh();
        });
    },

    /**
     * 到达页面底部
     */
    onReachBottom: function () {
        if (!this.data.showEmpty) {
            this.setData({
                pageNo: this.data.pageNo + 1
            });
            this.getList();
        }
    },

    // Tab切换
    changeIndex: function (e) {
        this.setData({
            tabIndex: e.currentTarget.dataset.chooseIndex,
            searchName: ''
        });
        this.refresh();
    },

    // 跳转至搜索页面
    search: function () {
        wx.navigateTo({
            url: '../search/search?k=pollingAcceptSearch' + this.data.tabIndex + '&p=请输入巡检名称/报告编号',
        });
    },

    // 跳转至详情页
    detail: function (e) {
        wx.navigateTo({
            url: 'acceptdetail?id=' + e.currentTarget.dataset.id + '&status=' + e.currentTarget.dataset.status,
        });
    },

    refresh: function (fun) {
        this.setData({
            pageNo: 1,
            list: []
        });
        this.getList(fun);
    },

    // 获取列表数据
    getList: function (fun) {
        var param = {
            pageNo: this.data.pageNo,
            pageSize: this.data.pageSize,
            userId: wx.getStorageSync("userInfo").id,
            status: this.data.tabIndex
        };
        if (this.data.searchName.length > 0){
            param.keyword = this.data.searchName;
        }
        this.setData({
            showLoading: true,
            showEmpty: false
        });

        api.pollingAcceptList({
            isNoToken: false,
            data: param,
            success: (res) => {
                if (res.data.code == 200) {
                    var list = res.data.data.records || [];
                    list.map(item => {
                        item.cycleTypeStr = item.planCycle + (item.cycleType == 1 ? '个月' : '天');
                        item.actualEndDateStr = util.formatday(new Date(item.actualEndDate))
                    });
                    this.setData({
                        list: this.data.list.concat(list),
                        showLoading: false,
                        showEmpty: list.length < 1
                    })
                }
            },
            compete: (res) => {
                if (typeof fun === 'function') {
                    fun();
                }
            }
        });
    }
})