<template>
  <div>
    <div style="height:40px;"></div>
    <canvas
      canvas-id="shareCanvas"
      style="width:260px;height:322px;margin: 0 auto;overflow:hidden;"
    ></canvas>
    <div style="height:40px;"></div>
    <van-row style="text-align:center" v-if="qrcodeTmp">
      <van-col span="12" offset="12">
        <van-button type="warning" @click="saveToLocal">保存到本地</van-button>
      </van-col>
      <!-- <van-col span="12">
        <van-button type="warning" open-type="share">分享给好友</van-button>
      </van-col> -->
    </van-row>
    <div style="height:30px;"></div>
  </div>
</template>
<script>
import Util from "./../../utils/index.js";
import globalStore from "./../../stores/globalStore";
export default {
  data() {
    return {
      cardId: "",
      qrcode: "",
      pictureAddress: "",
      savedImgUrl: "",
      cardPicTmp: "",
      qrcodeTmp: "",
      username:''
    };
  },
  onShow() {
    this.cardPicTmp="";
    this.qrcodeTmp="";
    wx.setNavigationBarTitle({
      title: "海报分享"
    });
    console.log("mounted");
    let qrcode = Util.getQuery().qrcode,
      cardPic = Util.getQuery().cardPic;
    this.qrcode = qrcode;
    this.pictureAddress = cardPic;
    this.cardId = Util.getQuery().cardId;
    this.username = Util.getQuery().username;

    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.downloadFile({
      url: this.pictureAddress,
      success: cres => {
        console.log(cres);
        this.cardPicTmp = cres.tempFilePath;
        
        wx.downloadFile({
          url: this.qrcode,
          success: qres => {
            console.log(qres);
            this.qrcodeTmp = qres.tempFilePath;

            // 画布绘图
            const ctx = wx.createCanvasContext("shareCanvas");
            // 背景色
            ctx.rect(0, 0, 260, 320);
            ctx.setFillStyle("white");
            ctx.fill();
            // 封面图
            ctx.drawImage(this.cardPicTmp, 20, 20, 220, 220);
            // 文字
            ctx.setTextAlign("center"); // 文字居中
            ctx.setFillStyle("#000000"); // 文字颜色：黑色
            ctx.setFontSize(12); // 文字字号：22px
            ctx.fillText("长按识别二维码", 130, 280);
            ctx.fillText(
              "查看" + this.username + "分享给你的祝福吧~",
              130,
              300
            );
            // 小程序码
            ctx.drawImage(this.qrcodeTmp,20,140,94,107);
            ctx.stroke();
            ctx.draw();
            wx.hideLoading();
          },
          fail: function(fqres) {
            console.log("download qrcode", fqres);
          }
        });
      },
      fail: function(fres) {
        console.log("download cardPic", fres);
      }
    });
  },  
  methods: {
    saveToLocal: () => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 260,
        height: 320,
        destWidth: 1300,
        destHeight: 1600,
        canvasId: "shareCanvas",
        success: res => {
          console.log("保存", res);
          this.savedImgUrl = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: this.savedImgUrl,
            success: () => {
              wx.showModal({
                title: "保存图片成功",
                content: "图片已经保存到相册，快去炫耀吧！",
                showCancel: false,
                success: res => {
                  console.log("图片保存成功的弹窗成功");
                  // wx.switchTab({
                  //   url: "./../myWishes/main"
                  // });
                  wx.navigateBack({
                    delta:1
                  })
                },
                fail: res => {
                  console.log("图片保存成功的弹窗失败");
                }
              });
            },
            fail: res => {
              console.log("图片保存失败", res);
              if (res.errMsg === "saveImageToPhotosAlbum:fail cancel") {
                wx.showModal({
                  title: "保存图片失败",
                  content: "您已取消保存图片到相册！",
                  showCancel: false
                });
              } else {
                wx.showModal({
                  title: "提示",
                  content:
                    "保存图片失败，您可以点击确定设置获取相册权限后再尝试保存！",
                  compelete: res => {
                    if (res.confirm) {
                      wx.openSetting({});
                    } else {
                      wx.showModal({
                        title: "保存图片失败",
                        content: "您已取消保存图片到相册！",
                        showCancel: false
                      });
                    }
                  }
                });
              }
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.poster {
  width: 260px;
  height: 360px;
  border: 1px solid #bbb;
  padding: 20px;
  margin: 30px auto;
}
.poster-img {
  width: 260px;
  height: 260px;
}
.poster-qrcode {
  width: 100px;
  height: 100px;
}
.poster-p {
  width: 140px;
  font-size: 16px;
}
.poster-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.poster-share-btn {
  float: right;
  margin-right: 40px;
}
</style>
