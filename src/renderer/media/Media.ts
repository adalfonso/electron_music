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

/** Album specific sub-data */
export interface AlbumData {
  name: string;
  artist: string;
  year: string;
}

/** Summary of media type */
export interface MediaTypeAggregateData {
  file_type: string;
  count: number;
  percent: string;
}
