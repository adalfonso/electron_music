import "./global.scss";
import App from "@/App.vue";
import Vue from "vue";
import { Logger } from "./Logger";
import { MediaDocument } from "./media/Media";
import { SettingsData } from "./lib/Settings";
import { asyncDbFactory as db } from "./data/AsyncNedb";

export const library_store = db<MediaDocument>("library");
export const settings_store = db<SettingsData>("settings");
export const logger = new Logger(console);

new Vue({ components: { App }, template: "<App/>" }).$mount("#app");
