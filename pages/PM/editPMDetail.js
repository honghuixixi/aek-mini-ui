
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var GetList = function (that) {
    api.PMdetail({
        data: {
            id: that.data.detailId
        },
        isNoToken: false,
        success: function (res) {
            if (res.data.code == 200) {
                let dt = new Date(res.data.data.nextDate);
                let userInfo = wx.getStorageSync("userInfo");
                // 默认合格
                // if (res.data.data.needDefault){
                //     res.data.data.items.map(item => {
                //         item.options.map(op => {
                //             op.answer = 1
                //         })
                //     })
                // }
                let checkUser = {id: 0, name: ''};
                dt.setMonth(dt.getMonth() + res.data.data.cycle);
                res.data.data.live = res.data.data.live ? res.data.data.live : 1;
                res.data.data.workTime = res.data.data.workTime ? res.data.data.workTime : '';
                if(res.data.data.checkId && +res.data.data.checkId > 0){
                    checkUser = {id: res.data.data.checkId, name: res.data.data.checkName};
                }
                that.setImgFlag(res.data.data);
                that.setData({
                    loading: false,
                    userInfo: userInfo,
                    limit: userInfo.authoritiesStr ? userInfo.authoritiesStr.indexOf('PM_PLAN_IMPLEMENT') != -1 : false,
                    nextDate: util.formatday(dt),
                    actualStartDate: res.data.data.actualStartDate, // 实际开始日期（时间戳）
                    actualEndDate: res.data.data.actualEndDate, // 实际结束日期（时间戳
                    obj: res.data.data,
                    checkUser: checkUser
                });
                if (!that.data.limit) {
                    return that.showToast('你还没有PM实施权限，请联系管理员', function () {
                        wx.clearStorageSync();
                        wx.redirectTo({
                            url: '../login/login',
                        });
                    });
                }
            }
        }
    });
}
var app = getApp()
Page({
    data: {
        baseImgUrl: app.globalData.PIC_URL.substr(0, app.globalData.PIC_URL.length - 1),
        detailId: 1,
        obj: {},
        confirm: true,
        nextDate: util.formatday(new Date()),
        actualStartDate: 1, // 实际开始日期（时间戳）
        actualEndDate: 1, // 实际结束日期（时间戳
        userInfo: {},
        loading: true,//动画变量
        toasterShow: false,
        toasterTxt: '',
        limit: false,
        keyword: '',//关键字
        iconList: [
            { id: 1, name: '合格' },
            { id: 2, name: '修复' },
            { id: 3, name: '可用' },
            { id: 4, name: '待修' }
        ],
        pindex: 0,
        cindex: 0,
        listShow: '',
        answerMy: '',
        remarkMy: '',
        measureMy: '',
        setnum: '',
        chooseShow: false,
        errorShow: false,
        typeHide: true,
        typeList: [{ statusNum: 1, status: "正常工作" }, { statusNum: 2, status: "小问题，不影响使用" }, { statusNum: 3, status: "有故障，需要维修" }, { statusNum: 4, status: "不能使用" },],
        typeeq: -1,
        phoneHide: true,//选择上传图片类型的modal控制显示隐藏
        phoneList: [{ statusNum: 1, status: "拍照" }, { statusNum: 2, status: "相册" }], //选择上传图片的模态框的列表
        phoneeq: -1,//选择状态的角标 portHide: true,
        scrollY: 0
    },
    showToast: function (a, b) {
        this.setData({
            toasterShow: true,
            toasterTxt: a
        });
        let _this = this;
        setTimeout(function () {
            _this.setData({
                toasterShow: false
            });
            b && b();
        }, 3000);
    },
    // 时间转化1
    transformData: function (data) {
        let _length = data.length;
        for (let i = 0; i < _length; i++) {
            data[i].reportRepairDate = util.formatTime(new Date(data[i].reportRepairDate))
        }
        return data;
    },
    onShow: function () {
        setTimeout(() => {
            this.setData({
                loading: false
            });
        });
    },
    // 备注
    remarksSet: function (e) {
        this.data.obj.remarks = e.detail.value
        this.setData(this.data);
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数 
        let userInfo = wx.getStorageSync("userInfo")
        this.setData({
            userInfo: userInfo,
            detailId: options.applyId,
            loading: true,
            limit: userInfo.authoritiesStr ? userInfo.authoritiesStr.indexOf('PM_PLAN_IMPLEMENT') != -1 : false
        });
        if (this.data.limit) {
            var that = this
            GetList(that)
        } else {
            that.showToast('你还没有PM实施权限，请联系管理员', function () {
                wx.clearStorageSync();
                wx.redirectTo({
                    url: '../login/login',
                });
            });
        }
    },
    submitPM: function (a) {
        if (a.currentTarget.dataset.type == 1) {
            return this.submitCon(1);
        }
        let list = this.data.obj.items;
        for (let i = 0, length = list.length; i < length; i++) {
            for (let j = 0, lengt = list[i].options.length; j < lengt; j++) {
                // console.log(list[i].options[j].answer);
                if (!list[i].options[j].answer) {
                    return this.showToast('实施内容未完成，请检查后提交', function () {});
                }
            }
        }
        if (!this.data.obj.workTime || this.data.obj.workTime == 0.0) {
            return this.showToast('请输入工时', function () {
            });
        }
        return this.setData({
            confirm: false
        });
    },
    submitCon: function (a) {
        let _this = this;
        this.data.obj.workTime = this.data.obj.workTime ? this.data.obj.workTime : 0;
        let param = {
            id: this.data.detailId,
            type: a,
            ...this.data.obj,
            nextDate: this.data.nextDate, // 下次实施日期（时间戳）
            actualStartDate: this.data.actualStartDate, // 实际开始日期（时间戳）
            actualEndDate: new Date().getTime(), // 实际结束日期（时间戳
            template: this.data.obj.items
        };
        if(this.data.checkUser.id > 0){
            param.checkMan = this.data.checkUser;
        }
        api.submitPM({
            data: param,
            isNoToken: false,
            fail: function (msg, res) {
                if (res.data.code == 'P_006') {
                    _this.showToast('该PM实施已完成，请登录网页查询', function () {
                        // wx.redirectTo({
                        //     url: 'assetsList',
                        // })
                        wx.navigateBack({});
                    });
                }else{
                    _this.showToast(msg);
                }
            },
            success: function (res) {
                if (res.data.code == 200) {
                    if (a == 1) {
                        _this.showToast('暂存成功');
                    } else {
                        wx.redirectTo({
                            url: 'assetsList',
                        });
                    }
                } else {
                    _this.showToast(res.data.msg, function () {
                        wx.redirectTo({
                            url: 'assetsList',
                        });
                    });
                }
            }
        });
    },
    workTime: function (e) {
        if (/^\d{1,5}(?:\.\d{0,1})?$/.test(e.detail.value)) {
            this.data.obj.workTime = e.detail.value;
        } else {
            this.data.obj.workTime = '';
            e.detail.value = '';
        }
        this.setData(this.data)
    },
    bindDateChange: function (e) {
        console.log(this.data);
        this.setData({
            nextDate: e.detail.value
        })
    },
    cancelIt: function () {
        this.setData({
            confirm: true
        });
    },
    confirm: function () {
        this.setData({
            confirm: true
        });
        this.submitCon(2);
    },
    onPullDownRefresh: function () {
        //下拉
        wx.stopPullDownRefresh()
    },
    onReachBottom: function () {
        //上拉
        // pullDown
    },
    // 弹窗的方法
    // 点击出现弹窗
    clickShow: function (e) {
        var _this = this

        wx.createSelectorQuery().select('#PM').fields({
            dataset: true,
            size: true,
            scrollOffset: true,
            properties: ['scrollX', 'scrollY']
        }, function (res) {
            // console.log(res)
            // console.log(res.scrollY)
            _this.data.scrollY = res.scrollTop    // 节点 scroll-x 属性的当前值
            // console.log(_this.data.scrollTop)
        }).exec()
        this.setData({
            chooseShow: true,
            errorShow: false,//必填提示
            answerMy: e.currentTarget.dataset.listShow.answer,
            remarkMy: e.currentTarget.dataset.listShow.remarks,
            measureMy: e.currentTarget.dataset.listShow.measure,
            setnum: e.currentTarget.dataset.listShow.setnum,
            listShow: e.currentTarget.dataset.listShow,
            pindex: e.currentTarget.dataset.pIndex,
            cindex: e.currentTarget.dataset.cIndex,
        })
        // console.log(this.data.measureMy)
    },
    // 弹窗消失
    hostModal: function () {
        // 如果是选择图片的弹窗
        if (!this.data.phoneHide) {
            this.setData({
                phoneHide: true,
                phoneeq: -1
            })
        }
        // 如果是选择状态的弹窗
        if (!this.data.typeHide) {
            this.setData({
                typeHide: true
            })
        }
    },
    // 点击选择类型
    chooseIcon: function (e) {
        this.setData({
            answerMy: e.currentTarget.dataset.myIndex + 1,
            errorShow: false
        })
    },
    // 备注的input
    clickRemark: function (e) {
        this.setData({
            remarkMy: e.detail.value
        })
    },
    clickMeasure: function (e) {
        this.setData({
            measureMy: e.detail.value
        })
    },
    clickSetnum: function (e) {
        this.setData({
            setnum: e.detail.value
        })
        // console.log(this.data)
    },
    // 点击取消
    cancel: function (e) {
        if (e.target.dataset.type) {
            this.setData({
                chooseShow: false
            })

        }
    },
    // 点击确定
    sure: function (e) {
        var pindex = e.currentTarget.dataset.parentIndex
        var cindex = e.currentTarget.dataset.chridenIndex
        if (!this.data.answerMy) {
            this.setData({
                errorShow: true
            })
        } else {
            this.data.obj.items[pindex].options[cindex].answer = this.data.answerMy
            this.data.obj.items[pindex].options[cindex].remarks = this.data.remarkMy
            this.data.obj.items[pindex].options[cindex].measure = this.data.measureMy
            this.data.obj.items[pindex].options[cindex].setnum = this.data.setnum
            this.setData({
                obj: this.data.obj,
                chooseShow: false
            })

        }
    },
    // 类型方法弹窗
    // 点击设备现状出现弹窗
    choosestatus: function (e) {
        this.setData({
            typeHide: false,
            typeeq: e.currentTarget.dataset.typeIndex - 1
        })
    },

    // 查看大图
    lookBig: function (e) {
        var uri = e.currentTarget.dataset.filesUrl
        var canlook = uri.indexOf('.jpg') != -1 || uri.indexOf('.jpeg') != -1 || uri.indexOf('.png') != -1
        if (canlook) {
            // 能查看
            wx.navigateTo({
                url: '../bigpicture/bigpicture?uri=' + uri,
            })

        } else {
            this.setData({
                totastHide1: false
            })
            setTimeout(() => {
                this.setData({
                    totastHide1: true
                })
            }, 500)
        }
    },
    // 删除图片
    delImg: function (e) {
        var num = e.currentTarget.dataset.fujianList
        var _index = e.currentTarget.dataset.fujianIndex
        this.data.obj.files.splice(_index, 1)
        this.setData({
            obj: this.data.obj
        })
    },
    //点击添加图片,出现弹窗，相册和相机
    addimg: function (e) {
        this.setData({
            phoneHide: false
        })
    },
    // 弹窗方法
    chooseHost: function (event) {
        if (!this.data.typeHide) {
            this.setData({
                "obj.live": event.currentTarget.dataset.status,
                "typeeq": event.currentTarget.dataset.hospId,
                "typeHide": true,
            })
        }
        // 如果是选择图片的弹窗
        let _this = this;
        if (!this.data.phoneHide) {
            this.setData({
                phoneeq: event.currentTarget.dataset.hospId,
                phoneHide: true,
            })
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: [this.data.phoneeq == 0 ? 'camera' : 'album'],
                success: (res) => {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var tempFilePaths = res.tempFilePaths;
                    // 图片上传 http://dev.aek.com:8081/api/upload
                    wx.uploadFile({
                        url: app.globalData.API_URL + '/upload3', //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'files',
                        formData: {
                            'files': tempFilePaths[0]
                        },
                        success: (res) => {
                            let data = JSON.parse(res.data);
                            if (data.data.length > 0) {
                                if (!this.data.obj.files) {
                                    this.data.obj.files = []
                                }
                                this.data.obj.files.push({ name: data.data[0].fileName, url: data.data[0].uploadUrl, isImg: true })
                                this.setData({
                                    obj: this.data.obj
                                })
                                console.log(this.data.obj.files)

                            }

                        }
                    })

                }
            })
        }
    },
    setImgFlag: function (obj) {
        if (obj.files){
            for(var i=0,len=obj.files.length; i<len; i++){
                obj.files[i].isImg = this.isImg(obj.files[i].url);
            }
        }
    },
    isImg: function (name) {
        var suportsuffix = "png|jpg|jpeg|gif|bmp",
            suffix = name.substr(name.lastIndexOf('.') + 1).toLocaleLowerCase();
        return suportsuffix.indexOf(suffix) >= 0;
    }
})