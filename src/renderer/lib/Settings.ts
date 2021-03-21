import { Datastore } from "@/data/Datastore";

export interface SettingsData {
  name: string;
  value: boolean;
}

/** Connect the local settings state to its data store */
export class Settings {
  /** Local readable store of the settings */
  private local_store: SettingsData[] = [];

  /**
   * Create new settings configurator
   *
   * @param _db - data store for the settings
   *
   * TODO: find a better means to store these data
   *
   * Settings can be represented as a key-value store and it doesn't make a lot
   * of sense to require an entirely separate data store for them.
   **/
  constructor(private _db: Datastore<SettingsData>) {
    this._refresh();
  }

  /**
   *  Determine if the settings have an option enabled
   *
   * @param setting_name - name of the setting
   *
   * @return state of the settings
   */
  public has(setting_name: string): boolean {
    const settings = this.local_store.filter(
      setting => setting.name === setting_name
    );

    return settings.length && settings[0].value;
  }

  /**
   * Toggle a setting on or off
   *
   * TODO: Consider the operations here. Toggling a setting will potentially
   * cause two reads and a write.
   *
   * @param setting_name - name of the setting to toggle
   */
  public async toggle(setting_name: string) {
    try {
      const docs = await this._db.find({ name: setting_name });

      if (docs.length) {
        await this._db.update(docs[0], { $set: { value: !docs[0].value } });

        this._refresh();
      } else {
        await this._db.insert([{ name: setting_name, value: true }]);
      }

      this._refresh();
    } catch (error) {
      console.log(`Failed to toggle setting: ${setting_name}`, error);
    }
  }

  /** Refresh local settings */
  private async _refresh() {
    try {
      this.local_store = await this._db.find({});
    } catch (error) {
      console.log("Failed to refresh local settings state", error);
    }
  }
}
