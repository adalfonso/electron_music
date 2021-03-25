/** This is the main data format for media in the app */
export interface MediaMetaData {
  path: string;
  artist: string;
  album: string;
  duration: number;
  genre: string;
  title: string;
  track: string;
  year: string;
  file_type: string;
}

export interface MediaDocument extends MediaMetaData {
  _id: string;
}

/** Summary of media type */
export interface MediaTypeAggregateData {
  file_type: string;
  count: number;
  percent: string;
}
