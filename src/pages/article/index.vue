<template>
  <div class="main">
    <p>请输入你想说的祝福：</p>
    <div class="van-cell-group">
      <van-cell-group>
        <textarea v-model="article" placeholder="最多140字" style="padding:10px;width:95%;"/>
      </van-cell-group>
    </div>
    <div class="van-button">
    <van-button type="warning" size="large" @click="gotoEdit">完成</van-button>
    </div>
  </div>
</template>
<script>
import globalStore from './../../stores/globalStore';
import Util from './../../utils/index';
export default {
  data(){
    return{
      message:"",
      cardId:'',
      article:''
    }
  },
  methods:{
    gotoEdit:function(){
      wx.request({
        url:globalStore.state.url+'uploadArticle',
        data:{
          article:this.article,
          cardId:this.cardId
        },
        success:(res)=>{
          console.log(res);
          wx.navigateBack({
            delta:1
          })
        }
      })
      console.log("文字素材",this.article);
    }
  },
  mounted:function(){
    wx.setNavigationBarTitle({
      title: '文字'
    });
    this.cardId=Util.getQuery().cardId;
  },
  onShow:function(){
    this.article='';
  }
}
</script>

<style scoped>
.van-cell-group{
  margin-top: 20px;
  margin-bottom:20px;
}
.van-button{
  text-align: center;
}
.main{
  padding: 20px;
  width:335px;
}
</style>
