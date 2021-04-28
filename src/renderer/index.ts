import "./global.scss";
import App from "@/App.vue";
import Vue from "vue";
import { Logger } from "./Logger";
import { MediaDocument } from "./media/Media";
import { MediaMediator } from "./media/MediaMediator";
import { SettingsData } from "./Settings";
import { asyncDbFactory as db } from "./data/AsyncNedb";

export const logger = new Logger(console);
export const library_store = db<MediaDocument>("library")(logger);
export const settings_store = db<SettingsData>("settings")(logger);
export const media_mediator = new MediaMediator(library_store);

new Vue({ components: { App }, template: "<App/>" }).$mount("#app");
