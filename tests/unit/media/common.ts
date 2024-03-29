import { MediaDocument } from "@/media/Media";

export const getFiles = (): MediaDocument[] => [
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
    _id: "2",
    path: "bar.flac",
    artist: "The Bar",
    album: "Bar-ing Around",
    duration: 125,
    genre: "Foo Rock",
    title: "Barbie Girl",
    track: "1",
    year: "2005",
    file_type: "MP3",
  },
  {
    _id: "3",
    path: "boz.flac",
    artist: "Bozzy",
    album: "Booze",
    duration: 126,
    genre: "BotBoz",
    title: "Bonzon",
    track: "1",
    year: "2021",
    file_type: "M4A",
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
];
