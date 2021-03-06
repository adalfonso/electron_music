import Datastore from "nedb";
import path from "path";
import { remote } from "electron";

export default {
  library: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath("userData"), "/library.db"),
  }),
  settings: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath("userData"), "/settings.db"),
  }),
};
