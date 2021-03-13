import fs from "fs";
import mm from "musicmetadata";
import { Datastore } from "@/data/Datastore";

/** This is the main data format for media in the app */
export interface MediaMetaData {
  path: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  title: string;
  track: string;
  year: string;
  file_type: string;
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
  constructor(private _db: Datastore<MediaMetaData>) {}

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
    try {
      // let's clear existing files when this runs
      await this._db.remove({}, { multi: true });
    } catch (error) {
      console.log("An error occurred while crawling.", error);
    }

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

          mm(readableStream, (error, meta) => {
            if (error) {
              reject(error);
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
  async insert(docs: MediaMetaData[]) {
    const inserted_docs = await this._db.insert(docs);

    this._is_busy = false;

    return inserted_docs;
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
        file_type: file.path.match(/.([\w\d]+)$/)[1].toUpperCase(),
      };
    });
  }
}
