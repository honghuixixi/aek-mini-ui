/**
 * auther @aiyou
 */
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatTime2(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatday(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}
function formatsec(date) {
    var hour = date.getHours()
    var minute = date.getMinutes()

    return [hour, minute].map(formatNumber).join(':')
}
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
//生成唯一标识
function setUid() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
//获取唯一标识

function getUid() {
    return (setUid() + setUid() + "-" + setUid() + "-" + setUid() + "-" + setUid() + "-" + setUid() + setUid() + setUid());
}
// 倒计时时间
function getCountDown(_this) {
    var countFuntion = () => {
        setTimeout(() => {
            _this.setData({
                count: _this.data.count - 1,
            })
            if (_this.data.count <= 0) {
                clearInterval(countDown)
                _this.setData({
                    showNum: false
                })
            } else {
                _this.setData({
                    showNum: true
                })
            }
        }, 1000)

    }
}
// 截取设备名称的字数，实现两行加省略号
function nameSlice(_this, i) {
    // console.log(_this.data.cardList[i].deviceName.length)
    if (_this.data.cardList[i].deviceName.length >= 30) {
        _this.setData({
            'cardList[i].deviceName': _this.data.cardList[i].deviceName.substring(0, 30) + '...',
        })
    } else {
        _this.setData({
            'cardList[i].deviceName': _this.data.cardList[i].deviceName,
        })
    }
}

function navigate(app, url) {
    if (app.globalData.isNavigate) {
        app.globalData.isNavigate = false
        wx.navigateTo({
            url: url,
            success: function () {
                setTimeout(() => {
                    app.globalData.isNavigate = true
                }, 100)
            }
        })
    }
}

function redirect(app, url) {
    if (app.globalData.isNavigate) {
        app.globalData.isNavigate = false
        wx.redirectTo({
            url: url,
            success: function () {
                setTimeout(() => {
                    app.globalData.isNavigate = true
                }, 100)
            }
        })
    }
}

function convertImage(str) {
    var arr = str.split(/<img[^>]*?(src="[^"]*?")[^>]*?>/),
        result = []
    arr.map((item, index) => {
        if (item.substr(0, 4) === 'src=') {
            result[index] = { txt: item.substring(5, item.length - 1), isImg: true };
        } else {
            result[index] = { txt: item, isImg: false };
        }
    })
    return result
}

function getSubContent(str, len) {
    var arr = [];
    var result = [];
    if (str) {
        arr = convertImage(str)
        arr.map(item => {
            if (!item.isImg) {
                result.push(item.txt)
            }
        })
    }
    result = result.join("").replace(/&nbsp;/g, '')
    if (result.length > len) {
        result = result.substring(0, 43) + '...'
    }
    return result
}

module.exports = {
    formatTime: formatTime,
    formatTime2: formatTime2,
    getUid: getUid,
    getCountDown: getCountDown,
    nameSlice: nameSlice,
    formatday: formatday,
    formatsec: formatsec,
    navigate: navigate,
    redirect: redirect,
    convertImage: convertImage,
    getSubContent: getSubContent
}