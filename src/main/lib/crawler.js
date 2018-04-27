const { dialog } = require('electron').remote;
const glob = require('glob');
const fs = require('fs');
const mm = require('musicmetadata');

import db from '../../renderer/datastore.js';

class Crawler {
    constructor() {
        this.active = false;
        this.processed = [];
        this.files = [];
        this.processing = null;
        db.library.remove({}, { multi: true }, (err, numRemoved) => {});
    }

    crawl(path = this.path) {
        this.active = true;

        const getDirectories = (src, callback) => {
            glob(path + '/**/*.@(mp3|flac|m4a)', callback);
        };

        getDirectories('test', (err, res) => {
            if (err) {
                console.log('Error', err);

            } else {
                this.files = res;
                this.stream();
            }
        });
    }

    stream() {
        if (!this.files.length) {
            return this.insert(this.processed);
        }

        new Promise((resolve) => {
            let readableStream = fs.createReadStream(this.files[0]);
            this.processing = this.files[0];

            mm(readableStream, (err, metadata) => {
                if (err) {
                    throw err;
                }

                resolve(metadata);
                readableStream.close()
            });
        }).then(item => {
            this.processed.push({
                path: this.files[0],
                meta: item
            });

            this.files.splice(0,1);
            this.stream();
        });
    }

    insert(files) {
        db.library.insert(files.map(file => {
            return {
                path: file.path.replace(/\\/g, "/"),
                artist: file.meta.artist[0],
                album: file.meta.album,
                duration: file.meta.duration,
                genre: file.meta.genre[0],
                title: file.meta.title,
                track: file.meta.track.no,
                year: file.meta.year
            };
        }));

        this.active = false;
    }
}

export default Crawler;
