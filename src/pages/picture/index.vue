<template>
  <div class="main">
    <image :src="processImg" mode="aspectFill" class="face-img"/>
    <!--美颜-->
    <div class="sticker-back" v-if="current==='beauty'">
      <div class="operation">
        <div style="margin-right:10px;">
          <van-button type="warning" @click="gotoSticker" size="small">下一步</van-button>
        </div>
      </div>
      <div class="beauty-back">
        <!-- <div class="operation-beauty">
          <checkbox-group @change="changeToBeauty($event)">
            <label>
              <checkbox value="beauty"></checkbox>
              去美颜
            </label>
          </checkbox-group>
        </div> -->
        <van-row style="margin-top:15px;display:block;">
          <van-col span="4">磨皮</van-col>
          <van-col class="flexVerticleCenter" style="height:24px" span="20"><van-slider :value="this.blur" @change="onChange($event,'blur')" active-color="#FF976A" /></van-col>
        </van-row>
        <van-row style="margin-top:15px;display:block;">
          <van-col span="4">美白</van-col>
          <van-col class="flexVerticleCenter" style="height:24px" span="20"><van-slider :value="this.color" @change="onChange($event,'color')" active-color="#FF976A" /></van-col>
        </van-row>
        <van-row style="margin-top:15px;display:block;">
          <van-col span="4">红润</van-col>
          <van-col class="flexVerticleCenter" style="height:24px" span="20"><van-slider :value="this.red" @change="onChange($event,'red')" active-color="#FF976A" /></van-col>
        </van-row>
      </div>
    </div>
    <!--贴纸-->
    <div class="sticker-back" v-if="current==='sticker'">
      <div class="operation">
        <div style="margin-right:10px;">
          <van-button type="warning" plain @click="changetoOldImg" size="small" style="margin-right:10px;">清除贴纸</van-button>
          <van-button type="warning" @click="gotoEdit" size="small">完成</van-button>
        </div>
      </div>
      <div style="height:10px"></div>
      <van-row>
        <van-col v-for="(item,index) in stickers" :key="index" span="6">
          <image :src="item.src" :data-name="item.name" :class="item.selected?'sticker sticker-active':'sticker'" @click="Addsticker(item.name)"/>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import globalStore from './../../stores/globalStore';
import Util from './../../utils/index';
import Vue from 'vue';
export default {
  data(){
    return{
      cardId:'',
      oldImg:'',
      oldImgAdd:'',
      newImg:'',
      newImgAdd:'',
      stickers:[],
      current:'beauty',
      beautyImg:'',
      beautyImgAdd:'',
      blur:0,
      color:0,
      red:0
    }
  },
  mounted(){
    wx.setNavigationBarTitle({
      title: '图片处理'
    });
  },
  onShow(){
    this.stickers=[];
    this.current='beauty';
    // 获取url传参
    this.cardId=Util.getQuery().cardId;
    this.oldImgAdd=Util.getQuery().picAdd;
    this.oldImg=globalStore.state.url+Util.getQuery().picAdd;
    this.beautyImg="";
    this.beautyImgAdd="";
    this.newImg="";
    this.newImgAdd="";
    console.log('picture页面接收的url参数',Util.getQuery().picAdd)
    // 请求原图和stickers
    wx.request({//faceunity
      url:globalStore.state.url+'getStickers',
      success:(res)=>{
        console.log('原图picAdd',this.oldImg)
        console.log('获取贴纸',res);
        let stickers=res.data.stickers;
        for(let i=0;i<stickers.length;i++){
          Vue.set(this.stickers,i,{
            name:stickers[i].name,
            src:globalStore.state.url+'stickers/'+stickers[i].address,
            selected:false
          });    
        }
        console.log("this.stickers",this.stickers);
      }
    })
    // wx.request({//face++
    //   url:globalStore.state.url+'getStickers2',
    //   success:(res)=>{
    //     console.log('原图picAdd',this.oldImg)
    //     console.log('获取贴纸',res);
    //     let stickers=res.data.stickers;
    //     for(let i=0;i<stickers.length;i++){
    //       Vue.set(this.stickers,i,{
    //         name:stickers[i].name,
    //         src:globalStore.state.url+'stickers2/'+stickers[i].address,
    //         selected:false
    //       });    
    //     }
    //     console.log("this.stickers",this.stickers);
    //   }
    // })
  },
  methods:{
    gotoEdit(){
      this.newImg=this.newImg===""?this.beautyImg:this.newImg;
      this.newImgAdd=this.newImgAdd===""?this.beautyImgAdd:this.newImgAdd;
      console.log('cardId',this.cardId)
      wx.showLoading({
        title:'图片上传中'
      });
      wx.request({
        url:globalStore.state.url+'submitFuImg',
        data:{
          cardId:this.cardId,
          imgAdd:this.newImgAdd.match(/upload\/(\S*)/)[1]
        },
        success:(res)=>{
          console.log('提交处理过的图片',res);
          wx.hideLoading();
          if(res.data.success){
            wx.showToast({
              title:'图片处理提交成功！',
              success:()=>{
                wx.navigateBack({
                  delta:1
                });
              }
            })
          }else{
            wx.showToast({
              title:'提交处理的图片失败，请再次尝试提交',
              icon:'none'
            })
          }
        }
      })
    },
    Addsticker(name){
      wx.showLoading({
        title:'图片处理中',
        mask:true
      });
      for(let i=0;i<this.stickers.length;i++){
        if(this.stickers[i].name===name){
          this.stickers[i].selected=true;
        }else{
          this.stickers[i].selected=false;
        }
      }
      wx.request({//faceunity接口
        url:globalStore.state.url+'faceunity',
        data:{
          type:'sticker',
          fu_access_token:wx.getStorageSync('fu_access_token'),
          oldImgAdd:this.beautyImgAdd,
          sticker:name
        },
        success:(res)=>{
          console.log('贴纸处理过的图片',res);
          wx.hideLoading();
          if(res.data.success===true){
            this.newImgAdd=res.data.newImgAdd;
            this.newImg=globalStore.state.url+res.data.newImgAdd;
          }else{
            wx.showToast({
              title:res.data.errMsg,
              icon:'none'
            });
          }
        }
      })
      // wx.request({//face++接口
      //   url:globalStore.state.url+'facePPDetect',
      //   data:{
      //     imgUrl:this.beautyImgAdd,
      //     stickerType:name
      //   },
      //   success:(res)=>{
      //     console.log('贴纸处理过的图片',res);
      //     wx.hideLoading();
      //     if(res.data.success===true){
      //       this.newImgAdd=res.data.newImgAdd;
      //       this.newImg=globalStore.state.url+res.data.newImgAdd;
      //     }else{
      //       wx.showToast({
      //         title:'图片处理失败',
      //         icon:'none'
      //       });
      //     }
      //   }
      // })
    },
    changetoOldImg(){  // 清除贴纸
      this.newImg="";
      this.newImgAdd="";
      for(let i=0;i<this.stickers.length;i++){
        this.stickers[i].selected=false;
      }
    },
    changeToBeauty(e){
      console.log('去美颜',e.mp.detail.value);
      if(e.mp.detail.value.length!==0){ // 勾选了去美颜
        wx.showLoading({
          title:'图片处理中',
          mask:true
        });
        wx.request({//调用faceunity接口
          url:globalStore.state.url+'faceunity',
          data:{
            type:'beauty',
            fu_access_token:wx.getStorageSync('fu_access_token'),
            oldImgAdd:this.oldImgAdd,
          },
          success:(res)=>{
            console.log('去美颜接口返回值',res);
            wx.hideLoading();
            if(res.data.success===true){
              this.beautyImgAdd=res.data.newImgAdd;
              this.beautyImg=globalStore.state.url+res.data.newImgAdd;
            }else{
              wx.showToast({
                title:res.data.errMsg,
                icon:'none'
              });
            }
          }
        })
        // wx.request({
        //   url:globalStore.state.url+'facePPBeauty',
        //   data:{
        //     imgUrl:this.oldImgAdd
        //   },
        //   success:(res)=>{
        //     console.log('去美颜接口返回值',res);
        //     wx.hideLoading();
        //     if(res.data.success===true){
        //       this.beautyImgAdd=res.data.img;
        //       this.beautyImg=globalStore.state.url+res.data.img;
        //     }else{
        //       wx.showToast({
        //         title:res.data.err,
        //         icon:'none'
        //       });
        //     }
        //   }
        // })
      }else{  // 取消勾选去美颜
        this.beautyImg="";
        this.beautyImgAdd=""
      }
    },
    gotoSticker(){ // 美颜下一步
      this.beautyImg=this.beautyImg===""?this.oldImg:this.beautyImg;
      this.beautyImgAdd=this.beautyImgAdd===""?this.oldImgAdd:this.beautyImgAdd;
      this.current='sticker';
    },
    onChange(event,flag) {
      this[flag]=event.mp.detail/100;
      wx.showLoading({
        title:'图片处理中',
        mask:true
      });
      wx.request({//调用faceunity接口
        url:globalStore.state.url+'faceunity',
        data:{
          type:'beauty',
          fu_access_token:wx.getStorageSync('fu_access_token'),
          oldImgAdd:this.oldImgAdd,
          params:`{"skin_detect":1,"heavy_blur":0,"face_shape_level":0,"blur_level":${this.blur},"color_level":${this.color},"red_level":${this.red}}`
        },
        success:(res)=>{
          console.log('去美颜接口返回值',res);
          wx.hideLoading();
          if(res.data.success===true){
            this.beautyImgAdd=res.data.newImgAdd;
            this.beautyImg=globalStore.state.url+res.data.newImgAdd;
          }else{
            wx.showToast({
              title:res.data.errMsg,
              icon:'none'
            });
            Vue.set(this,[flag],0);
          }
        }
      })
    }
  },
  computed:{
    processImg(){
      if(this.current==="beauty"){
        console.log('computed-beauty',this.beautyImg===""?this.oldImg:this.beautyImg);
        return this.beautyImg===""?this.oldImg:this.beautyImg;
      }else if(this.current==="sticker"){
        console.log('computed-sticker',this.newImg===""?this.beautyImg:this.newImg);
        return this.newImg===""?this.beautyImg:this.newImg;
      }
    }
  }
}
</script>

<style scoped>
.main{
  position: relative;
  width:100vw;
  height: 100vh;
  text-align:center;
}
.sticker-back{
  background:#efefef;
  width: 375px;
  height: 250px;
  position: absolute;
  bottom: 0;
  left:0;
}
.face-img{
  width: 100vw;
  height: 100vw;
  margin: 0 auto;
  background: #ddd;
}
.sticker{
  width:60px;
  height: 60px;
}
.sticker-bar{
  background: #fff;
  border-bottom: #333;
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
.operation-beauty{
  display:flex;
  flex-direction: row;
  justify-content:center;
  align-items: center;
  margin-left: 10px;
}
.operation-beauty label{
  font-size: 18px;
}
.beauty-back{
  width:100vw;
  height: 155px;
}
.sticker-active{
  border-radius:5px;
  background: rgba(0,0,0,0.5);
}
.flexVerticleCenter{
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}
</style>
