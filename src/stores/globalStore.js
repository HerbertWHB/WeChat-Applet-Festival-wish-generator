import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const httpsUrl="https://www.cxya.club/";
const httpUrl="http://192.168.43.104:8084/";  //自己的手机热点
// const httpUrl="http://10.200.103.110:8084/";  //公司网络
// const httpUrl='http://10.201.103.227:8084/';//公司外网
// const httpUrl="http://10.213.100.201:8084/";
// const httpUrl="http://192.168.42.45:8084/"; //自己手机USB共享网络

export default new Vuex.Store({
  state:{
    url:httpUrl,
    appid:'wxc2886963bafca8f6',
    secret:'250e3b71dacbe96eebed5ddb361630dd',
    access_token:'',
    fu_access_token:''
  }
});