<template>
  <div class="flex-box">
    <img src="/static/images/user-head-pic.png" class="pic-circle img-top" alt="用户头像">
    <div style="height:30px;"></div>
    <h1>欢迎使用制作我的贺卡应用</h1>
    <div style="height:70px;"></div>
    <van-button type="warning" size="large" style="width:260px;" @getuserinfo="onGotUserInfo" open-type="getUserInfo">使用微信登录</van-button>
  </div>
</template>
<script>
import globalStore from './../../stores/globalStore';
import Util from './../../utils/index';
export default {
  data(){
    return{
      type:''
    }
  },
  methods:{
    onGotUserInfo(e) {
      console.log("获取UserInfo",e.mp.detail);
      let userInfo=e.mp.detail.userInfo;
      wx.setStorageSync('userInfo',{
        username:userInfo.nickName,
        avatar:userInfo.avatarUrl
      });
      wx.login({
        success:(res)=>{
          if(res.code){
            wx.request({
              url:globalStore.state.url+'code2Session',
              data:{
                code:res.code
              },
              success:(res)=>{
                console.log('登录',res);
                wx.setStorageSync('openid',res.data.openid);
                wx.request({
                  url:globalStore.state.url+'userInfoSave',
                  data:{
                    username:userInfo.nickName.replace(/[^\u4e00-\u9fa5a-zA-Z\d,\.，。]/g, ''),
                    avatar:userInfo.avatarUrl,
                    openid:res.data.openid
                  },
                  success:(res)=>{
                    console.log('用户信息数据库存储请求结果',res);
                    if(this.type==="preview"){
                      wx.navigateBack({
                        delta:1
                      })
                    }else{
                      wx.switchTab({
                        url:"./../homepage/main"
                      })
                    }
                  }
                })
              }
            })
          }else{
            console.log('登录失败！'+res.errMsg);
          }
        }
      })
      
    }
  },
  mounted:function(){
    this.type=Util.getQuery().type;
    wx.request({
      url:globalStore.state.url+'getAccessToken',
      success:(res)=>{
        console.log("获取access_token",res);
        globalStore.state.access_token=res.data.access_token;
      }
    })
    if(wx.getStorageSync('openid')){
      if(this.type==='preview'){
        wx.navigateBack({
          delta:1
        })
      }else{
        wx.switchTab({
          url:'./../homepage/main'
        })
      }
    }
  }
}
</script>

<style scoped>
.flex-box{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pic-circle{
  width: 100px;
  height: 100px;
  border-radius: 50px;
}
.img-top{
  margin-top: 140px;
}

</style>
