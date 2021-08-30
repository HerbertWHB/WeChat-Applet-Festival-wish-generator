<template>
  <div>
    <div class="main">
      <!-- <div class="box" @click="gotoPicture">
        <p>封面图片</p>
        <p>(必选)</p>
      </div>
      <div class="box" @click="gotoVideo">短视频</div>
      <div class="box" @click="gotoRecord">语音</div>
      <div class="box" @click="gotoArticle">文字</div> -->
      <div class="box2 box-record" @click="gotoPicture">
        <van-icon custom-style="height:14px;display:block;margin-right:5px;margin-left:20px;" name="brush-o" color="#f13b03" size="14px"></van-icon>
        <p>封面图片</p>
        <p>(必选)</p>
      </div>
      <div class="box2 box-record" @click="gotoVideo">
        <van-icon custom-style="height:14px;display:block;margin-right:5px;margin-left:20px;" name="brush-o" color="#f13b03" size="14px"></van-icon>
        短视频
      </div>
      <div class="box2 box-record" @click="gotoRecord">
        <van-icon custom-style="height:14px;display:block;margin-right:5px;margin-left:20px;" name="brush-o" color="#f13b03" size="14px"></van-icon>
        语音
      </div>
      <div class="box2 box-record" @click="gotoArticle">
        <van-icon custom-style="height:14px;display:block;margin-right:5px;margin-left:20px;" name="brush-o" color="#f13b03" size="14px"></van-icon>
        文字
      </div>
    </div>
    <div class="footer">
      <van-row>
        <van-col span="8" offset="1">
          <van-button type="warning" @click="gotoHome" size="large">退出制作</van-button>
        </van-col>
        <van-col span="8" offset="6" style="text-align:right">
          <van-button type="warning" @click="gotoPreview" size="large">贺卡预览</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import globalStore from "./../../stores/globalStore";
import Util from "./../../utils/index";
export default {
  data() {
    return {
      cardId: ""
    };
  },
  methods: {
    gotoPicture() {
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          console.log(res.tempFilePaths[0]);
          let tempFilePath = res.tempFilePaths[0];
          // Util.uploadFileFunc(tempFilePath,'picture',"./../picture/main?cardId="+this.cardId,'navigate',this.cardId);
          wx.uploadFile({
            url: globalStore.state.url + "uploadFile",
            filePath: tempFilePath,
            name: "picture",
            formData: {
              cardId: this.cardId
            },
            header: {
              "Content-Type": "multipart/form-data",
              accept: "application/json"
            },
            success: (res)=> {
              console.log("uploadFile", res);
              if (JSON.parse(res.data).success) {
                console.log('edit页面上传图片接口返回图片文件名',JSON.parse(res.data).file);
                wx.navigateTo({
                  url: "./../picture/main?cardId="+this.cardId+"&picAdd="+JSON.parse(res.data).file
                });
              } else {
                console.log("文件上传失败");
              }
            },
            fail: function(err) {
              console.log("文件上传失败", err);
            }
          });
        }
      });
    },
    gotoVideo: function() {
      wx.chooseVideo({
        sourceType: ["album", "camera"],
        maxDuration: 30,
        camera: "back",
        success: res => {
          // console.log(res.tempFilePath);
          // let tempFilePath = res.tempFilePath;
          // Util.uploadFileFunc(
          //   tempFilePath,
          //   "video",
          //   "./../video/main?cardId=" + this.cardId,
          //   "navigate",
          //   this.cardId
          // );
          console.log(res.tempFilePath);
          let tempFilePath = res.tempFilePath;
          wx.showLoading({
            title:'上传视频中',
            mask:true
          })
          wx.uploadFile({
            url: globalStore.state.url + "uploadFile",
            filePath: tempFilePath,
            name: "video",
            formData: {
              cardId: this.cardId
            },
            header: {
              "Content-Type": "multipart/form-data",
              "accept": "application/json"
            },
            success: (res)=> {
              console.log("uploadFile", res);
              if (JSON.parse(res.data).success) {
                console.log('edit页面上传视频，接口返回视频文件名',JSON.parse(res.data).file);
                wx.hideLoading();
                wx.navigateTo({
                  url: "./../video/main?cardId="+this.cardId+"&videoAdd="+JSON.parse(res.data).file+"&temp="+tempFilePath
                });
              } else {
                console.log("文件上传失败");
              }
            },
            fail: function(err) {
              console.log("文件上传失败", err);
            }
          });
        }
      });
    },
    gotoRecord: function() {
      wx.navigateTo({
        url: "./../record/main?cardId=" + this.cardId
      });
    },
    gotoArticle: function() {
      wx.navigateTo({
        url: "./../article/main?cardId=" + this.cardId
      });
    },
    gotoPreview: function() {
      wx.request({
        url: globalStore.state.url + "hasPicture",
        data: {
          cardId: this.cardId
        },
        success: res => {
          console.log("是否有封面图片", res);
          if (!res.data.hasPicture) {
            wx.showModal({
              title: "提示",
              content: "您还没有添加封面图片！",
              showCancel: false,
              success(res) {
                console.log(res);
              }
            });
          } else {
            wx.navigateTo({
              url: "./../preview/main?cardId=" + this.cardId + "&type=edit"
            });
          }
        }
      });
    },
    gotoHome: function() {
      console.log("gotoHome", this.cardId);
      let cardId = this.cardId;
      wx.showModal({
        title: "提示",
        content: "退出将不保存当前制作内容，确认退出制作吗？",
        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            wx.request({
              url: globalStore.state.url + "quitMakeCard",
              data: {
                cardId: cardId
              },
              success: res => {
                console.log("不保存当前贺卡", res);
                wx.switchTab({
                  url: "./../homepage/main"
                });
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  },
  mounted: function() {
    wx.setNavigationBarTitle({
      title: "制作祝福"
    });
    this.cardId = Util.getQuery().cardId;
    console.log("mounted", Util.getQuery().cardId);
  },
  onUnload: function() {
    console.log("onUnload");
  }
};
</script>
<style scoped>
.footer {
  padding: 0 20px;
}
.box {
  width: 120px;
  height: 120px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  color:#333;
}
.main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 324px;
  margin: 10px auto;
}
.van-button--normal {
  width: 100px;
}
.box2{
  width: 90%;
  border:1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 8px #ccc;
  margin:10px auto;
  display:flex;
  align-items:center;
  justify-content:start;
}
.box-picture{
  height: 300px;
}
.box-record{
  height: 100px;
}
.box-article{
  height: 200px;
}
.van-btn .van-button{
  width:90px;
}
</style>

