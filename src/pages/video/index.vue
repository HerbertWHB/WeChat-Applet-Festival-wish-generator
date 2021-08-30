<template>
  <div class="main">
    <div v-if="oldVideo===''?false:true">
      <video id='myVideo' :src="newVideo===''?oldVideo:newVideo" controls class="video-con"></video>
    </div>
    <div class="sticker-back">
      <div class="operation">
        <div style="margin-right:10px;">
          <van-button type="warning" plain @click="changetoOldVideo" size="small" style="margin-right:10px;">清除Animoji</van-button>
          <van-button type="warning" @click="gotoEdit" size="small">完成</van-button>
        </div>
      </div>
      <div style="height:10px"></div>
      <van-row>
        <van-col v-for="(item,index) in animoji" :key="index" span="6">
          <image :src="item.src" :data-name="item.name" :class="item.selected?'sticker sticker-active':'sticker'" @click="AddAnimoji(item.name)"/>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import Util from "./../../utils/index";
import globalStore from '../../stores/globalStore';
import Vue from 'vue';
export default {
  data() {
    return {
      cardId: "",
      oldVideo:"",
      oldVideoAdd:"",
      newVideo:"",
      newVideoAdd:"",
      animoji:[]
    };
  },
  mounted ()  {
    wx.setNavigationBarTitle({
      title: "短视频处理"
    });
  },
  onShow ()  {
    this.cardId = Util.getQuery().cardId;
    this.oldVideoAdd = Util.getQuery().videoAdd;
    this.oldVideo=globalStore.state.url+this.oldVideoAdd;
    this.videoContext = wx.createVideoContext('myVideo');
    wx.showLoading({
      title:'视频加载中',
      mask:true
    });
    setTimeout(() => {
      wx.hideLoading();
      this.videoContext.play();
    }, 3000);
    // 请求animoji列表
    wx.request({
      url:globalStore.state.url+'getAnimoji',
      success:(res)=>{
        let animoji=res.data.animoji;
        for(let i=0;i<animoji.length;i++){
          Vue.set(this.animoji,i,{
            name:animoji[i].name,
            src:globalStore.state.url+'animoji/'+animoji[i].address,
            selected:false
          });    
        }
        console.log(this.animoji)
      }
    })
  },
  methods: {
    gotoEdit() {
      wx.request({
        url:globalStore.state.url+'submitAnimojiVideo',
        data:{
          videoAdd:(this.newVideo===''?this.oldVideoAdd:this.newVideoAdd).match(/upload\/(\S*)/)[1],
          cardId:this.cardId
        },
        success:(res)=>{
          wx.showToast({
            title:'提交成功！',
            icon:'none'
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 2000);
        }
      })
    },
    changetoOldVideo(){
      this.newVideo="";
      this.newVideoAdd="";
      for(let i=0;i<this.animoji.length;i++){
        this.animoji[i].selected=false;
      }
    },
    AddAnimoji(name){
      this.videoContext.stop();
      wx.showLoading({
        title:'视频处理中',
        mask:true
      })
      for(let i=0;i<this.animoji.length;i++){
        if(this.animoji[i].name===name){
          this.animoji[i].selected=true;
        }else{
          this.animoji[i].selected=false;
        }
      }
      wx.request({
        url:globalStore.state.url+'fuVideoAnimoji',
        data:{
          fu_access_token:wx.getStorageSync('fu_access_token'),
          oldVideoAdd:this.oldVideoAdd,
          item:name
        },
        success:(res)=>{
          wx.hideLoading();
          if(res.data.success){
            this.newVideoAdd=res.data.newVideoAdd;
            this.newVideo=globalStore.state.url+res.data.newVideoAdd;
            console.log('this.newVideo',this.newVideo);
            this.videoContext.play();
          }else{
            wx.showToast({
              title:res.data.msg,
              icon:'none'
            })
            for(let i=0;i<this.animoji.length;i++){
              this.animoji[i].selected=false;
            }
          }
        }
      })
    }
  }
};
</script>

<style scoped>
.main {
  position: relative;
  width: 100vw;
  height: 100vh;
  text-align: center;
}
.video-con {
  width: 100vw;
  height: 100vw;
  margin: 0 auto;
  background: #ddd;
}
.sticker-back{
  background:#efefef;
  width: 375px;
  height: 200px;
  position: absolute;
  bottom: 0;
  left:0;
}
.operation{
  width: 100vw;
  height: 50px;
  background: #fff;
  border-top: #ccc 1px solid;
  border-bottom: #ddd 1px solid;
  display:flex;
  flex-direction: row;
  justify-content:flex-end;
  align-items: center;
}
.sticker{
  width:60px;
  height: 60px;
}
.sticker-active{
  border-radius:5px;
  background: rgba(0,0,0,0.5);
}
</style>
