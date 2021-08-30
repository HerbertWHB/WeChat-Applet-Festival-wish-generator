<template>
  <div style="width:100vw;">
    <image :src="picLantern" class="lantern"/><!-- mode="aspectFill" -->
    <div class="footer">
      <van-cell-group>
        <van-cell
          title="节日"
          :value="festival"
          is-link
          @click="selectFestival()"></van-cell>
      </van-cell-group>
      <div style="height:60px;width:300px;"></div>
      <van-button 
        type="warning" 
        size="large" 
        @click="gotoEdit"
        >开始制作</van-button>
    </div>
    <div v-show="pickerShow" class="van-picker">
      <div class="mask"></div>
      <van-picker
        show-toolbar
        title="请选择节日"
        :columns="columns"
        @cancel="onCancel()"
        @confirm="onConfirm($event)"
      ></van-picker>
    </div>
  </div>
</template>
<script>
import globalStore from './../../stores/globalStore';
import Util from './../../utils/index';
export default {
  data() {
    return {
      festival: "请点击选择节日",
      columns: ["春节", "圣诞节"],
      pickerShow:false,
      cardId:'',
      picLantern:globalStore.state.url+'stickers/home-lantern.png'
    };
  },
  methods: {
    selectFestival: function() {
      //显示选择器
      this.pickerShow=true;
    },
    onCancel: function() {
      //选择器点击取消
      console.log("取消");
      this.pickerShow=false;
    },
    onConfirm: function(e) {
      //选择器点击确认
      console.log(e.mp.detail.value);
      this.pickerShow=false;
      this.festival=e.mp.detail.value;
    },
    gotoEdit:function(){
      if(this.festival==='请点击选择节日'){
        wx.showModal({
          title:'提示',
          content:'您还没有选择节日！',
          showCancel:false,
          success:(res)=>{
            console.log(res);
          }
        })
      }else{
        wx.request({
          url:globalStore.state.url+'createNewCard',
          data:{
            festival:this.festival,
            username:wx.getStorageSync('userInfo').username.replace(/[^\u4e00-\u9fa5a-zA-Z\d,\.，。]/g, ''),
            avatar:wx.getStorageSync('userInfo').avatar,
            openid:wx.getStorageSync('openid')
          },
          success:(res)=>{
            console.log(res);
            this.cardId=res.data.cardId
            wx.setStorageSync('fu_access_token',res.data.fu_access_token); //获取相芯科技access_token
            wx.redirectTo({
              url:"./../edit/main?cardId="+res.data.cardId
            })
          }
        });
      }
    }
  },
  mounted:function(){
    wx.setNavigationBarTitle({
      title: '制作祝福'
    });
    let that=this;
    wx.request({
      url:globalStore.state.url+'home',
      success(res){
        that.columns=res.data.columns;
      },
      fail(err){
        console.log(err)
      }
    });
  },
  onUnload:function(){
    this.festival="请点击选择节日";
  }
};
</script>
<style scoped>
.van-picker{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
}
.mask{
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}
.footer{
  width: 300px;
  position: absolute;
  top:260px;
  left:50%;
  transform: translateX(-50%);
}
.lantern{
  width:90vw;
  height:90vw;
  object-fit:cover;
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  top:-40px;
}
</style>

