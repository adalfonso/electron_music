import { MediaDocument } from "./Media";
import { Settings } from "@/Settings";

/** Allowed selection types */
export type SelectionCategory = "artist" | "genre" | "album";

export interface CategoryData {
  artist: string;
  album: string;
  genre: string;
  year: string;
}

/** Tracks selection state and transforms files accordingly */
export class Selector {
  /** Last selected category values */
  private _selection: Record<SelectionCategory, CategoryData> = {
    artist: null,
    genre: null,
    album: null,
  };

  /** Last media category selected; default to artist */
  private _last_selected: SelectionCategory = null;

  /**
   * Set a category value
   *
   * @param category - category to set
   * @param value    - value to set
   * */
  public set(category: SelectionCategory, value: CategoryData) {
    if (value) {
      this._selection[category] = value;
      this._last_selected = category;
    } else {
      this._selection[category] = null;
      this._last_selected = null;
    }
  }

  /**
   * Get the last set value of a category
   *
   * @param category - category to look up
   *
   * @return last value of the category
   */
  public get(category: SelectionCategory) {
    return this._selection[category];
  }

  /** Get the last set category and its value */
  public get last() {
    return {
      category: this._last_selected,
      value: this._selection[this._last_selected],
    };
  }

  /**
   * Select a simple media category
   *
   * @param category - simple category name
   * @param data     - value of category, e.g artist name, sub genre
   * @param files    - file list
   * @param settings - user settings
   *
   * @return filtered files
   */
  public select(
    category: SelectionCategory,
    data: CategoryData,
    files: MediaDocument[],
    settings: Settings
  ) {
    this.set(category, data);

    const selection = {
      artist: () => this._selectArtist(data, files),
      genre: () => this._selectGenre(data, files),
      album: () => this._selectAlbum(data, files, settings),
    };

    return this._last_selected ? selection[this._last_selected]() : [];
  }

  /**
   * Internal artist selection logic
   *
   * @param data   - artist name
   * @param files  - file list
   *
   * @return filtered files
   */
  private _selectArtist(data: CategoryData, files: MediaDocument[]) {
    return files
      .filter(file => file.artist === data.artist)
      .sort((a, b) =>
        (a.album + a.track.padStart(2, "0")).localeCompare(
          b.album + b.track.padStart(2, "0")
        )
      );
  }

  /**
   * Internal genre selection logic
   *
   * @param data  - artist name
   * @param files - file list
   *
   * @return filtered files
   */
  private _selectGenre(data: CategoryData, files: MediaDocument[]) {
    const genreFormat = song =>
      song.artist.padEnd(40, "") +
      song.album.padEnd(20, "") +
      song.track.toString().padStart(3, "0");

    return files
      .filter(file => file.genre === data.genre)
      .sort((a, b) => genreFormat(a).localeCompare(genreFormat(b)));
  }

  /**
   * Select an album
   *
   * @param data     - album data
   * @param files    - file list
   * @param settings - user settings
   *
   * @return filtered files
   */
  private _selectAlbum(
    data: CategoryData,
    files: MediaDocument[],
    settings: Settings
  ) {
    const compilations_enabled = settings.has("compilationArtists");

    return files
      .filter(f => {
        const show_compilations = compilations_enabled && !!data.album;
        const show_unknown_album = !data.album && !this._selection.artist;
        const artist_is_irrelevant = show_compilations || show_unknown_album;
        const artist_match = artist_is_irrelevant
          ? true
          : f.artist === data.artist;

        return f.album === data.album && f.year === data.year && artist_match;
      })
      .sort((a, b) => Number(a.track) - Number(b.track));
  }
}
