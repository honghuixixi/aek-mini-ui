//针对wx.request 进行封装
/**
 * auther @aiyou
 */
var app = getApp();
let Count302 = 0;
//get请求
function get(url, params) {
    var config = {
        data: params && params.data || {},
        url: url,
        method: "get",
        authToken: (!params.isNoToken && JSON.parse(wx.getStorageSync('authToken')).token) || '',
        success: params.success,
        fail: params.fail,
        complete: params.complete || null
    }

    _request(config)
}
//post请求
function post(url, params) {
    var config = {
        data: params && params.data || {},
        url: url,
        authToken: (!params.isNoToken && JSON.parse(wx.getStorageSync('authToken')).token) || '',
        contentType: params.contentType || "application/json",
        method: "post",
        success: params.success,
        fail: params.fail,
        complete: params.complete || null
    }
    _request(config);
}
//刷新权限列表
function refreshPermission(callback) {
    post('/oauth/cache/permission/list', {
        success: function (res) {
            wx.setStorageSync('userInfo', res.data)
            callback && callback();
        }
    })

}
//请求失败处理函数
function handlFail(res, config) {

    if (!res.data) {
        // wx.showToast({
        //   'title':"非法域名"
        // })  
        //   return;
    }
    //刷新权限列表  不能刷新当前页面
    // if (Count302 > 5) {
    //     wx.showToast({
    //         'image': '../../static/images/error.png',
    //         'title': "权限拉取失败，请重新登录"
    //     })
    //     wx.redirectTo({
    //         url: '/pages/login/login',
    //         success: function () {
    //             wx.clearStorageSync();
    //         }
    //     })
    // }
    if (res.data.code == 302) {
        // Count302++;                 //记录302的次数 5次以上重新登录
        // refreshPermission(function () {
        //     _request(config)
        // })
        // return;
        wx.redirectTo({
            url: '/pages/login/login?reLogin=true',
            success: function () {
                wx.clearStorageSync();
                // wx.hideToast();
                // wx.showToast({
                //     'icon': 'none',
                //     'title': "权限变更，请重新登录"
                // });
                // wx.showToast({
                //     title: '权限变更，请重新登录',
                //     icon: 'none',
                //     duration: 2000
                // });
            }
        });
        return ;
    } else if (res.data.code == 450) {
        //非法token 重新登录
        wx.redirectTo({
            url: '/pages/login/login',
            success: function () {
                wx.clearStorageSync();
            }
        })
        return;
    } else if (res.data.code == 401) {
        //未登录 重新登录
        wx.redirectTo({
            url: '/pages/login/login',
            success: function () {
                wx.clearStorageSync();
            }
        })
        return;
    } else if (res.data.code == 403) {
        return
    } else if (res.data.code == 410) {
        return
    } else if (res.data.code == 409) {
        return
    } else if (res.data.code == 411) {
        return
    } else if (res.data.code == 'U_009') {
        return
    } else if (res.data.code == 'U_021') {
        return
    } else if (res.data.code == '0001') {
        return
    } else if (res.data.code == 'U_019') {
        return
    } else if (res.data.code == 'U_022') {
        return
    } else if (res.data.code == 'C_010'){
      return
    } else if (res.data.code =='U_020'){
      return
    } else if (res.data.code == 'd_003') {
      return
    } else if (res.data.code == 'Q_017'){
      return
    }
    if (typeof (config.fail) === 'function') {
        config.fail(res.data.msg, res);
    } else {
        wx.showToast({
            'image': '../../static/images/error.png',
            'title': res.data.msg
        })
    }
}
//请求
function _request(config) {

    wx.request({
        url: app.globalData.API_URL + config.url,
        data: config.data,
        header: {
            "content-type": config.contentType,
            "X-AEK56-Token": config.authToken || ''
        },
        method: config.method,
        dataType: config.dataType || '',
        success: function (res) {
            if (res.data.code != 200 && !res.data.id) {

                handlFail(res, config);
            } else {
                config.success && config.success(res);
            }
        },
        fail: function (res) {
            handlFail(res, config);
        },
        complete: function (res) {
            config.complete && config.complete(res);
        },
    })
}
module.exports = {
    get: get,
    post: post
}
