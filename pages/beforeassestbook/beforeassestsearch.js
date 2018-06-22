// pages/assestbook/assestsearch.js
Page({
  data: {
    hasHository:false,//控制是否有历史记录
    assentName:'',
    beforeAssestSearch: wx.getStorageSync('beforeAssestSearch') || []     //搜索列表
  },
  getAssentName:function(e){
    this.setData({
      assentName: e.detail.value
    });
    
  },
  // 删除历史记录
  delHository:function(){
    wx.removeStorageSync('beforeAssestSearch');
    this.setData({
      beforeAssestSearch:[]
    });
  },
  setHistoryList:function(){
    
    //搜索内容不为空时 把历史记录前10条存起来
    let historyList = wx.getStorageSync('beforeAssestSearch') || [];
    if (historyList.length <10 && this.data.assentName != '') {
      historyList.unshift(this.data.assentName);
    } else {
      if (this.data.assentName != ''){
        historyList.pop();
        historyList.unshift(this.data.assentName);
      }       
    }
    this.setData({
      beforeAssestSearch: historyList
    });
    wx.setStorageSync("beforeAssestSearch", historyList);  
  },
  // 跳转到设备列表页面
  goAssentsList:function(e){
    let tabName = e.target.dataset.name;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];   //当前页面
    let prevPage = pages[pages.length - 2];  //上一个页面
  //设置搜索记录
    prevPage.setData({
      "searchName": tabName || this.data.assentName 
    })
    wx.navigateBack({
      url: 'beforeassestsearch'
    })
    !~~tabName && this.setHistoryList();
  },
  onShow:function(){
    this.setHistoryList()
  }
 
})