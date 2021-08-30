<template>
  <div class="main">
    <image :src="recordPic" class="record-pic"></image>
    <div style="text-align:center;font-size:14px;">（限制录音时长60秒）</div>
    <div style="margin-top:60px;text-align:center;">
      <div :hidden="recordStart || recordOk">
        <van-button type="warning" size="large" @click="startRecord">开始录音</van-button>
      </div>
      <div :hidden="!recordStart">
        <van-row>
          <van-col span="12">
            <van-button type="warning" @click="cancelRecord">取消录音</van-button>
          </van-col>
          <van-col span="12">
            <van-button type="warning" @click="completeRecord">结束录音</van-button>
          </van-col>
        </van-row>
      </div>
      <div :hidden="!recordOk">
        <audio id="recordPreview"
          name="录音"
          :author="author"
          :src="recordPreview"
          controls
        ></audio>
        <div style="height:30px;"></div>
        <van-row>
          <van-col span="12">
            <van-button type="warning" @click="restartRecord">重新录音</van-button>
          </van-col>
          <van-col span="12">
            <van-button type="warning" @click="submitRecord">提交录音</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
import globalStore from './../../stores/globalStore';
import Util from "./../../utils/index";

const recorderManager = wx.getRecorderManager();

const options = {
  duration: 60000,  //指定录音时长，1分钟自动结束录音
  sampleRate: 44100,  //采样率
  numberOfChannels: 1,  //录音通道数
  encodeBitRate: 192000,  //编码码率
  format: "mp3",  //音频格式，有效值aac/mp3
  frameSize: 50  //指定帧大小，单位KB
};
export default {
  data() {
    return {
      recordStart: false,
      recordOk:false,
      recordPreview:"",
      author:"用户名字",
      cardId:'',
      recordCancel:false,
      isRecording:false
    };
  },
  computed:{
    recordPic(){
      return this.isRecording?globalStore.state.url+"stickers/record_1.gif":globalStore.state.url+"stickers/record_0.png";
    }
  },
  mounted: function() {
    wx.setNavigationBarTitle({
      title: "录音"
    });
    this.cardId=Util.getQuery().cardId;
    // 录音
    recorderManager.onStart(() => {
      console.log("recorder start");
    });
    recorderManager.onPause(() => {
      console.log("recorder pause");
    });
    recorderManager.onStop(res => {
      console.log("recorder stop", res);
      this.recordStart = false;
      if(this.recordCancel===false){  //结束录音（点击按钮触发或1分钟到自动停止录音）
        this.recordOk=true;
        wx.uploadFile({
          url:globalStore.state.url+'uploadFile',
          filePath:res.tempFilePath,
          name:'record',
          formData:{
            'cardId':this.cardId
          },
          header:{
            "Content-Type":"multipart/form-data",
            "accept":"application/json"
          },
          success:(res)=>{
            console.log('录音地址',res);
            this.recordPreview=globalStore.state.url+JSON.parse(res.data).file;
          }
        })
      }
    });
    recorderManager.onFrameRecorded(res => {
      const { frameBuffer } = res;
      console.log("frameBuffer.byteLength", frameBuffer.byteLength);
    });

  },
  onShow: function() {
      this.recordStart= false;
      this.recordOk=false;
      this.recordPreview="";
      this.author="用户名字";
      this.cardId='';
      this.recordCancel=false;
  },
  methods: {
    startRecord() {
      //开始录音
      this.recordStart = true;
      this.isRecording=true;
      recorderManager.start(options);
    },
    cancelRecord() {
      //取消录音
      this.recordCancel=true;
      this.isRecording=false;
      recorderManager.stop();
    },
    completeRecord() {
      //结束录音
      this.isRecording=false;
      recorderManager.stop();
    },
    submitRecord() {
      //提交录音
      wx.navigateBack({
        delta:1
      })
    },
    restartRecord(){
      //重新录音
      this.recordOk=false;
    }
  }
};
</script>

<style scoped>
.main {
  padding: 40px 20px 0 20px;
}
.record-pic {
  width: 300px;
  height: 300px;
  display: block;
  margin: 0 auto;
}
</style>
