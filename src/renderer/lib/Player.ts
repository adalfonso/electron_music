import Playlist from "./Playlist.js";

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
   * Current playlist
   *
   * A playlist is simply a list of tracks that are queued to play. A playlist
   * does not necessarily have to be a concotion of various songs. e.g. if you
   * playing an album, the playlist would contain all the album tracks.
   */
  private _playlist: any;

  /**
   * Create a new player
   *
   * @param playlist - initial player (optional)
   * @param _db      - data store
   */
  constructor(playlist = [], private _db: any) {
    // TODO: DI this in instead
    this._playlist = new Playlist(playlist);

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
    this._playlist.change(index);
    this._playlist.state = "playlist";
    return this.play(this._playlist.currentFile());
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
    if (force_play) {
      this._playlist.state = "playlist";
      this._playlist.list = list;
      this._playlist.index = 0;
      this.play(this._playlist.currentFile());
    } else {
      this._playlist.state = "browsing";
      this._playlist.browsing = list;
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
      this.play(this._playlist.currentFile());
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
      this.play(this._playlist.currentFile());
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

  public isPlaying(): boolean {
    return this._is_playing;
  }

  public hasAudioSource(): boolean {
    return this._audio.src !== undefined;
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
