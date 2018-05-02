import Playlist from "./Playlist.js";

class Player {

    constructor(playlist = []) {
        this.audio = new Audio();
        this.playing = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 1;
        this.playlist = new Playlist (playlist);

        this.audio.addEventListener('play', () => {
            this.playing = true;
            this.duration = this.audio.duration;
        });

        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime;
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
        });

        this.audio.addEventListener('ended', () => {
            this.playing = false;
            this.next();
        });
    }

    goTo(percent) {
        this.audio.currentTime = percent * this.duration;
        this.currentTime = this.audio.currentTime;
    }

    load(path, audio = this.audio) {
        if (this.playing) {
            this.pause();
        }

        audio.src = path;

        return this;
    }

    play(path = null) {
        if (path) {
            this.load(path);
        }

        return this.audio.play();
    }

    changeIndex(index = 0) {
        this.playlist.change(index);
        return this.play(this.playlist.currentFile());
    }

    changePlaylist(list, play = false) {
        if (play) {
            this.playlist.state = 'playlist';
            this.playlist.list = list;
            this.playlist.index = 0;
            this.play(this.playlist.currentFile());
        } else {
            this.playlist.state = 'browsing';
            this.playlist.browsing = list;
        }
    }

    pause() {
        this.audio.pause();
        this.playing = false;

        return this;
    }

    toggle(path) {
        if (this.path !== path) {
            this.register(path);
            return this.play();
        }

        if (!this.audio.src) {
            return;
        }

        return this.playing ? this.pause() : this.play();
    }

    previous() {
        if (this.playlist.hasPrevious()) {
            this.playlist.previous();
            this.play(this.playlist.currentFile());
        }
    }

    next() {
        if (this.playlist.hasNext()) {
            this.playlist.next();
            this.play(this.playlist.currentFile());
        }
    }

    adjustVolume(volume = 1) {
        volume = Math.min(1, Math.max(0, volume));
        this.audio.volume = volume;
        this.volume = volume;
    }
}

export default Player;
