import * as Sut from "../../../src/renderer/media/Transform";
import { expect } from "chai";

describe("media/Transform", () => {
  describe("getUnique", () => {
    const expected = {
      artist: ["Bazzler", "Bozzy", "The Bar", "The Foo"],
      genre: ["Baz Baz", "BotBoz", "Foo Rock"],
      year: ["1999", "2001", "2005", "2019", "2021"],
    };

    it("gets a unique file key", () => {
      const sut = Sut.getUnique(getFiles());

      expect(sut("artist")).to.deep.equal(expected.artist);
      expect(sut("genre")).to.deep.equal(expected.genre);
      expect(sut("year")).to.deep.equal(expected.year);
    });
  });

  describe("getUniqueAlbums", () => {
    // TODO: What if there are multiple years?

    it("gets unique albums for all artists", () => {
      const expected = [
        { artist: "The Bar", name: "Bar-ing Around", year: "2005" },
        { artist: "Bazzler", name: "Baz", year: "2019" },
        { artist: "Bozzy", name: "Booze", year: "2021" },
        { name: "Foo-ing Around", artist: "The Foo", year: "1999" },
        { name: "Foo-ing Around Again", artist: "The Foo", year: "2001" },
      ];

      const sut = Sut.getUniqueAlbums(getFiles());

      expect(sut()).to.deep.equal(expected);
    });

    it("gets unique albums for a single artist", () => {
      const expected = [
        { name: "Foo-ing Around", artist: "The Foo", year: "1999" },
        { name: "Foo-ing Around Again", artist: "The Foo", year: "2001" },
      ];

      const sut = Sut.getUniqueAlbums(getFiles());

      expect(sut("The Foo")).to.deep.equal(expected);
    });
  });

  describe("getMediaTypeAggregateData", () => {
    it("aggregates media type data", () => {
      const expected = [
        { count: 4, file_type: "FLAC", percent: "57.14" },
        { count: 2, file_type: "MP3", percent: "28.57" },
        { count: 1, file_type: "M4A", percent: "14.29" },
      ];

      const sut = Sut.getMediaTypeAggregateData(getFiles());

      expect(sut).to.deep.equal(expected);
    });
  });
});

const getFiles = () => [
  {
    path: "foo.flac",
    artist: "The Foo",
    album: "Foo-ing Around",
    duration: "1:23",
    genre: "Foo Rock",
    title: "Foo You Too",
    track: "1",
    year: "1999",
    file_type: "FLAC",
  },
  {
    path: "foo1.flac",
    artist: "The Foo",
    album: "Foo-ing Around",
    duration: "2:56",
    genre: "Foo Rock",
    title: "Foo You Too Again",
    track: "2",
    year: "1999",
    file_type: "FLAC",
  },
  {
    path: "bar.flac",
    artist: "The Bar",
    album: "Bar-ing Around",
    duration: "4:23",
    genre: "Foo Rock",
    title: "Barbie Girl",
    track: "1",
    year: "2005",
    file_type: "MP3",
  },
  {
    path: "boz.flac",
    artist: "Bozzy",
    album: "Booze",
    duration: "5:33",
    genre: "BotBoz",
    title: "Bonzon",
    track: "1",
    year: "2021",
    file_type: "M4A",
  },
  {
    path: "baz.flac",
    artist: "Bazzler",
    album: "Baz",
    duration: "18:46",
    genre: "Baz Baz",
    title: "Bazly",
    track: "1",
    year: "2019",
    file_type: "FLAC",
  },
  {
    path: "baz1.flac",
    artist: "Bazzler",
    album: "Baz",
    duration: "2:14",
    genre: "Baz Baz",
    title: "Bazly",
    track: "2",
    year: "2019",
    file_type: "FLAC",
  },
  {
    path: "foo3.flac",
    artist: "The Foo",
    album: "Foo-ing Around Again",
    duration: "5:56",
    genre: "Foo Rock",
    title: "Fook",
    track: "1",
    year: "2001",
    file_type: "MP3",
  },
];
