<template>
  <div>
    <div v-if="cardList.length!==0">
      <van-swipe-cell :right-width="65" v-for="(item,index) in cardList" :key="index">
        <div class="list-box" @click="gotoCardDetail" :data-cardid="item.cardId">
          <div class="list-box-img-wrap"><image :src="item.picture" mode="widthFix" class="list-box-img" v-if="item.picture"/></div><!-- mode="aspectFill"-->
          <div>
            <p class="list-box-p">{{item.festival}}</p>
            <p class="list-box-p"><van-icon custom-style="height:14px;display:block;margin-right:3px;" name="brush-o" color="#f13b03" size="14px"></van-icon>于{{item.makedate}}制作</p>
          </div>
        </div>
        <view slot="right" class="swipe-cell-right">
          <van-icon name="delete" color="#f13b03" size="20px" @click="deleteCard(item.cardId)"></van-icon>
        </view>
      </van-swipe-cell>
    </div>
    <div v-if="cardList.length===0" class="empty-hint">
      <van-icon name="gift-card-o" size="80px"/>
      <div>您还没有制作任何贺卡</div>
      <div>去制作首页制作吧</div>
    </div>
  </div>
</template>
<script>
import globalStore from './../../stores/globalStore';
import Vue from 'vue'
export default {
  data(){
    return{
      cardList:[]
    }
  },
  methods:{
    gotoCardDetail:function(e){
      console.log('cardId',e.currentTarget.dataset.cardid);
      wx.navigateTo({
        url:"./../preview/main?cardId="+e.currentTarget.dataset.cardid+'&type=mywish'
      })
    },
    deleteCard(id){
      console.log('id',id)
      wx.showModal({
        title:'提示',
        content:'确定删除该贺卡吗？',
        success:(res)=>{
          if (res.confirm) {
            wx.request({
              url:globalStore.state.url+'deleteCard',
              data:{
                cardId:id
              },
              success:(res)=>{
                console.log('删除贺卡',res)
                if(res.data.success){
                  wx.showToast({
                    title:'删除成功'
                  })
                  wx.request({
                    url:globalStore.state.url+'getMyWishes',
                    data:{
                      openid:wx.getStorageSync('openid')
                    },
                    success:(res)=>{
                      let cards=res.data.cards;
                      this.cardList=[];
                      for(let i=0;i<cards.length;i++){
                        Vue.set(this.cardList,i,{
                          cardId:cards[i].cardId,
                          festival:cards[i].festival,
                          picture:globalStore.state.url+cards[i].picture,
                          makedate:cards[i].makedate
                        });
                      }
                      this.cardList=this.cardList.reverse();
                      console.log("onShow",this.cardList);
                    }
                  })
                }else{
                  wx.showToast({
                    title:'删除失败'
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  onShow(){
    wx.request({
      url:globalStore.state.url+'getMyWishes',
      data:{
        openid:wx.getStorageSync('openid')
      },
      success:(res)=>{
        let cards=res.data.cards;
        if(cards.length!==this.cardList.length){
          this.cardList=[];
          for(let i=0;i<cards.length;i++){
            Vue.set(this.cardList,i,{
              cardId:cards[i].cardId,
              festival:cards[i].festival,
              picture:globalStore.state.url+cards[i].picture,
              makedate:cards[i].makedate
            });
          }
          this.cardList=this.cardList.reverse();
        }else
          console.log("onShow",this.cardList);
      }
    })
  },
  mounted(){
    wx.setNavigationBarTitle({
      title: '我的祝福'
    });
    console.log("mounted",this.cardList);
  },
  onPullDownRefresh(){
    console.log('下拉刷新')
    wx.showNavigationBarLoading();
    wx.request({
      url:globalStore.state.url+'getMyWishes',
      data:{
        openid:wx.getStorageSync('openid')
      },
      success:(res)=>{
        let cards=res.data.cards;
        this.cardList=[];
        for(let i=0;i<cards.length;i++){
          Vue.set(this.cardList,i,{
            cardId:cards[i].cardId,
            festival:cards[i].festival,
            picture:globalStore.state.url+cards[i].picture,
            makedate:cards[i].makedate
          });
        }
        this.cardList=this.cardList.reverse();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  }
};
</script>
<style scoped>
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
  background: #fff;
  color:#333;
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
.swipe-cell-right{
  line-height:92px;
}
.empty-hint{
  width: 100vw;
  height: 100vh;
  text-align: center;
  font-size: 16px;
  line-height: 28px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

