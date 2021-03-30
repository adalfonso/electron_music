import { MediaMetaData, MediaTypeAggregateData } from "./Media";
import { CategoryData, SelectionCategory } from "./Selector";

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
  return [...new Set(files.map(file => file[key]))].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
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
): CategoryData[] => {
  files = artist ? files.filter(song => song.artist === artist) : files;

  return files
    .reduce(
      (carry, file) => {
        const { album, artist, year } = file;

        const key = `${album} - ${year}`;

        if (carry.names[key] === undefined) {
          carry.names[key] = true;
          carry.unique.push({ album, artist, year });
        }

        return carry;
      },
      { names: {}, unique: [] }
    )
    .unique.sort((a, b) => a.album.localeCompare(b.album));
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
export const mediaTransformations = (files: MediaMetaData[]) => ({
  artists: () => mapCategory("artist")(getUnique(files)("artist")),
  genres: () => mapCategory("genre")(getUnique(files)("genre")),
  albums: (artist: string) => getUniqueAlbums(files)(artist),
  media: () => getMediaTypeAggregateData(files),
});

/**
 * Stub a category value into CategoryData
 *
 * @param category - category to stub
 * @param values   - a list of all values for that category
 *
 * @return stubbed CategoryData
 **/
const mapCategory = (category: SelectionCategory) => (
  values: string[]
): CategoryData[] =>
  values.map(value => {
    const thing = getMapTemplate();
    thing[category] = value;

    return thing;
  });

/** Get a dummy template for CategoryData */
const getMapTemplate = () => ({
  artist: null,
  album: null,
  genre: null,
  year: null,
});
