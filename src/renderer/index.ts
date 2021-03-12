import Vue from "vue";

//import App from "@/App.vue";
import Collection from "./lib/Collection";

import "./global.scss";

/* eslint-disable no-new */
new Vue({
  components: { App: require("./App.vue").default },
  template: "<App/>",
}).$mount("#app");

Vue.prototype.$collect = (data = []) => new Collection(data);

// class Bus {
//   private _events: Record<string, unknown> = {};

//   constructor() {}

//   register(event, target) {
//     if (!this.events[event]) {
//       this.events[event] = [];
//     }

//     this.events[event].push(target);
//   }

//   emit(event, ctx) {
//     if (!this.events[event]) {
//       return;
//     }

//     this.events[event].forEach((target) => {
//       target.handle(event, ctx);
//     });
//   }
// }

// Vue.prototype.__bus = {};
