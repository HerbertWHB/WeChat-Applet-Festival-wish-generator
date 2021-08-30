import globalStore from './../stores/globalStore';
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

/* 自定义上传文件方法
*参数：
*apiUrl:接口地址;
*tempFilePath:临时文件地址;
*fName:文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容;
*fData:HTTP 请求中其他额外的 form data
*/
function uploadFileFunc(tempFilePath,fName,cbUrl,navType,cardId){
  wx.uploadFile({
    url:globalStore.state.url+'uploadFile',
    filePath:tempFilePath,
    name:fName,
    formData:{
      'cardId':cardId
    },
    header:{
      "Content-Type":"multipart/form-data",
      "accept":"application/json"
    },
    success:function(res){
      console.log("uploadFile",res);
      if(JSON.parse(res.data).success){
        if(navType==='navigate'){
          wx.navigateTo({
            url:cbUrl
          });
        }else if(navType==='redirect'){
          wx.redirectTo({
            url:cbUrl
          });
        }else{
          console.log("navType",navType);
        }
      }else{
        console.log("文件上传失败");
      }
    },
    fail:function(err){
      console.log("文件上传失败",err);
    }
  })
}

function getQuery() {
  /* 获取当前路由栈数组 */
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  return options
}

export default {
  formatNumber,
  formatTime,
  uploadFileFunc,
  getQuery
}
