import Datastore from "nedb";
import path from "path";
import { remote } from "electron";

export const library_store = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath("userData"), "/library.db"),
});

export const settings_store = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath("userData"), "/settings.db"),
});
