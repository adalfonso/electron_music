import * as Sut from "../../../src/renderer/media/Transform";
import { expect } from "chai";
import { getFiles } from "./common";

describe("media/Transform", () => {
  describe("getUnique", () => {
    const expected = {
      artist: ["Bazzler", "Bozzy", "The Bar", "The Foo"],
      genre: ["Baz Baz", "BotBoz", "Foo Rock"],
      year: ["1999", "2000", "2001", "2005", "2011", "2019", "2021"],
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
        { artist: "Bazzler", album: "", year: "2000" },
        { artist: "The Bar", album: "Bar-ing Around", year: "2005" },
        { artist: "Bazzler", album: "Baz", year: "2019" },
        { artist: "Bozzy", album: "Booze", year: "2021" },
        { album: "Foo-ing Around", artist: "The Foo", year: "1999" },
        { album: "Foo-ing Around Again", artist: "The Foo", year: "2001" },
        { artist: "Bazzler", album: "The Compilation", year: "2011" },
        { artist: "Bazzler", album: "The Compilation", year: "2001" },
      ];

      const sut = Sut.getUniqueAlbums(getFiles());

      expect(sut()).to.deep.equal(expected);
    });

    it("gets unique albums for a single artist", () => {
      const expected = [
        { artist: "The Foo", album: "", year: "2000" },
        { album: "Foo-ing Around", artist: "The Foo", year: "1999" },
        { album: "Foo-ing Around Again", artist: "The Foo", year: "2001" },
        { artist: "The Foo", album: "The Compilation", year: "2011" },
      ];

      const sut = Sut.getUniqueAlbums(getFiles());

      expect(sut("The Foo")).to.deep.equal(expected);
    });
  });

  describe("getMediaTypeAggregateData", () => {
    it("aggregates media type data", () => {
      const expected = [
        { count: 9, file_type: "FLAC", percent: "75.00" },
        { count: 2, file_type: "MP3", percent: "16.67" },
        { count: 1, file_type: "M4A", percent: "8.33" },
      ];

      const sut = Sut.getMediaTypeAggregateData(getFiles());

      expect(sut).to.deep.equal(expected);
    });
  });

  describe("mediaTransformations", () => {
    [
      {
        category: "artists",
        expected: [
          { album: null, artist: "Bazzler", genre: null, year: null },
          { album: null, artist: "Bozzy", genre: null, year: null },
          { album: null, artist: "The Bar", genre: null, year: null },
          { album: null, artist: "The Foo", genre: null, year: null },
        ],
      },
      {
        category: "genres",
        expected: [
          { album: null, artist: null, genre: "Baz Baz", year: null },
          { album: null, artist: null, genre: "BotBoz", year: null },
          { album: null, artist: null, genre: "Foo Rock", year: null },
        ],
      },
      {
        category: "albums",
        expected: [
          { artist: "Bazzler", album: "", year: "2000" },
          { artist: "The Bar", album: "Bar-ing Around", year: "2005" },
          { artist: "Bazzler", album: "Baz", year: "2019" },
          { artist: "Bozzy", album: "Booze", year: "2021" },
          { album: "Foo-ing Around", artist: "The Foo", year: "1999" },
          { album: "Foo-ing Around Again", artist: "The Foo", year: "2001" },
          { artist: "Bazzler", album: "The Compilation", year: "2011" },
          { artist: "Bazzler", album: "The Compilation", year: "2001" },
        ],
      },
      {
        category: "media",
        expected: [
          { file_type: "FLAC", count: 9, percent: "75.00" },
          { file_type: "MP3", count: 2, percent: "16.67" },
          { file_type: "M4A", count: 1, percent: "8.33" },
        ],
      },
    ].forEach(({ category, expected }) => {
      it(`transforms ${category}`, () => {
        const sut = Sut.mediaTransformations(getFiles());

        expect(sut[category]()).to.deep.equal(expected);
      });
    });
  });
});
