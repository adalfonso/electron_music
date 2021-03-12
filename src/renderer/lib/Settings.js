import { settings_store } from "@/Datastore";

class Settings {
  constructor() {
    this.db = settings_store;
    this.all = [];
    this.refresh();
  }

  has(name) {
    let settings = this.all.filter((setting) => setting.name === name);
    return settings.length && settings[0].value;
  }

  toggle(settingName) {
    this.db.find({ name: settingName }, (err, docs) => {
      if (docs.length) {
        this.db.update(
          docs[0],
          {
            $set: { value: !docs[0].value },
          },
          this.refresh.bind(this)
        );
      } else {
        this.db.insert(
          {
            name: settingName,
            value: true,
          },
          this.refresh.bind(this)
        );
      }
    });
  }

  refresh() {
    this.db.find({}, (err, docs) => {
      this.all = docs;
    });
  }
}

export default Settings;
