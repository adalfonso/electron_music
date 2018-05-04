import DB from '../../renderer/datastore.js';

class Settings {
    constructor() {
        this.db = DB;
        this.all = [];
        this.refresh();
    }

    has(name) {
        let settings = this.all.filter(setting => setting.name === name);
        return settings.length && settings[0].value;
    }

    toggle(settingName) {
        this.db.settings.find({ name: settingName }, (err, docs) => {
            if (docs.length) {
                this.db.settings.update(docs[0], {
                    $set: { value: !docs[0].value }
                }, this.refresh.bind(this))
            } else {
                this.db.settings.insert({
                    name: settingName, value: true
                }, this.refresh.bind(this));
            }
        });
    }

    refresh() {
        this.db.settings.find({}, (err, docs) => {
            this.all = docs;
        });
    }
}

export default Settings;
