import "./global.scss";
import App from "@/App.vue";
import Vue from "vue";
import { MediaMetaData } from "./media/Media";
import { SettingsData } from "./lib/Settings";
import { asyncDbFactory as db } from "./data/AsyncNedb";

export const library_store = db<MediaMetaData>("library");
export const settings_store = db<SettingsData>("settings");

new Vue({
  components: { App },
  template: "<App/>",
}).$mount("#app");
