class Player {

    constructor(elem = null) {
        this.audio = new Audio();
        this.playing = false;
        this.playlist = [];

        this.audio.addEventListener('pause', () => {
            this.pause();
        });

        this.audio.addEventListener('play', () => {
            this.play();
        });
    }

    load(path) {
        this.audio.src = path;
    }

    play(path = null) {
        if (path) {
            this.load(path);
        }

        this.audio.play();
        this.playing = true;
    }

    pause() {
        this.audio.pause();
        this.playing = false;
    }

    toggle(path) {
        if (this.path !== path) {
            this.register(path);
            return this.play();
        }

        this.playing ? this.pause() : this.play();
    }

    setPlaylist() {

    }
}

export default Player;
