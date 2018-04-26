class Player {

    constructor(playlist = null) {
        this.audio = new Audio();
        this.playing = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 1;
        this.ended = false;
        this.playlist = playlist;

        this.audio.addEventListener('play', () => {
            this.play();
            this.ended = false;
            this.duration = this.audio.duration;
        });

        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime;
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
        });

        this.audio.addEventListener('ended', () => {
            this.ended = true;
        });
    }

    goTo(percent) {
        this.audio.currentTime = percent * this.duration;
        this.currentTime = this.audio.currentTime;
    }

    load(path) {
        if (this.playing) {
            this.pause();
        }

        this.audio.src = path;

        return this;
    }

    reload() {
        return this.load(this.filePath());
    }

    play(path = null) {
        if (path) {
            this.load(path);
        }

        this.playing = true;

        return this.audio.play();
    }

    changeIndex(index = 0) {
        if (index >= this.playlist.songs.length) {
            return;
        }

        this.playlist.index = index;
        return this.reload();
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
        if (!this.playlist.songs.length) {
            return;
        }

        let index = this.playlist.index;

        this.playlist.index = index - 1 < 0 ? this.playlist.songs.length - 1 : index - 1;
    }

    next() {
        if (!this.playlist.songs.length) {
            return;
        }

        let index = this.playlist.index;

        this.playlist.index = index + 1 >= this.playlist.songs.length ? 0 : index + 1;
    }

    adjustVolume(volume = 1) {
        volume = Math.min(1, Math.max(0, volume));
        this.audio.volume = volume;
        this.volume = volume;
    }

    filePath() {
        let playlistIsEmpty = !this.playlist.songs.length;
        let songIsMissing = !this.playlist.songs[this.playlist.index];

        if (playlistIsEmpty || songIsMissing) {
            return null;
        }

        return 'file://' + this.playlist.songs[this.playlist.index].path;
    }

}

export default Player;
