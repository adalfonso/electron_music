import {
  CategoryData,
  SelectionCategory,
  Selector as Sut,
} from "../../../src/renderer/media/Selector";
import { expect } from "chai";
import { getFiles } from "./common";
import { MediaDocument } from "@/media/Media";
import { Settings } from "@/Settings";

describe("media/Selector", () => {
  describe("set/get (selections)", () => {
    [
      {
        category: <SelectionCategory>"artist",
        value: <CategoryData>(<unknown>"fooartist"),
      },
      {
        category: <SelectionCategory>"genre",
        value: <CategoryData>(<unknown>"fooagenre"),
      },
    ].forEach(expected => {
      it(`sets and gets ${expected.category}`, () => {
        const sut = new Sut();

        expect(sut.get(expected.category)).to.be.null;

        sut.set(expected.category, expected.value);

        expect(sut.get(expected.category)).to.deep.equal(expected.value);
      });
    });
  });

  describe("select", () => {
    interface SelectTest {
      category: SelectionCategory;
      expected: MediaDocument[];
    }

    const tests: SelectTest[] = [
      {
        category: "artist",
        expected: [
          {
            _id: "11",
            path: "foo5.flac",
            artist: "The Foo",
            album: "",
            duration: 134,
            genre: "Foo Rock",
            title: "Footl",
            track: "2",
            year: "2000",
            file_type: "FLAC",
          },
          {
            _id: "6",
            path: "foo3.flac",
            artist: "The Foo",
            album: "Foo-ing Around Again",
            duration: 129,
            genre: "Foo Rock",
            title: "Fook",
            track: "1",
            year: "2001",
            file_type: "MP3",
          },
          {
            _id: "0",
            path: "foo.flac",
            artist: "The Foo",
            album: "Foo-ing Around",
            duration: 123,
            genre: "Foo Rock",
            title: "Foo You Too",
            track: "1",
            year: "1999",
            file_type: "FLAC",
          },
          {
            _id: "1",
            path: "foo1.flac",
            artist: "The Foo",
            album: "Foo-ing Around",
            duration: 124,
            genre: "Foo Rock",
            title: "Foo You Too Again",
            track: "2",
            year: "1999",
            file_type: "FLAC",
          },
          {
            _id: "8",
            album: "The Compilation",
            artist: "The Foo",
            duration: 131,
            file_type: "FLAC",
            genre: "Foo Rock",
            path: "foo4.flac",
            title: "Foot",
            track: "2",
            year: "2011",
          },
        ],
      },
      {
        category: "genre",
        expected: [
          {
            _id: "10",
            path: "baz4.flac",
            artist: "Bazzler",
            album: "",
            duration: 133,
            genre: "Baz Baz",
            title: "Bazlishli",
            track: "1",
            year: "2000",
            file_type: "FLAC",
          },
          {
            _id: "4",
            path: "baz.flac",
            artist: "Bazzler",
            album: "Baz",
            duration: 127,
            genre: "Baz Baz",
            title: "Bazly",
            track: "1",
            year: "2019",
            file_type: "FLAC",
          },
          {
            _id: "5",
            path: "baz1.flac",
            artist: "Bazzler",
            album: "Baz",
            duration: 128,
            genre: "Baz Baz",
            title: "Bazly",
            track: "2",
            year: "2019",
            file_type: "FLAC",
          },
          {
            _id: "7",
            path: "baz2.flac",
            artist: "Bazzler",
            album: "The Compilation",
            duration: 130,
            genre: "Baz Baz",
            title: "Bazlish",
            track: "1",
            year: "2011",
            file_type: "FLAC",
          },
          {
            _id: "9",
            path: "baz3.flac",
            artist: "Bazzler",
            album: "The Compilation",
            duration: 132,
            genre: "Baz Baz",
            title: "This is a different compilation",
            track: "1",
            year: "2001",
            file_type: "FLAC",
          },
        ],
      },
    ];

    tests.forEach(({ category, expected }) => {
      it(`selects files for ${category}`, () => {
        const sut = new Sut();

        expect(
          sut.select(category, expected[0], getFiles(), getSettings({}))
        ).to.deep.equal(expected);
      });
    });

    it(`deselects a category`, () => {
      const sut = new Sut();
      const primary_selection = sut.select(
        "artist",
        {
          artist: "Bazzler",
          album: "",
          genre: "Baz Baz",
          year: "2000",
        },
        getFiles(),
        getSettings({})
      );

      expect(primary_selection.length).to.be.gt(0);
      expect(
        sut.select("artist", undefined, getFiles(), getSettings({}))
      ).to.deep.equal([]);
    });
  });

  describe("selectAlbum", () => {
    interface SelectAlbumTest {
      label: string;
      expected: MediaDocument[];
      settings: Record<string, unknown>;
    }

    const tests: SelectAlbumTest[] = [
      {
        label: "selects files for album",

        expected: [
          {
            _id: "4",
            path: "baz.flac",
            artist: "Bazzler",
            album: "Baz",
            duration: 127,
            genre: "Baz Baz",
            title: "Bazly",
            track: "1",
            year: "2019",
            file_type: "FLAC",
          },
          {
            _id: "5",
            path: "baz1.flac",
            artist: "Bazzler",
            album: "Baz",
            duration: 128,
            genre: "Baz Baz",
            title: "Bazly",
            track: "2",
            year: "2019",
            file_type: "FLAC",
          },
        ],
        settings: {},
      },
      {
        label: "selects files for compilation album",

        expected: [
          {
            _id: "7",
            path: "baz2.flac",
            artist: "Bazzler",
            album: "The Compilation",
            duration: 130,
            genre: "Baz Baz",
            title: "Bazlish",
            track: "1",
            year: "2011",
            file_type: "FLAC",
          },
          {
            _id: "8",
            path: "foo4.flac",
            artist: "The Foo",
            album: "The Compilation",
            duration: 131,
            genre: "Foo Rock",
            title: "Foot",
            track: "2",
            year: "2011",
            file_type: "FLAC",
          },
        ],
        settings: {
          compilationArtists: true,
        },
      },
      {
        label: "selects files for compilation album only for the artist",

        expected: [
          {
            _id: "8",
            path: "foo4.flac",
            artist: "The Foo",
            album: "The Compilation",
            duration: 131,
            genre: "Foo Rock",
            title: "Foot",
            track: "2",
            year: "2011",
            file_type: "FLAC",
          },
        ],
        settings: {
          compilationArtists: false,
        },
      },
      {
        label: "selects files for blank album; all artists",

        expected: [
          {
            _id: "10",
            path: "baz4.flac",
            artist: "Bazzler",
            album: "",
            duration: 133,
            genre: "Baz Baz",
            title: "Bazlishli",
            track: "1",
            year: "2000",
            file_type: "FLAC",
          },
          {
            _id: "11",
            path: "foo5.flac",
            artist: "The Foo",
            album: "",
            duration: 134,
            genre: "Foo Rock",
            title: "Footl",
            track: "2",
            year: "2000",
            file_type: "FLAC",
          },
        ],
        settings: {
          compilationArtists: false,
        },
      },
    ];

    tests.forEach(({ label, expected, settings }) => {
      it(label, () => {
        const sut = new Sut();

        expect(
          sut.select("album", expected[0], getFiles(), getSettings(settings))
        ).to.deep.equal(expected);
      });
    });

    it("selects files for blank album; single artist", () => {
      const sut = new Sut();

      const expected = [
        {
          _id: "11",
          path: "foo5.flac",
          artist: "The Foo",
          album: "",
          duration: 134,
          genre: "Foo Rock",
          title: "Footl",
          track: "2",
          year: "2000",
          file_type: "FLAC",
        },
      ];

      const settings = { compilationArtists: true };

      sut.select("artist", expected[0], getFiles(), getSettings(settings));

      expect(
        sut.select("album", expected[0], getFiles(), getSettings(settings))
      ).to.deep.equal(expected);
    });
  });

  describe("last", () => {
    it("detects the last selected category and value", () => {
      const sut = new Sut();

      sut.set("artist", <CategoryData>{ artist: "fooartist" });

      expect(sut.last).to.deep.equal({
        category: "artist",
        value: { artist: "fooartist" },
      });

      sut.set("genre", <CategoryData>{ genre: "genrefoobar" });

      expect(sut.last).to.deep.equal({
        category: "genre",
        value: { genre: "genrefoobar" },
      });
    });
  });
});

const getSettings = (settings: Record<string, unknown>) => <Settings>(<unknown>{
    has: (key: string) => !!settings[key],
  });
