import fs from "fs";
import mm from "musicmetadata";
import { MediaDocument, MediaMetaData } from "@/media/Media";
import { MediaMediator } from "@/media/MediaMediator";

interface MetaDataResult {
  path: string;
  meta: MM.Metadata;
}

interface FileHandle {
  path: string;
}

export interface CrawlStats {
  started_at: Date;
  ended_at: Date;
  processed_count: number;
  total_files_count: number;
}

export interface CrawlResult {
  inserted_docs: MediaDocument[];
  stats: CrawlStats;
}

/**
 * Reads a directory on disk, extracts meta data and stores
 */
export class Crawler {
  /** If the crawler is currently running */
  private _is_busy: boolean = false;

  private _crawl_stats: CrawlStats = {
    started_at: null,
    ended_at: null,
    processed_count: 0,
    total_files_count: 0,
  };

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
   * @param _media_mediator - mediates local media and media store
   */
  constructor(private _media_mediator: MediaMediator) {}

  public get is_busy(): boolean {
    return this._is_busy;
  }

  public get current_file(): string {
    return this._current_file;
  }

  public get stats() {
    return this._crawl_stats;
  }

  /**
   * Perform the crawl
   *
   * @param files - files to crawl
   *
   * @return promise to indicate when operation completes
   */
  public async crawl(files: FileHandle[]): Promise<CrawlResult> {
    this._is_busy = true;
    this._crawl_stats.started_at = new Date();
    this._queue = files.map(file => file.path);
    this._crawl_stats.total_files_count = this._queue.length;

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
      this._crawl_stats.processed_count++;
      this._process();
    });
  }

  /**
   * Load meta data into the DB
   *
   * @param files - file meta data
   */
  private async _insert(docs: MediaMetaData[]) {
    const inserted_docs = await this._media_mediator.add(docs);

    this._is_busy = false;

    this._crawl_stats.ended_at = new Date();

    this._done_processing({ inserted_docs, stats: this._crawl_stats });

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

    this._crawl_stats = {
      started_at: null,
      ended_at: null,
      processed_count: 0,
      total_files_count: 0,
    };

    this._results = [];
  }
}
