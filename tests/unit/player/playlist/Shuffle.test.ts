import { expect } from "chai";
import { shuffle as Sut } from "../../../../src/renderer/player/playlist/Shuffle";

describe("Shuffler", () => {
  describe("Shuffle", () => {
    it("shuffles a playlist", () => {
      const list = getList();
      const sut = Sut(list);

      expect(list.length).to.eq(sut.length);
      expect(list).to.not.deep.equal(sut);
    });
  });
});

const getList = () => [
  getDoc({ id: "0" }),
  getDoc({ id: "1" }),
  getDoc({ id: "2" }),
  getDoc({ id: "3" }),
  getDoc({ id: "4" }),
];

const getDoc = (props: Record<string, string>) => ({
  _id: props.id ?? "0",
  path: "foo.flac",
  artist: "The Foo",
  album: "",
  duration: 123,
  genre: "Foo Rock",
  title: "Foo",
  track: "1",
  year: "2000",
  file_type: "FLAC",
});
