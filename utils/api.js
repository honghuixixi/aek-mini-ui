/**
 * auther @aiyou
 */
var http = require('http.js');
var api = {
  //密码登录
  // @param{ username, deviceId, password }
  login: function (params) {
    http.post('/oauth/auth', params)
  },
  login2:function(params){
    http.post('/oauth/authByLoginNameForWexin',params)
  },
  //登出
  loginOut: function (params) {
    http.post('/oauth/logout-success', params)
  },
  // 短信登录 获取验证码
  //  @param{ mobile, deviceId }
  getMsgCaptcha: function (params) {
    http.post('/oauth/sendLoginPwd', params)
  },
  // 重置密码  获取短信验证码
  // @param{ account }
  getCaptcha: function (params) {
    http.get('/sys/index/sendCode', params)
  },
  // 重置密码
  // @param{ account, code, password }
  resetPassword: function (params) {
    http.get('/sys/index/resetPassword', params)
  },
  // 获取权限列表 以及登录用户的基本信息
  // @param(id)
  getPermissionList: function (params) {
    http.post('/oauth/cache/permission/list', params)
  },
  //成员用户
  getTenantCount:function(params){
    http.get('/sys/user/count/tenant/'+params.data.tenantId,params)
    
  },
  //设备资产数&维修资产
  getAssetsNumMoney:function(params){
    http.get('/assets/assetsInfo/getAssetsCount',params)
  },
  //获取平台数据
  //@params{tenantId & flag=1}
  getAssetsDataCount:function(params){
    api.getTenantCount({
      isNoToken: params.isNoToken,
      data:params.data,
      success:function(tenres){    
        api.getAssetsNumMoney({
          isNoToken: params.isNoToken,
          data: params.data,
          success:function(res){
          let obj={
            memberCount: tenres.data.data,
            assentsCount:res.data.data[0].count,
            repairAssentCount:res.data.data[1].count
          }
          params.success && params.success(obj);
          }
        }) 
      }
    })
  },
  // 获取用户详情
  // @param(id)
  getUserDetail: function (params) {
    http.get('/sys/user/' + params.data.id, params)
  },
  // 修改用户姓名
  // @param(id，updateBy，realName)
  rewriteName: function (params) {
    http.post('/sys/user/editRealName', params)
  },
  // 校验当前密码
  // @param(password，id(userInfo.id))
  nowPwd: function (params) {
    http.get('/sys/user/password', params)
  },
  // 修改新密码
  // @param(password)
  rewritePwd: function (params) {
    http.post('/sys/user/onese/changePwd', params)
  },
  // 资产台账的列表页
  // @param(password)
  zatzList: function (params) {
    http.get('/assets/assetsInfo/getLedgerPage', params)
  },
   /**
   * 资产台账详情
   * @param(id)
   */
  zatzdetail: function (params) {
    http.get('/assets/assetsInfo/getAssetsDetail', params)
  },
  //添加资产台账
  addAssets:function(params){
    http.post('/assets/assetsInfo/addAssets',params)
  },
  // 维修列表
  repairlist:function(params){
    http.get('/newrepair/repRepairApply/search',params)
  },
  // 查看维修详情
  // @param(id)
  repairdetail: function (params) {
    http.get('/newrepair/repRepairApply/search/' + params.data.id, params)
  },
  //操作记录
  //@param(id)
  repairopreate: function (params) {
    http.get('/newrepair/repRepairApply/getApplyDetails/' + params.data.id, params)
  },
  //根据key查字典表
//     "typeKey": "PARTS_UNIT","name": "配件单位"
//     "typeKey": "REPAIR_TYPE","name": "维修类型"
//     "typeKey": "FAULT_PHENOMENON", "name": "故障现象"
//     "typeKey": "HUMAN_FACTOR","name": "人为因素"
//     "typeKey": "EQUIPMENT_FAILURE", "name": "设备故障"
//     "typeKey": "EXTERNAL_FACTORS", "name": "外界环境因素"
//     "typeKey": "JOB_CONTENT", "name": "工作内容"
  //@params(typeKey)
  loookdictionary: function (params) {
    http.get('/newrepair/repairDictionary/search/' + params.data.typeKey, params)
  },
  //根据key得到字典
  //@params(keyId)
  getdictionary: function (params) {
    http.get('/newrepair/repairDictionary/selectkey/' + params.data.keyId, params)
  },
  // 接单请求
  
   optionPost:function(params){
     http.post('/newrepair/repRepairTakeOrders/taking',params)
   },
   // 接单 维修人验证
   adjustPeople: function (params) {
     http.get('/sys/user/checkIsRep', params)
   },
   // 接单查看

   optionGet: function (params) {
     http.get('/newrepair/repRepairTakeOrders/search/' + params.data.id, params)
   },
   // 验收请求
   acceptPost: function (params) {
     http.post('/newrepair/repRepairCheck/check', params)
   },
   // 验收查看
   //@params(keyId)
   acceptGet: function (params) {
     http.get('/newrepair/repRepairCheck/search/' + params.data.id, params)
   },

 //预台账列表
  getPreassetsList(params){
   http.get('/assets/preAssetsInfo/getAssetsPage',params)
 },
 //提交保修
 submitRepair(params){
   http.post('/newrepair/repRepairApply/add',params)
 },
 //获取部门列表树
 getdeptTree(params){
   http.get('/sys/dept/tree/tenant/'+params.data.tenantId,params)
 },
 //获取预台账操作记录
 //@params id
 getPreAssestOperate(params){
   http.get('/assets/preAssetsInfo/getOperateByid/',params)
 },
// 获取预台账详情
//@params id !接口地址和资产台账一样  建议后台接口分开
 getPreAssestDetail(params){
   http.get('/assets/assetsInfo/getAssetsDetail/',params)
 },
 //获取维修消息列表 后续需要加上资产台账 预台账 以及系统消息 公告等
 //@params tenantId pageNo pageSize messageStatus messageLevel time isAsc orderByField
 getMsgList(params){
   http.get('/newrepair/repMessageReceive/searchX',params)
 },
 //获取代办列表
 getWaitDoList(params) {
   http.get('/newrepair/repRepairApply/waitToDo', params)
 },
//根据实施ID获取计划ID
  getPlanId(params) {
    http.get('/qc/qcImplement/getPlanId/' + params.data.moduleId, params)
},
//消息 验证 账号/权限/模块
adjustMsg(params) {
  http.get('/sys/user/checkAll', params)
},
 //获取待办的消息
 //@params (tenantid)
 getMsgStatus(params){
   http.get('/newrepair/repMessageReceive/waitDo/' + params.data.tenantid,params)
 },
//标记已读消息
remarkMsg(params){
  http.get('/newrepair/repMessageReceive/read/' + params.data.messageid,params)
},

 //提交维修报告单
//  @params()
postRepairreport(params){
  http.post('/newrepair/repRepairReport/save',params)
},
// 查看维修报告单
getRepairreport(params){
  http.get('/newrepair/repRepairReport/search/' + params.data.id,params)
},


 //获取资产台账的状态表以及设备状态数量
 //@params
 getAssestStautsList:function(params){
   http.get('/assets/assetsInfo/getAssetsStatusNum',params)
 },
 //根据type获取字典表
 //@type
  getCodeInfoByType:function(params){
    http.get("/assets/data/geCodeInfoByType?types=ACCOUNT_CATEGORY&types=MANAGE_LEVEL&types=FUND_SOURCES&types=UNIT&types=PURCHASE_TYPE&types=MEASURE_TYPE&types=DEP_TYPE&types=PURPOSE&types=ACCOUNT_BOOK",params)
  },
  //新增预台账
  /**
   * @params
   */
  addPreAssets:function(params){
    http.post("/assets/preAssetsInfo/addPreAssets",params)
  },
  /**
   * 撤销预台账
   * @params(id)
   */
  cancelPreAssets:function(params){
    http.get("/assets/preAssetsInfo/delAssets",params)
  },
  /**
   * 编辑预台账
   * @params(assestInfo)
   */
  updataAssest: function (params){
     http.post("/assets/preAssetsInfo/editAssets",params)
   },
   /**
    * 编辑资产台账
    @params(assestInfo)
    */
   editAssest: function (params){
      http.post("/assets/assetsInfo/editAssets",params)
    },
    /**
     * 获取资产台账状态列表
     * @params(tenantId)
     */
    getAssestStauts:function(params){
      http.get("/assets/assetsInfo/getAssetsStatusNum",params)
    },
    /**
     * 修改设备名称
     */
    updateAssetName: function (params) {
      http.post("/assets/assetsInfo/updateAssetsName", params)
    },
    /**
     * 修改生产商
     */
    updateFactoryName: function (params) {
      http.post("/assets/assetsInfo/updateFactoryName", params)
    },
    /**
     *编辑提交预台账
     * @params(tenantId)
     */
    submitEditAssest:function(params){
      http.post("/assets/preAssetsInfo/submitEditAssets",params)
    },
    // 获取所有省份及城市
    getProvince: function (params) {
      http.get('/sys/area/province/city', params);
    },
    // 获取待办的接单数
    getorderNum:function(params){
      http.get('/newrepair/repRepairTakeOrders/waiTaking/' + params.data.tenantid,params)
    },
    // 获取待维修的接单数
    getrepairNum: function (params) {
      http.get('/newrepair/repRepairReport/Repairing/' + params.data.tenantid, params)
    },
    // 获取待验收的接单数
    getacceptNum: function (params) {
      http.get('/newrepair/repRepairCheck/waitCheck/' + params.data.tenantid, params)
    },
    getRepairRecord: function (params) {
        http.get('/newrepair/repRepairApply/repairRecord', params);
    },
    // 服务平台
    // 获取服务平台的用户信息
    getsUserInfo: function (params){
      http.get("/cms/cmsContentUser/getCurrentUser", params)
    },
    // 获取所有消息的状态
    getStatistics: function (params) {
      http.get("/cms/cmsContent/stats", params)
    },
    // 获取所有消息的最新消息
    gethomeList:function(params){
      http.get("/cms/cmsContent/getFrontList",params)
    },
    // 通知列表
    getnoticeList:function(params){
      http.get('/cms/cmsContent/getNoticeListForMobile', params);
    },
    // 通知详情
   getnoticeInfo:function(params){
      http.get("/cms/cmsContent/getDetail",  params)
    },
   // 消息列表
   getnewsList: function (params) {
     http.get('/cms/cmsContent/getNewsListForMobile', params);
   },
   // 消息详情
   getnewsInfo: function (params) {
     http.get("/cms/cmsContent/getDetail", params)
   },
   // 文章列表
   getarticleList: function (params) {
     http.get('/cms/cmsContent/getArticleListForMobile', params);
   },
   // 文章详情
   getarticleInfo: function (params) {
     http.get("/cms/cmsContent/getDetail", params)
   },
   // 文章回复列表
   getarticlecomment: function (params) {
     http.get('/cms/cmsReply/getArticleReplyList', params);
   },
   // 文章提交回复
   subarticlecomment: function (params) {
     http.post("/cms/cmsReply/addArticleReply", params)
   },
  //  投诉与不良建议列表
   getcomplaintlist: function (params) {
     http.get("/cms/cmsContent/getComplaintList", params)
   },
   //  投诉与不良建议详情
   getcomplaintInfo: function (params) {
     http.get("/cms/cmsContent/getBadAsk", params)
   },
  //  投诉不良事件回复列表
   getcomplaintcoment: function (params) {
     http.get("/cms/cmsReply/getBadAskReplyList", params)
   },
   // 新建投诉
   subcomplaint: function (params) {
     http.post("/cms/cmsContent/newBadAsk", params)
   },
   //  咨询列表
   getconsultlist: function (params) {
     http.get("/cms/cmsContent/getConsultationList", params)
   },
   //  咨询详情
   getconsultInfo: function (params) {
     http.get("/cms/cmsContent/getConsult", params)
   },
   //  咨询回复列表
   getconsultcoment: function (params) {
     http.get("/cms/cmsReply/getBadAskReplyList", params)
   },
   // 新建咨询
   subconsult: function (params) {
     http.post("/cms/cmsContent/newConsult", params)
   },
  //  巡检接口
  // 巡检管理列表
  pollingList:function(params){
    http.get("/qc/qcImplement/search",params)
  },
  // 巡检实施详情
  planDetail: function (params) {
    http.get("/qc/qcImplement/"+params.data.id, params)
  },
  // 开始巡检
  planStart: function (params) {
    http.post("/qc/qcImplement/begin", params)
  },
  // 实施设备列表
  assetList: function (params) {
    http.get("/qc/qcImplement/search_content2", params)
  },
  // 查询巡检实施设备状态
  assetSearch: function (params) {
    http.post("/qc/qcImplement/check", params)
  },
  // 查询巡检实施设备详情
  pollDetail:function(params){
    http.post("/qc/qcImplement/getQcImAssets", params)
  },
  // 提交巡检实施详情
  subpollDetail: function (params) {
    http.post("/qc/qcImplement/submitQcImAssets", params)
  },
  // 获取巡检实施详情
  getImplementDetail: function (params) {
    http.get("/qc/qcImplement/getByid/"+params.data.id, params)
  }, 
  // 获取巡检实施详情
  IsCommit: function(params) {
    http.get("/qc/qcImplement/isCommit/" + params.data.id, params)
  },
  // 提交巡检实施
  subImplement: function (params) {
    http.post("/qc/qcImplement/submitImplementx", params)
  },
  // 获取批量巡检模板
  getMuiltyTemplate: function (id, params) {
      http.get("/qc/qcImplement/getTemplete/" + id, params)
  },
  // 批量巡检
  muiltyImplement: function (params) {
      http.post("/qc/qcImplement/batchSave", params)
  },
  // 获取批量巡检模板
  getMuiltyTemplate: function (id, params) {
      http.get("/qc/qcImplement/getTemplete/" + id, params)
  },
  // 批量巡检
  muiltyImplement: function (params) {
      http.post("/qc/qcImplement/batchSave", params)
  },
  // 巡检验收列表
  pollingAcceptList: function (params) {
      http.get("/qc/qcPlanCheck/search", params)
  },
  // 巡检验收详情
  pollingAcceptInfo: function (id, params) {
      http.get('/qc/qcImplement/getImplementReport/' + id, params)
  },
  // 巡检验收
  pollingAccept: function (id, params) {
      http.get("/qc/qcPlanCheck/check/" + id, params)
  },
  // 获取巡检实施人
  getQcUserList: function (params) {
      http.get("/sys/restAPI/getQcUserList", params);
  },
  // PM实施列表
  PMassetsList: function (params) {
    http.get("/pm/pmPlanImplementHelp/search", params)
  },
  // PM实施设备检查
  PMassetsCheck: function (params) {
      let id = params.data.id
      params.data = {}
      http.get("/pm/pmPlanImplementHelp/check/" + id, params)
  },
  // PM删除 
  PMdelete: function (params) {
      let id = params.data.id
      params.data = {}
      http.get("/pm/pmPlan/disableImplementId/" + id, params)
  },
  // PM实施详情
  PMdetail: function (params) {
      let id = params.data.id
      params.data = {}
      http.get("/pm/pmPlanImplementHelp/" + id, params)
  },
  // PM验收列表
  pmAcceptList: function (params) {
      http.get("/pm/pmPlanImplement/searchReport", params)
  },
  // PM验收详情
  pmAcceptInfo: function (id, params) {
      http.get("/pm/pmImplement/getImplementReport/" + id, params)
  },
  // PM验收
  pmAccept: function (id, params) {
      http.get("/pm/pmImplement/check/" + id, params)
  },
  // 扫描PM设备
  assetsPMScan: function(params) {
    http.get("/pm/pmPlanImplementHelp/scan/" + params.data.id, params)
  },
  // 暂存,提交巡检实施
  submitPM: function (params) {
    http.post("/pm/pmPlanImplementHelp/saveOrSubmit", params)
  },
  // 微信自动登录
  autoLogin: function (params) {
    http.post("/oauth/weixin/autologin", params)
  },
  // 检查token
  checkToken: function (params) {
    http.get("/oauth/weixin/validToken", params)
  },
  // 调用维修人接口
  getRepairName: function (params) {
    http.get("/sys/user/getRepUserList", params)
  },
  // 调用接单人接口
  getAcceptName: function (params) {
    http.get("/newrepair/repRepairConfig/selectUsers", params)
  },
  // 调用接单人接口
  getmorenName: function (params) {
    http.get("/newrepair/repRepairConfig/selectConfiger", params)
  },
  // 保养实施列表
  mtImplements: function (params) {
      http.get("/qc/mtPlanImplement/list", params)
  },
  // 保养实施详情
  mtImplementDetail: function (params) {
      let id = params.data.id
      params.data = {}
      http.get("/qc/mtPlanImplement/detail?id=" + id, params)
  },
  // 保养实施提交
  mtSubmit: function (params) {
      http.post('/qc/mtPlanImplement/submit', params)
  },
  // 扫描保养设备
  assetsMTScan: function (params) {
      http.get("/qc/mtPlanImplement/scanAssetsId", params)
  },
  // 启用或关闭消息提醒
  enableOrDisableReceiveWeChatMessage: function (params) {
      http.get("/oauth/weixin/enableOrDisableReceiveWeChatMessage", params)
  },
  // 根据扫码内容获取数据
  getDataByScan: function (params) {
      http.get("/assets/assetsInfo/getAssetsByScanResult", params)
  }
}
module.exports = api;