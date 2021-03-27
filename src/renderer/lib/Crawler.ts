import fs from "fs";
import mm from "musicmetadata";
import { Datastore } from "@/data/Datastore";
import { MediaMetaData } from "@/media/Media";

interface MetaDataResult {
  path: string;
  meta: MM.Metadata;
}

interface FileHandle {
  path: string;
}

/**
 * Reads a directory on disk, extracts meta data and stores
 */
export class Crawler {
  /** If the crawler is currently running */
  private _is_busy: boolean = false;

  /** Current file being processed */
  private _current_file: string = null;

  /** List of all files to process */
  private _queue: string[] = [];

  /** Accumulated meta data */
  private _results: any[] = [];

  /** Crawl promise resolve handler */
  private _done_processing: Function = null;

  /** Crawl promise reject handler */
  private _error_processing: Function = null;

  /**
   * Create a new crawler
   *
   * @param _db - data store for file meta data
   */
  constructor(private _db: Datastore<MediaMetaData>) {
    this._db.remove({}, { multi: true });
  }

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
  public async crawl(files: FileHandle[]): Promise<void> {
    try {
      // let's clear existing files when this runs
      await this._db.remove({}, { multi: true });
    } catch (error) {
      console.log("An error occurred while crawling.", error);
    }

    this._is_busy = true;
    this._queue = files.map(file => file.path);

    return new Promise((resolve, reject) => {
      this._done_processing = resolve;
      this._error_processing = reject;

      this._process();
    });
  }

  /**
   * Process the next item in the queue or insert the results
   */
  private _process() {
    if (this._queue.length > 0) {
      this._processPath(this._queue.pop());
    } else {
      this._insert(this._processFiles(this._results));
    }
  }

  /**
   * Process an individial file path
   *
   * @param path - file path
   */
  private _processPath(path: string) {
    const readableStream = fs.createReadStream(path);
    this._current_file = path;

    mm(readableStream, (error, meta) => {
      if (error) {
        this._error_processing(error);
        this._cleanUp();
        return;
      }

      readableStream.close();
      this._results.push({ path, meta });
      this._process();
    });
  }

  /**
   * Load meta data into the DB
   *
   * @param files - file meta data
   */
  private async _insert(docs: MediaMetaData[]) {
    const inserted_docs = await this._db.insert(docs);

    this._is_busy = false;

    this._done_processing(inserted_docs);

    this._cleanUp();
  }

  /**
   * Convert raw meta data to media meta data
   *
   * @param files - raw meta data
   *
   * @return converted meta data
   */
  private _processFiles(files: MetaDataResult[]): MediaMetaData[] {
    return files.map(file => ({
      path: file.path.replace(/\\/g, "/"),
      artist: file.meta.artist[0],
      album: file.meta.album,
      duration: file.meta.duration,
      genre: file.meta.genre[0],
      title: file.meta.title,
      track: file.meta.track.no.toString(),
      year: file.meta.year,
      file_type: file.path.match(/.([\w\d]+)$/)[1].toUpperCase(),
    }));
  }

  /** Clean up temporary data from a crawl operation */
  private _cleanUp() {
    this._done_processing = null;
    this._error_processing = null;
  }
}
