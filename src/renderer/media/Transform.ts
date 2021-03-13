import { AlbumData, MediaMetaData, MediaTypeAggregateData } from "./Media";

/**
 * Get a unique list of values based on a shared key
 *
 * @param files - list of files to consider
 * @param key   - lookup key
 *
 * @return unique list
 */
export const getUnique = (files: MediaMetaData[]) => (
  key: string
): string[] => {
  return [...new Set(files.map((file) => file[key]))].sort();
};

/**
 * Get unique album data for a list of files
 *
 * @param files  - list of files to consider
 * @param artist - relevant artists or none
 *
 * @return unique album data
 */
export const getUniqueAlbums = (files: MediaMetaData[]) => (
  artist: string = null
): AlbumData[] => {
  files = artist ? files.filter((song) => song.artist === artist) : files;

  return files
    .reduce(
      (carry, file) => {
        const { album: name, artist, year } = file;

        if (carry.names[name] === undefined) {
          carry.names[name] = true;
          carry.unique.push({ name, artist, year });
        }

        return carry;
      },
      { names: {}, unique: [] }
    )
    .unique.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Get aggregate of media type and prevalence
 *
 * @param files - list of files to consider
 *
 * @return aggregated media
 */
export const getMediaTypeAggregateData = (
  files: MediaMetaData[]
): MediaTypeAggregateData[] => {
  const file_types = files.reduce((carry, { file_type }) => {
    carry[file_type] = (carry[file_type] || 0) + 1;

    return carry;
  }, {} as Record<string, number>);

  return Object.entries(file_types)
    .sort((a, b) => b[1] - a[1])
    .map(([file_type, count]) => ({
      file_type,
      count,
      percent: ((count / files.length) * 100).toFixed(2),
    }));
};

/**
 * Helper that transforms media
 *
 * @param files - list of files to consider
 *
 * @return transformed or means to transform files
 */
export const media_transformations = (files: MediaMetaData[]) => ({
  artists: getUnique(files)("artist"),
  genres: getUnique(files)("genre"),
  albums: (artist: string) => getUniqueAlbums(files)(artist),
  media: getMediaTypeAggregateData(files),
});
