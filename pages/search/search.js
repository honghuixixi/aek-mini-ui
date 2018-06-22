var app = getApp()
Page({
    data: {
        list: [],
        keyword: '',
        placeholder: '',
        sessionKey: ''
    },
    onLoad: function (options) {
        this.setData({
            keyword: wx.getStorageSync('search_keyword_' + options.k) || '',
            placeholder: options.p,
            sessionKey: options.k,
            list: wx.getStorageSync(options.k) || []
        })
    },
    // 获取关键字
    setKeyword: function (e) {
        this.setData({
            keyword: e.detail.value
        })
    },
    // 搜索
    search: function () {
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]

        if(this.data.keyword.length > 0) {
            let index = this.getIndex()
            if(index >= 0) {
                this.data.list.splice(index, 1);
            }else{
                if (this.data.list.length > 9) {
                    this.data.list.pop()
                }
            }
            
            this.data.list.unshift(this.data.keyword)
            wx.setStorageSync(this.data.sessionKey, this.data.list)
        }

        wx.setStorageSync("search_keyword_" + this.data.sessionKey, this.data.keyword)
        prevPage.setData({
            "searchName": this.data.keyword
        })
        wx.navigateBack({
            delta: 1
        })
    },
    // 快捷搜索
    quickSearch: function (e) {
        this.setData({
            keyword: e.currentTarget.dataset.name
        })
        this.search()
    },
    // 删除历史记录
    delHository: function () {
        wx.removeStorageSync(this.data.sessionKey)
        this.setData({
            list: []
        })
    },
    // 搜索记录是否重复
    getIndex: function () {
        let index = -1
        for(let key in this.data.list){
            if (this.data.list[key] === this.data.keyword){
                index = key
                break
            }
        }
        return index
    }
})