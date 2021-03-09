const glob = require("glob");
const fs = require("fs");
const mm = require("musicmetadata");

import db from "@/datastore.js";

class Crawler {
  constructor() {
    this.active = false;
    this.processed = [];
    this.files = [];
    this.processing = null;
    db.library.remove({}, { multi: true }, (err, numRemoved) => {});
  }

  async crawl(files) {
    this.active = true;

    const processing = files
      .map((file) => file.path)
      .map((path) =>
        new Promise((resolve, reject) => {
          let readableStream = fs.createReadStream(path);
          this.processing = path;

          mm(readableStream, (err, meta) => {
            if (err) {
              reject(err);
            }
            readableStream.close();
            resolve({ path, meta });
          });
        }).catch(console.log)
      );

    Promise.all(processing).then((result) => {
      console.log("done", { result });
      this.insert(result);
    });

    return files;
  }

  insert(files) {
    const docs = this.processFiles(files);

    console.log({ docs, db });

    db.library.insert(docs, (err, newDocs) => {
      console.log("insertdone", { err, newDocs });
    });

    this.active = false;
  }

  processFiles(files) {
    return files.map((file) => {
      return {
        path: file.path.replace(/\\/g, "/"),
        artist: file.meta.artist[0],
        album: file.meta.album,
        duration: file.meta.duration,
        genre: file.meta.genre[0],
        title: file.meta.title,
        track: file.meta.track.no,
        year: file.meta.year,
      };
    });
  }
}

export default Crawler;
