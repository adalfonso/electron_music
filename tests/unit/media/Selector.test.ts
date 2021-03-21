import {
  CategoryData,
  SelectionCategory,
  Selector as Sut
} from "../../../src/renderer/media/Selector";
import { expect } from "chai";
import { getFiles } from "./common";
import { MediaMetaData } from "@/media/Media";
import Settings from "@/lib/Settings";

describe("media/Selector", () => {
  describe("set/get (selections)", () => {
    [
      {
        category: <SelectionCategory>"artist",
        value: <CategoryData>(<unknown>"fooartist")
      },
      {
        category: <SelectionCategory>"genre",
        value: <CategoryData>(<unknown>"fooagenre")
      }
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
      expected: MediaMetaData[];
    }

    const tests: SelectTest[] = [
      {
        category: "artist",
        expected: [
          {
            path: "foo5.flac",
            artist: "The Foo",
            album: "",
            duration: 134,
            genre: "Foo Rock",
            title: "Footl",
            track: "2",
            year: "2000",
            file_type: "FLAC"
          },
          {
            path: "foo3.flac",
            artist: "The Foo",
            album: "Foo-ing Around Again",
            duration: 129,
            genre: "Foo Rock",
            title: "Fook",
            track: "1",
            year: "2001",
            file_type: "MP3"
          },
          {
            path: "foo.flac",
            artist: "The Foo",
            album: "Foo-ing Around",
            duration: 123,
            genre: "Foo Rock",
            title: "Foo You Too",
            track: "1",
            year: "1999",
            file_type: "FLAC"
          },
          {
            path: "foo1.flac",
            artist: "The Foo",
            album: "Foo-ing Around",
            duration: 124,
            genre: "Foo Rock",
            title: "Foo You Too Again",
            track: "2",
            year: "1999",
            file_type: "FLAC"
          },
          {
            album: "The Compilation",
            artist: "The Foo",
            duration: 131,
            file_type: "FLAC",
            genre: "Foo Rock",
            path: "foo4.flac",
            title: "Foot",
            track: "2",
            year: "2011"
          }
        ]
      },
      {
        category: "genre",
        expected: [
          {
            path: "baz4.flac",
            artist: "Bazzler",
            album: "",
            duration: 133,
            genre: "Baz Baz",
            title: "Bazlishli",
            track: "1",
            year: "2000",
            file_type: "FLAC"
          },
          {
            path: "baz.flac",
            artist: "Bazzler",
            album: "Baz",
            duration: 127,
            genre: "Baz Baz",
            title: "Bazly",
            track: "1",
            year: "2019",
            file_type: "FLAC"
          },
          {
            path: "baz1.flac",
            artist: "Bazzler",
            album: "Baz",
            duration: 128,
            genre: "Baz Baz",
            title: "Bazly",
            track: "2",
            year: "2019",
            file_type: "FLAC"
          },
          {
            path: "baz2.flac",
            artist: "Bazzler",
            album: "The Compilation",
            duration: 130,
            genre: "Baz Baz",
            title: "Bazlish",
            track: "1",
            year: "2011",
            file_type: "FLAC"
          },
          {
            path: "baz3.flac",
            artist: "Bazzler",
            album: "The Compilation",
            duration: 132,
            genre: "Baz Baz",
            title: "This is a different compilation",
            track: "1",
            year: "2001",
            file_type: "FLAC"
          }
        ]
      }
    ];

    tests.forEach(({ category, expected }) => {
      it(`selects files for ${category}`, () => {
        const sut = new Sut();

        expect(
          sut.select(category, expected[0], getFiles(), getSettings({}))
        ).to.deep.equal(expected);
      });
    });
  });

  describe("selectAlbum", () => {
    interface SelectAlbumTest {
      label: string;
      expected: MediaMetaData[];
      settings: Record<string, unknown>;
    }

    const tests: SelectAlbumTest[] = [
      {
        label: "selects files for album",

        expected: [
          {
            path: "baz.flac",
            artist: "Bazzler",
            album: "Baz",
            duration: 127,
            genre: "Baz Baz",
            title: "Bazly",
            track: "1",
            year: "2019",
            file_type: "FLAC"
          },
          {
            path: "baz1.flac",
            artist: "Bazzler",
            album: "Baz",
            duration: 128,
            genre: "Baz Baz",
            title: "Bazly",
            track: "2",
            year: "2019",
            file_type: "FLAC"
          }
        ],
        settings: {}
      },
      {
        label: "selects files for compilation album",

        expected: [
          {
            path: "baz2.flac",
            artist: "Bazzler",
            album: "The Compilation",
            duration: 130,
            genre: "Baz Baz",
            title: "Bazlish",
            track: "1",
            year: "2011",
            file_type: "FLAC"
          },
          {
            path: "foo4.flac",
            artist: "The Foo",
            album: "The Compilation",
            duration: 131,
            genre: "Foo Rock",
            title: "Foot",
            track: "2",
            year: "2011",
            file_type: "FLAC"
          }
        ],
        settings: {
          compilationArtists: true
        }
      },
      {
        label: "selects files for compilation album only for the artist",

        expected: [
          {
            path: "foo4.flac",
            artist: "The Foo",
            album: "The Compilation",
            duration: 131,
            genre: "Foo Rock",
            title: "Foot",
            track: "2",
            year: "2011",
            file_type: "FLAC"
          }
        ],
        settings: {
          compilationArtists: false
        }
      },
      {
        label: "selects files for blank album; all artists",

        expected: [
          {
            path: "baz4.flac",
            artist: "Bazzler",
            album: "",
            duration: 133,
            genre: "Baz Baz",
            title: "Bazlishli",
            track: "1",
            year: "2000",
            file_type: "FLAC"
          },
          {
            path: "foo5.flac",
            artist: "The Foo",
            album: "",
            duration: 134,
            genre: "Foo Rock",
            title: "Footl",
            track: "2",
            year: "2000",
            file_type: "FLAC"
          }
        ],
        settings: {
          compilationArtists: false
        }
      }
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
          path: "foo5.flac",
          artist: "The Foo",
          album: "",
          duration: 134,
          genre: "Foo Rock",
          title: "Footl",
          track: "2",
          year: "2000",
          file_type: "FLAC"
        }
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
        value: { artist: "fooartist" }
      });

      sut.set("genre", <CategoryData>{ genre: "genrefoobar" });

      expect(sut.last).to.deep.equal({
        category: "genre",
        value: { genre: "genrefoobar" }
      });
    });
  });
});

const getSettings = (settings: Record<string, unknown>) => <Settings>(<unknown>{
    has: (key: string) => !!settings[key]
  });
