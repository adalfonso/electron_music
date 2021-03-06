class Playlist {
  constructor(list = [], state = "playlist") {
    this.index = 0;
    this.list = list;
    this.browsing = [];
    this.state = state;
  }

  songs() {
    return this.state === "browsing" ? this.browsing : this.list;
  }

  hasPrevious() {
    return this.index - 1 >= 0;
  }

  hasNext() {
    return this.index + 1 < this.list.length;
  }

  change(index) {
    if (this.state === "browsing") {
      this.list = this.browsing;
    }

    this.index = index;
  }

  previous() {
    this.index--;
  }

  next() {
    this.index++;
  }

  previousFile() {
    if (!this.hasPrevious()) {
      return null;
    }

    return "file://" + this.list[this.index - 1].path;
  }

  nowPlaying() {
    return this.list[this.index];
  }

  currentFile() {
    return "file://" + this.nowPlaying().path;
  }

  nextFile() {
    if (!this.hasNext()) {
      return null;
    }

    return "file://" + this.list[this.index + 1].path;
  }
}

export default Playlist;
