<template>
    <section id="toolbar">
        <audio controls ref="player"
            style="width: 100%">
            <source :src="filePath" type="audio/flac">
        </audio>

        <h2 class="now-playing"
            v-if="nowPlaying">
            {{ nowPlaying.artist }} - {{ nowPlaying.title }}
        </h2>
    </section>
</template>

<script>
    export default {
        props: {
            playlist: {
                default: {
                    type: 'none',
                    songs: []
                }
            }
        },

        data() {
            return {
            }
        },

        watch: {
            playlist() {
                if (!this.playlist) {
                    return;
                }

                this.play();

            },

            playlistIndex() {
                this.play();
            }
        },

        computed: {
            filePath() {
                if (!this.playlist.songs.length || !this.playlist.songs[this.playlist.index]) {
                    return null;
                }

                return 'file://' + this.playlist.songs[this.playlist.index].path;
            },

            nowPlaying() {
                return this.playlist.songs[this.playlist.index];
            },

            playlistIndex() {
                return this.playlist.index;
            }
        },

        methods: {
            play() {
                setTimeout(() => {
                    this.$refs.player.load();
                    this.$refs.player.play();
                }, 20);
            }
        }
    }
</script>

<style lang="scss">
    #toolbar {
        background: $dark-blue;
        border-top: 6px solid $dark-blue-hover;
        height: 150px;

        .now-playing {
            color: $light-blue;
            text-align: center;
        }
    }
</style>
