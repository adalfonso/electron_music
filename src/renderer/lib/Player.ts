import { Playlist } from "./Playlist";

/**
 * Main class for playing audio
 *
 * This class wraps an HTMLAudioElement and creates an abstraction used to
 * interface with that element.
 */
export class Player {
  /** Main audio fixture */
  private _audio: HTMLAudioElement = new Audio();

  /** If the player is currently playing audio */
  private _is_playing: boolean = false;

  /** Current timestamp of the current audio track */
  private _current_time: number = 0;

  /** Duration of the current audio track */
  private _duration: number = 0;

  /** Volume level 0-1 of the audio */
  private _volume: number = 1;

  /**
   * Create a new player
   *
   * Note: A playlist is simply a list of tracks that are queued to play. A
   * playlist does not necessarily have to be a concotion of various songs.
   * e.g. if you playing an album, the playlist would contain all the album
   * tracks.
   *
   * @param playlist - initial playlist
   * @param _db      - data store
   */
  constructor(private _playlist: Playlist, private _db: any) {
    // TODO: Determine if this is needed
    this._audio.crossOrigin = "anonymous";

    this._audio.addEventListener("play", () => {
      this._is_playing = true;
      this._duration = this._audio.duration;
    });

    this._audio.addEventListener("timeupdate", () => {
      this._current_time = this._audio.currentTime;
    });

    this._audio.addEventListener("loadedmetadata", () => {
      this._duration = this._audio.duration;
    });

    this._audio.addEventListener("ended", () => {
      this._is_playing = false;
      this.next();
    });
  }

  public get playlist() {
    return this._playlist;
  }

  public get volume() {
    return this._volume;
  }

  public get current_time() {
    return this._current_time;
  }

  public get duration() {
    return this._duration;
  }

  public get is_playing(): boolean {
    return this._is_playing;
  }

  /**
   * Play audio
   *
   * If a file is provided, the player will load it. If not, it will attempt to
   * play back the current audio src
   *
   * @param file - file to play (optional)
   *
   * @return this
   */
  public play(file: string = null): this {
    if (file) {
      this._load(file);
    }

    this._audio.play();

    return this;
  }

  /**
   * Change the current index of the playlist
   *
   * @param index - new index (optional)
   *
   * @return this
   */
  public changeIndex(index: number = 0): this {
    this._playlist.index = index;

    return this.play(this._playlist.current_src);
  }

  /**
   * Go to a certain point in the currently playing track
   *
   * @param percent - percent (0-1) to play at
   *
   * @return this
   */
  public goTo(percent: number): this {
    this._audio.currentTime = percent * this._duration;
    this._current_time = this._audio.currentTime;

    return this;
  }

  /**
   * Change the playlist
   *
   * @param list       - new raw playlist data
   * @param force_play - if audio should play automatically
   *
   * @return this
   *
   * TODO: fix any type
   */
  public changePlaylist(list: any[], force_play: boolean = false): this {
    /**
     * If we want to play this playlist immediately, then we will set it as the
     * main playlist. Otherwise we just want to browse it.
     */
    if (force_play) {
      this._playlist.setMainList(list);
      this.play(this._playlist.current_src);
    } else {
      this._playlist.setBrowsingList(list);
    }

    return this;
  }

  /**
   * Pause the currently playing track
   *
   * @return this
   */
  public pause(): this {
    this._audio.pause();
    this._is_playing = false;

    return this;
  }

  /**
   * Toggle the playing mode
   *
   * @return this
   */
  public toggle(): this {
    if (this._audio.src) {
      this._is_playing ? this.pause() : this.play();
    }

    return this;
  }

  /**
   * Play the previous item in the playlist
   *
   * @return this
   */
  public previous(): this {
    if (this._playlist.hasPrevious()) {
      this._playlist.previous();
      this.play(this._playlist.current_src);
    }

    return this;
  }

  /**
   * Play the next item in the playlist
   *
   * @return this
   */
  public next(): this {
    if (this._playlist.hasNext()) {
      this._playlist.next();
      this.play(this._playlist.current_src);
    }

    return this;
  }

  /**
   * Adjust the audio volume
   *
   * @param volume - volume level (0-1)
   */
  public adjustVolume(volume: number) {
    volume = Math.min(1, Math.max(0, volume));
    this._audio.volume = volume;
    this._volume = volume;
  }

  public hasAudioSource(): boolean {
    return this._audio.src !== undefined;
  }

  /**
   * Load a new audio source
   *
   * @param src - new audio source
   *
   * @return this
   */
  private _load(src: string): this {
    this._audio.src = src;

    return this;
  }
}
