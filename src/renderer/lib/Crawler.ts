import fs from "fs";
import mm from "musicmetadata";
// TODO: make this an interface
import Datastore from "nedb";

/** This is tha main data format for media in the app */
interface MediaMetaData {
  path: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  title: string;
  track: string;
  year: string;
}

/**
 * Reads a directory on disk, extracts meta data and stores
 */
export class Crawler {
  /** If the crawler is currently running */
  private _is_busy: boolean = false;

  /** Current file being processed */
  private _current_file: string = null;

  /**
   * Create a new crawler
   *
   * @param _db - data store for file meta data
   */
  constructor(private _db: Datastore) {}

  public get is_busy(): boolean {
    return this._is_busy;
  }

  public get current_file(): string {
    return this._current_file;
  }

  /**
   * Perform the crawl
   *
   * @param files - files to crawl
   *
   * @return promise to indicate when operation completes
   */
  public async crawl(files): Promise<void> {
    // let's clear existing files when this runs
    this._db.remove({}, { multi: true }, (err, numRemoved) => {});
    this._is_busy = true;

    /**
     * TODO: rework this
     *
     * This method is not performant - it loads up a bunch of read streams which
     * blows out the system for folders with many files. Find a way to batch
     * this operation.
     */
    const processing = files
      .map((file) => file.path)
      .map((path) =>
        new Promise((resolve, reject) => {
          let readableStream = fs.createReadStream(path);
          this._current_file = path;

          mm(readableStream, (err, meta) => {
            if (err) {
              reject(err);
            }
            readableStream.close();
            resolve({ path, meta });
          });
        }).catch(console.log)
      );

    return Promise.all(processing).then((result) => {
      this.insert(this.processFiles(result));
    });
  }

  /**
   * Load meta data into the DB
   *
   * @param files - file meta data
   */
  insert(docs: MediaMetaData[]) {
    this._db.insert(docs, (err, newDocs) => {});

    this._is_busy = false;
  }

  /**
   * Convert raw meta data to media meta data
   *
   * @param files - raw meta data
   *
   * @return converted meta data
   */
  processFiles(files): MediaMetaData[] {
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
