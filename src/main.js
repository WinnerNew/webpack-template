import App from "./App.vue";
import router from "./router";
// 引入字体图标文件
import "@/assets/css/iconfont.css";
Vue.config.productionTip = true;
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
console.log(process.env.NODE_ENV);
