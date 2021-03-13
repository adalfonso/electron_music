import "./global.scss";
import Collection from "./lib/Collection";
import Vue from "vue";
import { MediaMetaData } from "./lib/Crawler";
import { SettingsData } from "./lib/Settings";
import { asyncDbFactory as db } from "./data/AsyncNedb";
//import App from "@/App.vue";

export const library_store = db<MediaMetaData>("library");
export const settings_store = db<SettingsData>("settings");

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
