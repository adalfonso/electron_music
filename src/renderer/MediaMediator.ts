import { Datastore } from "./data/Datastore";
import { MediaDocument, MediaMetaData } from "./media/Media";

/** Media local an stored media data */
export class MediaMediator {
  /** Callback functions called when media change */
  private _listeners: Function[] = [];

  /** Create a mew media mediator */
  constructor(private _db: Datastore<MediaMetaData>) {}

  /**
   * Listen for changes to media with a function
   *
   * TODO: create a means to remove a listener when it is required.
   *
   * @param listener - callback function
   */
  public listen(listener: Function) {
    this._listeners.push(listener);
  }

  /**
   * Add new media
   *
   * @param media - media to add
   *
   * @return inserted docs
   */
  public async add(media: MediaMetaData[]) {
    await this._db.remove({}, { multi: true });

    const inserted_docs = await this._db.insert(media);
    const new_docs = (await this._db.find({})) as MediaDocument[];

    this._listeners.forEach(listener => listener(new_docs));

    return inserted_docs;
  }

  /**
   * Get the current media
   *
   * @return media
   */
  public get() {
    return this._db.find({});
  }
}
