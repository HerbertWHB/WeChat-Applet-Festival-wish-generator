<template>
  <div>
    <ul class="bg-bubbles">
      <li v-for="(item, index) in 10" :key="index"></li>
    </ul>
    <div class="header">
      <van-button v-if="type==='edit'" type="warning" size="small" @click="gotoEdit">返回修改</van-button>
      <van-button v-if="type==='edit'" plain type="warning" size="small" @click="saveCard">保存贺卡</van-button>
      <van-button v-if="type==='mywish'" type="warning" size="small" @click="myWishToEdit">编辑贺卡</van-button>
      <van-button v-if="type==='mywish'" plain type="warning" size="small" @click="shareWishes">转发分享</van-button>
      <van-button v-if="type===''" plain type="warning" size="small" @click="gotoHome">去首页</van-button>
    </div>
    <div class="main">
      <p class="sub-title">您收到了来自{{user.username}}的一份{{card.festival}}祝福，
        <br>快来看看他/她说了什么吧~
      </p>
      <image mode="aspectFit" :src="picFlag" style="margin:10px auto;width:300px;height:50px;"/>
      <image :src="card.picture" mode="aspectFill" class="card-pic row"></image>
      <div class="card-article row" v-if="card.article===''?false:true">
        <p class="sub-title">我想对你说</p>
        <div class="card-bubble">
          <span class="bubble-triangle"></span>
          {{card.article}}
        </div>
      </div>
      <div class="card-record row"  v-if="card.record===''?false:true">
        <div class="volume-box" @click="controlAudio">
          <image :src="volumeIconSrc" class="volume-icon"/>
        </div>
        <image src="/static/images/hand-left.png" class="hand-left-icon"></image>
        <p class="sub-title">点它就能听到我说话啦</p>
      </div>
      <div class="card-video row" v-if="card.video===''?false:true">
        <video :src="card.video" controls class="video-con"></video>
      </div>
      <div class="card-maker row">
        <image mode="aspectFit" :src="picHappy" style="margin:0 10px;width:100px;height:100px;"/>
        <p class="sub-title">制作人：</p>
        <image :src="user.avatar" class="maker-pic"></image>
        <p>{{user.username}}</p>
      </div>
    </div>
    <van-action-sheet
      :show="actionSheetShow"
      :actions="actions"
      cancel-text="取消"
      @close="onClose"
      @cancel="onClose"
      @select="onSelect($event)"
    />
  </div>
</template>
<script>
import globalStore from './../../stores/globalStore';
import Util from './../../utils/index';
export default {
  data() {
    return {
      userPic: "/static/images/user-head-pic.png",
      isAudioPlay:false,
      innerAudioContext:null,
      volumeIconSrc:"/static/images/volume.png",
      cardId:'',
      card:{},
      user:{},
      type:'',
      scene:'',
      qrcodePath:'',
      actionSheetShow:false,
      actions:[
        {
          name:'分享给好友',
          openType:'share'
        },{
          name:'分享到朋友圈'
        }
      ],
      picFlag:globalStore.state.url+'stickers/preview_dec_flag.gif',
      picHappy:globalStore.state.url+'stickers/happy.gif',
    };
  },
  methods: {
    onClose(){
      this.actionSheetShow=false;
    },
    onSelect(e){
      this.actionSheetShow=false;
      console.log("选择分享",e.mp.detail)
      if(e.mp.detail.name==='分享到朋友圈'){
        console.log("分享到朋友圈",globalStore.state.access_token,this.cardId)
        // wx.request({
        //   url:globalStore.state.url+'getQrcodePic',
        //   data:{
        //     access_token:globalStore.state.access_token,
        //     cardId:this.cardId
        //   },
        //   method:'get',
        //   success:(res)=>{
        //     let qrpath=globalStore.state.url+res.data.qrpath;
        //     console.log('获取二维码图片地址接口',qrpath);
        //     this.qrcodePath=qrpath;
        //     wx.navigateTo({
        //       url:'./../posterShare/main?cardId='+this.cardId+'&qrcode='+qrpath+'&cardPic='+this.card.picture+'&username='+this.user.username
        //     })
        //   }
        // })
        wx.navigateTo({
          url:'./../posterShare/main?cardId='+this.cardId+'&qrcode='+this.qrcodePath+'&cardPic='+this.card.picture+'&username='+this.user.username
        })
      }
    },
    shareWishes(){
      this.actionSheetShow=true;
    },
    gotoEdit(){
      wx.navigateBack({
        delta:1
      });
    },
    myWishToEdit(){
      wx.navigateTo({
        url:'./../edit/main?cardId='+this.cardId
      })
    },
    controlAudio(){
      console.log('播放录音',this.isAudioPlay);
      if(this.isAudioPlay===false){
        this.innerAudioContext.play();
      }else{
        this.innerAudioContext.stop();
      }
    },
    saveCard(){
      wx.showModal({
        title:'提示',
        content:'保存成功！',
        showCancel:false,
        success:(res)=>{
          console.log('保存成功');
          wx.switchTab({
            url:'./../homepage/main'
          })
        }
      })
    },
    gotoHome(){
      wx.switchTab({
        url:'./../homepage/main'
      })
    }
  },
  onLoad(query){
    console.log("onload");
    // 音频事件
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放');
      this.isAudioPlay=true;
      this.volumeIconSrc="/static/images/volume-dynamic.gif";
    })
    this.innerAudioContext.onStop(() => {
      console.log('录音播放停止');
      this.isAudioPlay=false;
      this.volumeIconSrc="/static/images/volume.png";
    })
    this.innerAudioContext.onEnded(() => {
      console.log('录音播放完毕');
      this.isAudioPlay=false;
      this.volumeIconSrc="/static/images/volume.png";
    })
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg);
      console.log(res.errCode);
    })  
  },
  mounted(){
    console.log('mounted',this.card);
    wx.setNavigationBarTitle({
      title: "贺卡预览"
    });
  },
  onShow(){
    this.type='';
    this.cardId=Util.getQuery().cardId;
    this.type=Util.getQuery().type?Util.getQuery().type:'';
    // console.log("type",Util.getQuery().type,this.type);
    // 判断从哪里跳转过来
    if(this.type===''){
      wx.navigateTo({
        url:'./../login/main?type=preview'
      })
    }
    // 请求贺卡素材内容，card表内容
    wx.request({
      url:globalStore.state.url+'cardContent',
      data:{
        cardId:this.cardId
      },
      success:(res)=>{
        console.log('请求页面返回数据',res);
        console.log('cardId',this.cardId);
        let data=res.data;
        this.card={};
        this.card['article']=data.article;
        this.card['festival']=data.festival;
        this.card['makedate']=data.makedate;
        this.card['picture']=globalStore.state.url+data.picture;
        this.card['record']=(data.record===''?'':(globalStore.state.url+data.record));
        this.card['video']=(data.video===''?'':(globalStore.state.url+data.video));
        console.log("this.card",this.card);
        this.innerAudioContext.src = this.card.record;
        this.user=data.user;
        // 将该贺卡cardId加入到当前用户的watchedcards字段中去
        wx.request({
          url:globalStore.state.url+'watchedCards',
          data:{
            openid:wx.getStorageSync('openid'),
            cardId:this.cardId
          },
          success:(res)=>{
            console.log('浏览记录',res);
          }
        })
      }
    })
    wx.request({
      url:globalStore.state.url+'getQrcodePic',
      data:{
        access_token:globalStore.state.access_token,
        cardId:this.cardId
      },
      method:'get',
      success:(res)=>{
        let qrpath=globalStore.state.url+res.data.qrpath;
        console.log('获取二维码图片地址接口',qrpath);
        this.qrcodePath=qrpath;
      }
    })
    // this.user=wx.getStorageSync('userInfo');
  }
};
</script>

<style scoped>
.sub-title{
  font-size: 16px;
}
.main {
  text-align: center;
  padding: 80px 10px 5px 10px;
}
.card-pic {
  width: 300px;
  height: 300px;
  background: #ccc;
  border-radius: 10px;
}
.hand-left-icon {
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
.card-record {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}
.volume-box{
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 0 5px #ccc;
  margin-right: 15px;
  width: 50px;
  height: 50px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.volume-icon{
  width: 25px;
  height: 25px;
}
.card-article {
  text-align: left;
  margin:0 20px;
}
.card-bubble {
  width: 283px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-top: 10px;
  padding: 15px;
  position: relative;
  background: #eee;
  z-index: -1;
}
.bubble-triangle{
  display:block; 
  border-width:10px; 
  position:absolute; 
  left:-19px;
  top: 10px;
  border-style:solid dashed dashed; 
  border-color: transparent #eee transparent transparent ;
  font-size:0; 
  line-height:0;
}
.card-video {
  width: 100%;
}
.video-con{
  margin: 0 auto;
}
.maker-pic {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-left: 10px;
  margin-right: 5px;
}
.card-maker {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  margin:0 20px;
}
.row {
  margin-bottom: 30px;
}
.header{
  width: 335px;
  position: fixed;
  background: #fff;
  padding: 15px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.bg-bubbles{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index:-1;
}
.bg-bubbles li{
  position: absolute;
  bottom: -160px;
  width: 50px;
  height: 50px;
  /* background-color: rgba(255, 255, 255, 0.15); */
  /* background-size:30px 30px; */
  list-style: none;
  animation: square 15s infinite;
  transition-timing-function: linear;
}
.bg-bubbles li:nth-child(1){
  left: 10%;
  background: url(../../../static/images/lantern_01.png) no-repeat;
}
.bg-bubbles li:nth-child(2){
  left: 20%;
  animation-delay: 2s;
  animation-duration: 7s;
  background: url(../../../static/images/lantern_02.png) no-repeat;
}
.bg-bubbles li:nth-child(3){
  left: 25%;
  animation-delay: 4s;
  background: url(../../../static/images/lantern_03.png) no-repeat;
}
.bg-bubbles li:nth-child(4){
  left: 40%;
  animation-duration: 8s;
  background-color: rgba(255, 255, 255, 0.3);
  background: url(../../../static/images/lantern_04.png) no-repeat;
}
.bg-bubbles li:nth-child(5){
  left: 70%;
  background: url(../../../static/images/lantern_05.png) no-repeat;
}
.bg-bubbles li:nth-child(6){
  left: 80%;
  animation-delay: 3s;
  background-color: rgba(255, 255, 255, 0.2);
  background: url(../../../static/images/lantern_01.png) no-repeat;
}
.bg-bubbles li:nth-child(7){
  left: 32%;
  animation-delay: 2s;
  background: url(../../../static/images/lantern_02.png) no-repeat;
}
.bg-bubbles li:nth-child(8){
  left: 55%;
  animation-delay: 4s;
  animation-duration: 15s;
  background: url(../../../static/images/lantern_03.png) no-repeat;
}
.bg-bubbles li:nth-child(9){
  left: 25%;
  animation-delay: 2s;
  animation-duration: 12s;
  background-color: rgba(255, 255, 255, 0.3);
  background: url(../../../static/images/lantern_04.png) no-repeat;
}
.bg-bubbles li:nth-child(10){
  left: 85%;
  animation-delay: 5s;
  background: url(../../../static/images/lantern_05.png) no-repeat;
}
@keyframes square {
  0% {
    opacity: 0.8;
    transform: translateY(0px);
  }
  25% {
    opacity: 0.9;
    transform: translateY(-300px);
  }
  50% {
    opacity: 0.95;
    transform: translateY(-500px);
  }
  75%{
    opacity: 1;
    transform: translateY(-800px);
  }
  100% {
    opacity: 0;
    transform: translateY(-1000px);
  }
}
</style>
