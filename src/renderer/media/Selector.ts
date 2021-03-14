import { capitalize } from "@/helpers";
import Settings from "@/lib/Settings";
import { MediaMetaData } from "./Media";

interface MediaSelection {
  artist: string;
  album: string;
  genre: string;
}

export class Selector {
  private _selection: MediaSelection = {
    artist: null,
    album: null,
    genre: null,
  };

  private _last_selected: keyof MediaSelection = null;

  constructor() {}

  get select_method() {
    return this["select" + capitalize(this._last_selected)];
  }

  set last(type: keyof MediaSelection) {
    this._last_selected = type;
  }

  public select(item: unknown, play: boolean, settings: Settings) {
    return this.select_method(item, play);
  }

  public set(key: keyof MediaSelection, data: string) {
    this._selection[key] = data;
  }

  private _selectArtist(artist, files: MediaMetaData[]) {
    return files
      .filter((file) => file.artist === artist)
      .sort((a, b) => (a.album + a.track).localeCompare(b.album + b.track));
  }

  private _selectAlbum(album, files: MediaMetaData[]) {
    let compilations_enabled = this.settings.has("compilationArtists");
    return files
      .filter((file) => {
        const show_compilations = compilations_enabled && !!album.name;
        const show_unknown_album = !album.name && !this._selection.artist;
        const artist_is_irrelevant = show_compilations || show_unknown_album;
        const artist_match = artist_is_irrelevant
          ? true
          : file.artist === album.artist;

        return (
          file.album === album.name && file.year === album.year && artist_match
        );
      })
      .sort((a, b) => Number(a.track) - Number(b.track));
  }

  private _selectGenre(genre, files: MediaMetaData[]) {
    const genreFormat = (song) =>
      song.artist.padEnd(40, "") +
      song.album.padEnd(20, "") +
      song.track.toString().padStart(3, "0");

    return files
      .filter((file) => file.genre === genre)
      .sort((a, b) => genreFormat(a).localeCompare(genreFormat(b)));
  }
}
