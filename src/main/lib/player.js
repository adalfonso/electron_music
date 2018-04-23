class Player {

    constructor(elem = null) {
        this.audio = new Audio();
        this.playing = false;
        this.currentTime = 0;
        this.duration = 0;
        this.ended = false;

        this.audio.addEventListener('pause', () => {
            this.pause();
        });

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
}

export default Player;
