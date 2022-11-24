// commonjs 模块导入
const commonJs = require("@/commonJs");
// esModule 模块导入
import esModule from "@/esModule";
console.log(commonJs);
console.log(esModule);
// css less sass样式检测
import "@/assets/css/iconfont.css";
import "@/assets/css/index.scss";
import "@/assets/css/index.less";
import bigImg from "@/assets/img/big.jpg";
import logoImg from "@/assets/img/logo.png";
import oneImg from "@/assets/img/1.jpeg";
import twoImg from "@/assets/img/2.jpeg";
import threeImg from "@/assets/img/3.png";

const app = document.querySelector("#app");
console.log(app);
//ES6语法检测 - js babel
const btnEle = document.createElement("button");
btnEle.innerText = "按钮测试";
app.appendChild(btnEle);
document.querySelector("button").onclick = () => {
  console.log("es6");
};

// fonts 字体检测
// <i class="iconfont zw-icon-a-shixiangguanli4"></i>
const iEle = document.createElement("i");
iEle.classList.add("iconfont", "zw-icon-a-shixiangguanli4");
app.appendChild(iEle);

// 图片检测;
const imgEle1 = document.createElement("img");
imgEle1.setAttribute("src", twoImg);
app.appendChild(imgEle1);

const imgEle2 = document.createElement("img");
imgEle2.setAttribute("src", oneImg);
app.appendChild(imgEle2);
imgEle2.addEventListener("click", () => {
  import("./assets/js/element_btn3").then(({ default: element }) => {
    console.log(element);
    document.body.appendChild(element.ele);
  });
});

const divEle1 = document.createElement("div");
divEle1.classList.add("img_in_sass1");
app.appendChild(divEle1);

// prefetch (预获取)：浏览器空闲的时候进行资源的拉取
divEle1.addEventListener("click", () => {
  import(/* webpackPrefetch: true */ "./assets/js/element_btn2").then(
    ({ default: element }) => {
      console.log(element);
      document.body.appendChild(element.ele);
    }
  );
});

const divEle2 = document.createElement("div");
divEle2.classList.add("img_in_sass2");
app.appendChild(divEle2);
//preload (预加载)：提前加载后面会用到的关键资源  因为会提前拉取资源，如果不是特殊需要，谨慎使用
divEle2.addEventListener("click", () => {
  import(/* webpackPreload: true */ "./assets/js/element_btn").then(
    ({ default: element }) => {
      console.log(element);
      document.body.appendChild(element.ele);
    }
  );
});
