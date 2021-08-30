<template>
  <div>
    <!-- <p class="feedback">用户反馈</p> -->
    <button open-type="feedback" class="feedback">用户反馈</button>
    <div class="header">
      <van-row>
        <van-col span="6" offset="1">
          <image :src="user.avatar" class="head-pic" mode="widthFix" v-if="user.avatar"></image><!-- mode="aspectFill"-->
        </van-col>
        <van-col offset="2" style="line-height:86px;">
          <p class="user-name"><van-icon name="star" color="#f13b03" size="18px" custom-style="height:18px;margin-right:5px;" class="van-icon"></van-icon>{{user.username}}</p>
        </van-col>
      </van-row>
      <p class="sub-title">我收到的祝福<span class="underline"></span></p>
    </div>
    <div class="main" v-if="watchList.length!==0">
      <!-- <van-swipe-cell :right-width="65" v-for="(item,index) in watchList" :key="index"> -->
      <van-swipe-cell v-for="(item,index) in watchList" :key="index">
        <div class="list-box" @click="gotoCardDetail" :data-cardid="item.cardId">
          <div class="list-box-img-wrap"><image :src="item.picture" class="list-box-img" mode="widthFix" v-if="item.picture"/></div><!-- mode="aspectFill"-->
          <div>
            <div class="list-box-line-1">
              <p class="list-box-p ellipsis">{{item.festival}}</p>
              <p class="list-box-p pull-right" style="top:4px">{{item.makedate}}</p>
            </div>
            <p class="list-box-p">
              <van-icon name="point-gift-o" color="#f13b03" size="14px" custom-style="height:14px;display:block;margin-right:3px;" class="van-icon"></van-icon>
              由{{item.username}}分享的祝福
            </p>
          </div>
        </div>
        <!-- <view slot="right" class="swipe-cell-right">
          <van-icon name="delete" size="20px" color="#f13b03"></van-icon>
        </view> -->
      </van-swipe-cell>
    </div>
    <div v-if="watchList.length===0" class="empty-hint">
      <div>您还没有浏览过任何贺卡</div>
      <div>把您制作的贺卡分享给朋友们吧</div>
    </div>
  </div>
</template>
<script>
import globalStore from './../../stores/globalStore';
import Vue from 'vue';
export default {
  data() {
    return {
      user:{},
      watchList:[]
    };
  },
  methods: {
    gotoCardDetail:function(e){
      console.log("cardId",e.currentTarget.dataset.cardid);
      wx.navigateTo({
        url:"./../cardDetail/main?cardId="+e.currentTarget.dataset.cardid
      })
    }
  },
  onShow(){
    wx.request({
      url:globalStore.state.url+'getMyWatches',
      data:{
        openid:wx.getStorageSync('openid')
      },
      success:(res)=>{
        let cards=res.data.watchedcards;
        if(cards.length!==this.watchList.length){
          this.watchList=[];
          for(let i=0;i<res.data.watchedcards.length;i++){
            Vue.set(this.watchList,i,{
              cardId:cards[i].cardId,
              festival:cards[i].festival,
              makedate:cards[i].makedate,
              picture:globalStore.state.url+cards[i].picture,
              username:cards[i].username
            })
          }
          this.watchList=this.watchList.reverse();
          console.log("获取我浏览过的贺卡列表1",this.watchList);
        }else
          console.log("获取我浏览过的贺卡列表",this.watchList);
      }
    })
  },
  mounted:function(){
    this.user=wx.getStorageSync('userInfo');
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
  }
};
</script>
<style scoped>
.feedback{
  font-size: 12px;
  position: fixed;
  top: 5px;
  right: 15px;
  z-index: 2;
  background: transparent;
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  outline: none;
}
button::after {
  border: none;
}
.swipe-cell-right{
  line-height:92px;
}
.header{
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; */
  width: 100%;
  height: 180px;
  background: #fff;
  position: fixed;
  z-index:1;
  color:#333;
}
.head-pic{
  width: 86px;
  height: 86px;
  border-radius: 43px;
  margin-top: 35px;
}
.user-name{
  margin-top: 20px;
  font-size: 20px;
  flex-grow: 2;
}
.sub-title{
  position: absolute;
  bottom: 0px;
  font-size: 16px;
  left:50%;
  transform:translateX(-50%);
}
.van-icon{
  vertical-align: middle;
}
.list-box{
  width: 90%;
  height: 90px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin: 10px auto;
  display:flex;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
  position: relative;
  background: #efefef;
}
.list-box-img-wrap{
  width:70px;
  height:70px;
  background: #eee;
  margin-left:10px;
  margin-right:20px;
  border-radius:5px;
  overflow:hidden;
}
.list-box-img{
  width:100%;
}
.list-box-p{
  line-height: 40px;
  display:flex;
  align-items: center;
}
.main{
  width: 100%;
  position: absolute;
  top: 180px;
  z-index: -1;
  overflow: hidden;
  background: #fff;
}
.pull-right{
  position: absolute;
  right: 10px;
  font-size: 14px;
  color: #aaa;
}
.ellipsis{
  width: 112px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.empty-hint{
  width: 100vw;
  height: calc(100% - 226px);
  position: absolute;
  top: 226px;
  text-align: center;
  font-size: 16px;
  line-height: 28px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.underline{
  width: 92px;
  height: 3px;
  border-radius: 1px;
  background: #f13b03;
  display: block;
  margin-top:5px;
}
</style>

