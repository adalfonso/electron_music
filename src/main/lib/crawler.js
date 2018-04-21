const { dialog } = require('electron').remote;
const fs = require('fs');
const mm = require('musicmetadata');

import db from '../../renderer/datastore.js';

class Crawler {
    constructor() {
    //    db.library.remove({}, { multi: true }, (err, numRemoved) => {});
    }

    crawl(path = this.path) {
        fs.readdir(path, (err, dir) => {

            var promises = dir.map(item => {
                return this.stat(path, item);
            });

            Promise.all(promises).then((items) => {
                let files = items.filter(item => item.isFile);
                let folders = items.filter(item => !item.isFile);

                if (files.length) {
                    this.insert(files);
                }

                if (folders.length) {
                    folders.forEach(folder => {
                        this.crawl(folder.path + '/' + folder.item)
                    });
                }
            });
        });

        return true;
    }

    stat(path, item) {
        return new Promise((resolve) => {
            let fullPath = path + '/' + item;

            fs.stat(fullPath, (err, stats) => {
                if (err) {
                    stats = {size: 0, mtime: Date.now()};
                }

                let payload = {
                    path: path,
                    item: item,
                    isFile: stats.isFile()
                }

                if (!payload.isFile) {
                    resolve(payload);
                }

                let metadata = this.metadata(fullPath).then(response => {
                    payload.meta =   response;

                    resolve(payload);
                });
            });
        });
    }

    insert(files) {
        db.library.insert(files.map(file => {
            return {
                path: file.path.replace(/\\/g, "/") + '/' + file.item,
                artist: file.meta.artist[0],
                album: file.meta.album,
                duration: file.meta.duration,
                genre: file.meta.genre[0],
                title: file.meta.title,
                track: file.meta.track.no,
                year: file.meta.year
            };
        }));
    }

    metadata(file) {
        return new Promise((resolve) => {
            mm(fs.createReadStream(file), (err, metadata) => {
                if (err) {
                    throw err;
                }

                resolve(metadata);
            });
        });

    }
}

export default Crawler;
