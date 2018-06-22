// pages/assestbook/assestedit.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
var app = getApp();
Page({

    data: {
        disabled: false,//按钮是否能用
        content: '提交',//按钮的内容
        moreList: true,//点击更多显示隐藏
        index: 0,//点击上部导航实现还会切换
        imageList: [],//图片的数组
        imageList2: [],
        phoneHide: true,//选择上传图片类型的modal控制显示隐藏
        phoneList: [{ statusNum: 1, status: "拍照" }, { statusNum: 2, status: "相册" }], //选择上传图片的模态框的列表
        phoneeq: -1,//选择状态的角标
        diveceName: '设备名称设备名称设备名称设备名称设备名称设备名称',//设备名称
        diveceNum: 'hdsjkfskldfj',//设备编号
        statusHide: true,//选择状态的modal控制显示隐藏
        statusList: [{ statusNum: 1, status: "在库" }, { statusNum: 2, status: "在用" }, { statusNum: 4, status: "维修中" }],//选择状态的模态框的列表
        statuseq: -1,//选择状态的角标
        portHide: true,
        portList: [{ codeValue: 1, codeText: "国产" }, { codeValue: 2, codeText: "进口" }],
        porteq: -1,
        status: '在库',//选择状态绑定的值
        producer: '生产商的名字',//生产商的名字
        size: 'djifsklfj',//规格型号
        registNum: 'sdjfhlkdsj',//注册证号
        leaveNum: '37240987049',//出厂编号
        classifyNum: '000000',//三级分类代码
        brand: '品牌',//品牌
        registName: '注册证名称',//注册证名称
        product: '产地',//产地
        unitHide: true,//选择单位的modal控制显示隐藏
        unitList: [],//选择单位的模态框的列表
        uniteq: -1,//选择单位的角标
        unit: '在库',//选择单位绑定的值
        accountHide: true,//选择账簿类型的modal控制显示隐藏
        accountList: [],//选择账簿类型的模态框的列表
        accounteq: -1,//选择账簿类型的角标
        account: '在库',//选择账簿类型绑定的值
        computedHide: true,//核算类别的modal控制显示隐藏
        computedList: ['核算类别', '核算', '类别'],//核算类别的模态框的列表
        computedeq: -1,//核算类别的角标
        computed: 'hah',//核算类别绑定的值
        manageHide: true,//管理的modal控制显示隐藏
        manageList: ['核算类别', '核算', '类别'],//管理的模态框的列表
        manageeq: -1,//管理的角标
        manage: '语塞日无人',//管理绑定的值
        measureHide: true,//计量的modal控制显示隐藏
        measureList: ['核算类别', '核算', '类别'],//计量的模态框的列表
        measureeq: -1,//计量的角标
        measure: '语塞日无人',//计量绑定的值
        useHide: true,//用途的modal控制显示隐藏
        useList: ['核算类别', '核算', '类别'],//用途的模态框的列表
        useeq: -1,//用途的角标
        use: '语塞日无人',//用途绑定的值
        deptsourceHide: true,//设备来源的modal控制显示隐藏
        deptsourceList: ['核算类别', '核算', '类别'],//设备来源的模态框的列表
        deptsourceeq: -1,//设备来源的角标
        deptsource: '语塞日无人',//设备来源绑定的值
        capitalsourceHide: true,//资金来源的modal控制显示隐藏
        capitalsourceList: ['核算类别', '核算', '类别'],//资金来源的模态框的列表
        capitalsourceeq: -1,//资金来源的角标
        capitalsource: '语塞日无人',//资金来源绑定的值
        provider: '浙江爱医康',//供应商的value值
        unit: '￥77.00',//设备单价
        deliverydate: '2017-09-20',//到货日期
        signingdate: '2017-02-30',//签订日期
        contractNum: '4835-743-9980393-',//合同编号
        contractName: '哈哈哈哈哈',//合同名称
        oppositeunit: '乙方单位',//乙方单位
        contractmoney: '合同金额',//合同金额
        recordNum: '454543534543',//档案编号
        invoiceNum: 'sdhfjskdfhjskdlfj',//发票号
        assestId: 0, //当前页面的设备Id
        assestInfo: {},  //设备信息
        idKey: '',
        idName: '',
        region: [],
        assetsSpec:''
    },
    onLoad: function (options) {
        this.setData({
            assestId: options.assestId
        });
        this.getAssestDetail();
        this.getAssestStatus();
        this.getCodeInfo();
    },
    // 字段赋值
    fillField: function (e) {
        //console.log("fill feild");
        let data = {
            assestInfo: this.data.assestInfo
        };
        //console.log(this.data);
        data['assestInfo'][e.currentTarget.dataset.key] = e.detail.value;


        //console.log(data);
        this.setData(data);
        //console.log(this.data);
        // 按钮状态校验
        if (e.currentTarget.dataset.check) {
            this.setBtnStatus();
        }
    },
    setBtnStatus: function () {
        this.setData({
            disabled: !(this.data.assestInfo.assetsName.length && this.data.assestInfo.factoryName.length)
        });
    },
    fillChoosePart: function (id, name) {
        let obj = this.data.assestInfo;
        obj[this.data.idKey] = id;
        obj[this.data.idName] = name;
        this.setData(obj);
    },
    // 切换基本信息和采购信息
    changeMsg: function (e) {
        this.setData({
            index: e.currentTarget.dataset.setIndex,
            tag: false//让悬浮按钮变回原来的样子  
        })
        if (e.currentTarget.dataset.setIndex == 1) {
            // 如果是采购信息的话，那么提交按钮会始终高亮
            this.setData({
                disabled: false
            })

        }
    },
    /**
     * 获取字典
     * @params
     */
    getCodeInfo: function () {
        let _this = this;
        api.getCodeInfoByType({
            isNoToken: false,

            success: function (res) {
                _this.setData({
                    unitList: res.data.data.UNIT,
                    accountList: res.data.data.ACCOUNT_BOOK,
                    computedList: res.data.data.ACCOUNT_CATEGORY,
                    manageList: res.data.data.MANAGE_LEVEL,
                    measureList: res.data.data.MEASURE_TYPE,
                    deptsourceList: res.data.data.PURCHASE_TYPE,
                    useList: res.data.data.PURPOSE,
                    capitalsourceList: res.data.data.FUND_SOURCES
                })
            }
        })
    },
    // 点击展开更多
    more: function () {
        this.setData({
            moreList: false
        })
    },
    // 点击收起
    slidup: function () {
        this.setData({
            moreList: true
        })
    },
    //删除图片
    deltimg: function (e) {
        if (this.data.imageList.length == 1) {
            this.setData({
                imageList: []
            })
        } else {
            this.setData({
                imageList: this.data.imageList.splice(e.currentTarget.dataset.imgIndex, 1)
            })
        }
    },
    //点击添加图片,出现弹窗，相册和相机
    addimg: function () {
        this.setData({
            phoneHide: false,
            phoneeq: -1
        })
    },
    // 点击选择状态出现弹窗
    choosestatus: function () {
        this.setData({
            statusHide: false,
        })
    },
    // 点击选择单位出现弹窗
    chooseunit: function () {
        this.setData({
            unitHide: false,
        })
    },
    // 点击选择账簿类型出现弹窗
    chooseaccount: function () {
        this.setData({
            accountHide: false,
        })
    },
    // 点击核算类别出现弹窗
    choosecomputed: function () {
        this.setData({
            computedHide: false,
        })
    },
    // 点击管理级别出现弹窗
    choosemanage: function () {
        this.setData({
            manageHide: false,
        })
    },
    // 启用日期
    bindDateChange: function (e) {
        this.setData({
            "assestInfo.startUseDate": e.detail.value
        })
    },
    // 保修期至
    warrantyDateChange: function (e) {
        this.setData({
            "assestInfo.warrantyDate": e.detail.value
        })
    },
    // 购入日期
    purchaseDateChange: function (e) {
        this.setData({
            "assestInfo.purchaseDate": e.detail.value
        })
    },
    // 到货日期
    arrivalDateChange: function (e) {
        this.setData({
            "assestInfo.arrivalDate": e.detail.value
        })
    },
    // 签订日期
    startDateChange: function (e) {
        this.setData({
            "assestInfo.startDate": e.detail.value
        })
    },
    // 点击管理级别出现弹窗
    choosemanage: function () {
        this.setData({
            manageHide: false
        })
    },
    // 点击计量类别出现弹窗
    choosemeasure: function () {
        this.setData({
            measureHide: false
        })
    },
    // 国产、进口
    chooseport: function () {
        this.setData({
            portHide: false
        })
    },
    // 点击申购部门弹窗
    choosesubscribe: function () {
        this.setData({
            'idKey': 'assestInfo.applyDeptId',
            'idName': 'assestInfo.applyDeptName'
        });
        wx.navigateTo({
            url: 'choosedepart',
        })
    },
    // 所在部门
    choosedepart: function () {
        this.setData({
            'idKey': 'assestInfo.deptId',
            'idName': 'assestInfo.deptName'
        });
        wx.navigateTo({
            url: 'choosedepart',
        })
    },
    // 管理部门
    choosemanagedepart: function () {
        this.setData({
            'idKey': 'assestInfo.manageDeptId',
            'idName': 'assestInfo.manageDeptName'
        });
        wx.navigateTo({
            url: 'choosedepart',
        })
    },
    // 点击用途出现弹窗
    chooseuse: function () {
        this.setData({
            useHide: false,
        })
    },
    // 点击设备来源出现弹窗
    choosedeptsource: function () {
        this.setData({
            deptsourceHide: false,
        })
    },
    // 点击资金来源出现弹窗
    choosecapitalsource: function () {
        this.setData({
            capitalsourceHide: false,
        })
    },
    // 弹窗方法
    chooseHost: function (event) {
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
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var tempFilePaths = res.tempFilePaths;
                    // 图片上传 http://dev.aek.com:8081/api/upload
                    wx.uploadFile({
                        url: app.globalData.API_URL + '/upload', //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'files',
                        formData: {
                            'files': tempFilePaths[0]
                        },
                        success: function (res) {
                            let data = JSON.parse(res.data);
                            if (data.data.length > 0) {
                                _this.setData({
                                    imageList: [app.globalData.PIC_URL + data.data[0]],
                                    imageList2: [data.data[0]]
                                });
                            }
                        }
                    })

                }
            })
        }
        // 如果是选择状态的弹窗
        if (!this.data.statusHide) {
            this.setData({
                "assestInfo.status": event.currentTarget.dataset.status,
                "assestInfo.statusName": event.currentTarget.dataset.statusname,
                "statuseq": event.currentTarget.dataset.status,
                "status": event.currentTarget.dataset.statusname,
                "statusHide": true
            })
        }
        // 如果是选择单位的弹窗
        if (!this.data.unitHide) {
            this.setData({
                "assestInfo.unitId": event.currentTarget.dataset.codevalue,
                "assestInfo.unitName": event.currentTarget.dataset.codetext,
                "uniteq": event.currentTarget.dataset.codevalue,
                "unit": event.currentTarget.dataset.codetext,
                "unitHide": true
            })
        }
        // 如果是选择账簿类型的弹窗
        if (!this.data.accountHide) {
            this.setData({
                "assestInfo.assetsTypeId": event.currentTarget.dataset.codevalue,
                "assestInfo.assetsTypeName": event.currentTarget.dataset.codetext,
                "accounteq": event.currentTarget.dataset.codevalue,
                "account": event.currentTarget.dataset.codetext,
                "accountHide": true
            })
        }
        // 如果选择是核算类别
        if (!this.data.computedHide) {
            this.setData({
                "assestInfo.assetsClassId": event.currentTarget.dataset.codevalue,
                "assestInfo.assetsClassName": event.currentTarget.dataset.codetext,
                "computedeq": event.currentTarget.dataset.codevalue,
                "computed": event.currentTarget.dataset.codetext,
                "computedHide": true
            })
        }
        // 如果选择是管理级别
        if (!this.data.manageHide) {
            this.setData({
                "assestInfo.manageLevel": event.currentTarget.dataset.codevalue,
                "assestInfo.manageLevelName": event.currentTarget.dataset.codetext,
                "manageeq": event.currentTarget.dataset.codevalue,
                "manage": event.currentTarget.dataset.codetext,
                "manageHide": true
            })
        }
        // 如果选择是计量类别
        if (!this.data.measureHide) {
            this.setData({
                "assestInfo.measureType": event.currentTarget.dataset.codevalue,
                "assestInfo.measureTypeName": event.currentTarget.dataset.codetext,
                "measureeq": event.currentTarget.dataset.codevalue,
                "measure": event.currentTarget.dataset.codetext,
                "measureHide": true
            })
        }
        // 如果选择是计量类别
        if (!this.data.portHide) {
            this.setData({
                "assestInfo.madeIn": event.currentTarget.dataset.codevalue,
                "porteq": event.currentTarget.dataset.codevalue,
                "portHide": true
            })
        }
        // 如果选择是用途
        if (!this.data.useHide) {
            this.setData({
                "assestInfo.purpose": event.currentTarget.dataset.codevalue,
                "assestInfo.purposeName": event.currentTarget.dataset.codetext,
                "useeq": event.currentTarget.dataset.codevalue,
                "use": event.currentTarget.dataset.codetext,
                "useHide": true
            })
        }
        // 如果选择是设备来源
        if (!this.data.deptsourceHide) {
            this.setData({
                "assestInfo.purchaseTypeId": event.currentTarget.dataset.codevalue,
                "assestInfo.purchaseTypeName": event.currentTarget.dataset.codetext,
                "deptsourceeq": event.currentTarget.dataset.codevalue,
                "deptsource": event.currentTarget.dataset.codetext,
                "deptsourceHide": true
            })
        }
        // 如果选择是资金来源
        if (!this.data.capitalsourceHide) {
            this.setData({
                "assestInfo.fundSourcesId": event.currentTarget.dataset.codevalue,
                "assestInfo.fundSourcesName": event.currentTarget.dataset.codetext,
                "capitalsourceeq": event.currentTarget.dataset.codevalue,
                "capitalsource": event.currentTarget.dataset.codetext,
                "capitalsourceHide": true
            })
        }
    },
    // 弹窗消失
    hostModal: function () {
        // 如果是选择图片的弹窗
        if (!this.data.phoneHide) {
            this.setData({
                phoneHide: true
            })
        }
        // 如果是选择状态的弹窗
        if (!this.data.statusHide) {
            this.setData({
                statusHide: true
            })
        }
        // 如果是选择单位的弹窗
        if (!this.data.unitHide) {
            this.setData({
                unitHide: true
            })
        }
        // 如果是选择账簿类型的弹窗
        if (!this.data.accountHide) {
            this.setData({
                accountHide: true
            })
        }
        // 如果选择是核算类别
        if (!this.data.computedHide) {
            this.setData({
                computedHide: true
            })
        }
        // 如果选择是管理类别
        if (!this.data.manageHide) {
            this.setData({
                manageHide: true
            })
        }
        // 如果选择是计量类别
        if (!this.data.measureHide) {
            this.setData({
                measureHide: true
            })
        }
        // 如果选择是用途
        if (!this.data.useHide) {
            this.setData({
                useHide: true
            })
        }
        // 如果选择是设备来源
        if (!this.data.deptsourceHide) {
            this.setData({
                deptsourceHide: true
            })
        }
        // 如果选择是资金来源
        if (!this.data.capitalsourceHide) {
            this.setData({
                capitalsourceHide: true
            })
        }
    },
    getAssestStatus: function () {
        let _this = this;
        api.getAssestStauts({
            isNoToken: false,
            success: function (res) {
            }
        })
    },
    //获取设备详情
    getAssestDetail: function () {
        let _this = this;
        api.zatzdetail({
            isNOToken: false,
            data: {
                id: this.data.assestId
            },
            success: function (res) {
                let imgs = [],
                    imgs2 = [];
                res.data.data.contractPrice = +res.data.data.contractPrice / 100;
                res.data.data.price = +res.data.data.price / 100;
                res.data.data.assetsClassId = res.data.data.assetsClassId ? res.data.data.assetsClassId == -1 ? null : res.data.data.assetsClassId : null;
                res.data.data.invoiceNos = res.data.data.invoiceNos ? res.data.data.invoiceNos.replace(/,/g, ";") : "";
                _this.resetDate(res.data.data);
                if (res.data.data.assetsImg) {
                    imgs.push(app.globalData.PIC_URL + res.data.data.assetsImg);
                    imgs2.push(res.data.data.assetsImg);
                }
                _this.setData({
                    imageList: imgs,
                    imageList2: imgs2,
                    assestInfo: res.data.data
                })
            }
        })
    },
    // 产地
    bindRegionChange: function (e) {
        this.setData({
            "assestInfo.prodPlace": `${e.detail.value[0]}-${e.detail.value[1]}-${e.detail.value[2]}`
        });
    },
    //更新设备信息
    updataAssest: function () {
    //   this.data.assestInfo.startUseDate = new Date(this.data.assestInfo.startUseDate).getTime()
    //   this.data.assestInfo.warrantyDate = new Date(this.data.assestInfo.warrantyDate).getTime()
    //   this.data.assestInfo.purchaseDate = new Date(this.data.assestInfo.purchaseDate).getTime()
    //   this.data.assestInfo.arrivalDate = new Date(this.data.assestInfo.arrivalDate).getTime()
    //   this.data.assestInfo.startDate = new Date(this.data.assestInfo.startDate).getTime()

    //   this.setData({
    //     assestInfo: this.data.assestInfo
    //   })
        if (app.globalData.isSave) {
            app.globalData.isSave = false;
            let arr = this.data.assestInfo.invoiceNos.split(";");
            let listInvoice = [];
            for (var i in arr) {
                listInvoice.push({
                    assetsId: this.data.assestInfo.assetsId,
                    invoiceNo: arr[i]
                });
            }
            let assestData = {
                "serialNum": this.data.assestInfo.serialNum,
                "applyDeptId": this.data.assestInfo.applyDeptId,
                "archivesCode": this.data.assestInfo.archivesCode,
                "arrivalDate": this.data.assestInfo.arrivalDate,
                "assetsBrand": this.data.assestInfo.assetsBrand,
                "assetsClassId": this.data.assestInfo.assetsClassId,
                "assetsClassVal": this.data.assestInfo.assetsClassName,
                "assetsId": this.data.assestInfo.assetsId,
                "assetsImg": this.data.imageList2.length ? this.data.imageList2[0] : null,
                "assetsSpec": this.data.assestInfo.assetsSpec,
                "assetsTypeId": this.data.assestInfo.assetsTypeId,
                "contractId": this.data.assestInfo.contractId,
                "contractName": this.data.assestInfo.contractName,
                "contractNo": this.data.assestInfo.contractNo,
                "contractPrice": this.data.assestInfo.contractPrice ? parseFloat(this.data.assestInfo.contractPrice) : null,
                "contractPriceStr": this.data.assestInfo.contractPrice ? this.data.assestInfo.contractPrice + "" : "",
                "deptId": this.data.assestInfo.deptId,
                "factoryNum": this.data.assestInfo.factoryNum,
                "fundSourcesId": this.data.assestInfo.fundSourcesId,
                //"leavePrice": "",
                "madeIn": this.data.assestInfo.madeIn,
                "manageDeptId": this.data.assestInfo.manageDeptId,
                "manageLevel": this.data.assestInfo.manageLevel,
                "measureType": this.data.assestInfo.measureType,
                "price": this.data.assestInfo.price ? parseFloat(this.data.assestInfo.price) : null,
                "priceStr": this.data.assestInfo.price ? this.data.assestInfo.price + "" : "",
                "prodPlace": this.data.assestInfo.prodPlace,
                "purchaseDate": this.data.assestInfo.purchaseDate,
                "purchaseTypeId": this.data.assestInfo.purchaseTypeId,
                "purpose": this.data.assestInfo.purpose,
                "regName": this.data.assestInfo.regName,
                "regNo": this.data.assestInfo.regNo,
                "splName": this.data.assestInfo.splName,
                "startDate": this.data.assestInfo.startDate,
                "startUseDate": this.data.assestInfo.startUseDate,
                "supplierName": this.data.assestInfo.supplierName,
                "threeLevelCode": this.data.assestInfo.threeLevelCode,
                "unitId": this.data.assestInfo.unitId,
                "warrantyDate": this.data.assestInfo.warrantyDate,
                "listInvoice": listInvoice
            };

            let _this = this;
            _this.resetDate(_this.data.assestInfo);
            _this.setData({
                "assestInfo": _this.data.assestInfo
            })

            api.updateAssetName({
              isNoToken: false,
              data: {
                assetssId: this.data.assestInfo.assetsId,
                assetsName: this.data.assestInfo.assetsName
              },
              success: function (res) {
                
              }
            });
            api.updateFactoryName({
              isNoToken: false,
              data: { 
                assetssId: this.data.assestInfo.assetsId, 
                factoryName: this.data.assestInfo.factoryName
              },
              success: function (res) {

              }
            });

            api.editAssest({
                isNoToken: false,
                data: assestData,
                success: function (res) {                    
                    wx.redirectTo({
                        url: 'assestdetail?id=' + _this.data.assestId
                    })
                    // wx.navigateBack({
                    //     delta: 1
                    // })
                },
                complete: function () {
                    app.globalData.isSave = true;
                }
            });
        }
    },
    resetDate: function (obj){
        obj.arrivalDate = obj.arrivalDate ? util.formatday(new Date(obj.arrivalDate)) : null;
        obj.createTime = obj.createTime ? util.formatday(new Date(obj.createTime)) : null;
        obj.purchaseDate = obj.purchaseDate ? util.formatday(new Date(obj.purchaseDate)) : null;
        obj.startDate = obj.startDate ? util.formatday(new Date(obj.startDate)) : null;
        obj.startUseDate = obj.startUseDate ? util.formatday(new Date(obj.startUseDate)) : null;
        obj.updateTime = obj.updateTime ? util.formatday(new Date(obj.updateTime)) : null;
        obj.warrantyDate = obj.warrantyDate ? util.formatday(new Date(obj.warrantyDate)) : null;
    },
   
  
  // 点击提交按钮
  btnClick:function(){

    this.updataAssest();
  }
})