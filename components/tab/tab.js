

function onTabItemTap(ev){
  console.log("gaga");
    console.log(this.data.indexeq)
     let key = ev.currentTarget.dataset.index;
     let currentDataset = ev.currentTarget.dataset;
     console.log(ev.currentTarget.dataset);
      console.log("gaga");

      // wx.navigateTo({
      //   url: currentDataset.url,
      // })

   if(key==0){
        // this.data.dataForTabbar[0].sIconUrl = Img("workblue")
        // let _dataForTabbar=
        this.setData({
          uri: '../workplat/workplat',
          indexeq:0,
        })
      }else if(key==1){
        this.setData({
          uri: '../message/message',
          indexeq:1

    })
      }else{
        this.setData({
          uri: '../user/user',
         indexeq:2
        })
      }

}
function Img(filename, state) {
  //定义img文件所在的文件夹
  const IMG_FILES_FOLDER = "/static/images/";
  //定义img文件的后缀
  const SUBFIX = ".png";
  //数组转换字符串
  if (state === undefined) {
    return [
      IMG_FILES_FOLDER,
      filename,
      SUBFIX
    ].join("");
  }
  //数组转换字符串并用-做分割
  else {
    return [
      IMG_FILES_FOLDER,
      filename,
      "-",
      state,
      SUBFIX
    ].join("");
  }
}





module.exports={
  onTabItemTap: onTabItemTap,
  setImg:Img
}