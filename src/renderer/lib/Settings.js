import { settings_store } from "@/index";

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

  async toggle(setting_name) {
    try {
      const docs = await this.db.find({ name: setting_name });

      if (docs.length) {
        await this.db.update(docs[0], { $set: { value: !docs[0].value } });

        this.refresh();
      } else {
        await this.db.insert({ name: setting_name, value: true });
      }

      this.refresh();
    } catch (error) {
      console.log(`Failed to toggle setting: ${setting_name}`, error);
    }
  }

  async refresh() {
    try {
      this.all = await this.db.find({});
    } catch (error) {
      console.log("Failed to refresh local settings state", e);
    }
  }
}

export default Settings;
