/**
 * Different states a playlist can have
 *
 * A playlist has two main states. "Main" means the currently playing audio
 * tracks will be displayed in the playlist window. "Browsing" means that
 * something other than the currently playing audio tracks are being browsed and
 * displayed in the playlist window.
 */
export enum PlaylistState {
  Main = "playlist",
  Browsing = "browsing",
}

/**
 * Temp typring for playlist items
 *
 * TODO: make a proper type for this
 */
interface PlaylistItem {
  path: string;
}

/**
 * Keeps track of audio tracks that are being played and browsed
 */
export class Playlist {
  /** Current state of the playlist */
  private _state = PlaylistState.Main;

  /** Index of currently playing item in the main playlist */
  private _index: number = 0;

  /** List of audio tracks being browsed */
  private _browsing_list: PlaylistItem[] = [];

  /**
   * Create a new Playlist
   *
   * @param _main_list - list of audio tracks in the play queue
   */
  constructor(private _main_list: PlaylistItem[] = []) {}

  public get index() {
    return this._index;
  }

  public get state() {
    return this._state;
  }

  public set state(state: PlaylistState) {
    this._state = state;
  }

  /** Get source attributes of the currently playing track */
  public get now_playing(): PlaylistItem {
    return this._main_list[this._index];
  }

  /** Get the currently playing src */
  public get current_src(): string {
    return "file://" + this.now_playing.path;
  }

  /**
   * Change the currently playing item by index
   *
   * If the index is changed while the browsing playlist is displayed, we will
   * consider the browsing playlist to now be the main playlist and that
   * playback is imminent.
   *
   * @param index - index of track to play
   */
  public set index(index: number) {
    if (this._state === PlaylistState.Browsing) {
      this._main_list = this._browsing_list;
      this._state = PlaylistState.Main;
    }

    this._index = index;
  }

  /**
   * Set the main list
   *
   * When we set the main playlist, it should be initialized to the 0th index
   * because we will start playback from the first item. This is always the
   * case. For other cases, playback would be engaged via setting the index
   * instead.
   *
   * @param list - new main playlist
   */
  public setMainList(list: PlaylistItem[]) {
    this._state = PlaylistState.Main;
    this._main_list = list;
    this._index = 0;
  }

  /**
   * Set the browsing list
   *
   * The user wishes to browse a different playlist
   *
   * @param list - new browsing playlist
   *
   * */
  public setBrowsingList(list: PlaylistItem[]) {
    this._state = PlaylistState.Browsing;
    this._browsing_list = list;
  }

  /** If there is a previous item in the main playlist */
  public hasPrevious(): boolean {
    return this._index - 1 >= 0;
  }

  /** If there is a next item in the main playlist */
  public hasNext(): boolean {
    return this._index + 1 < this._main_list.length;
  }

  /** Select the previous item in the main playlist */
  public previous() {
    this._index--;
  }

  /** Select the next item in the main playlist */
  public next() {
    this._index++;
  }

  /** Get the current visible playlist contents */
  public getVisibleList(): PlaylistItem[] {
    return this._state === PlaylistState.Main
      ? this._main_list
      : this._browsing_list;
  }

  /** Determine if the user is browsing */
  public isBrowsing(): boolean {
    return this._state === PlaylistState.Browsing;
  }
}
