<template>
    <section id="toolbar">
        <div class="seek" v-if="nowPlaying" :style="seekStyle"></div>
        <h2 class="now-playing" v-if="nowPlaying">
            {{ nowPlaying.artist }} - {{ nowPlaying.title }}
        </h2>

        <div class="play-control" @click="player.toggle()">
            <div v-if="player.playing" class="pause">
                <div></div><div></div>
            </div>
            <div v-else class="play"></div>
        </div>

    </section>
</template>

<script>

import Player from '@/../main/lib/player.js';

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
                player: new Player
            }
        },

        watch: {
            ended() {
                if (this.ended) {
                    this.player.ended = false;
                    this.$emit('next');
                }
            },

            playlist() {
                if (!this.playlist) {
                    return;
                }

                this.player.play(this.filePath);

            },

            playlistIndex() {
                this.player.play(this.filePath);
            },
        },

        computed: {
            ended() {
                return this.player.ended;
            },

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
            },

            seekStyle() {
                let percent = this.player.currentTime / this.player.duration * 100;
                let style = 'left: calc(' + percent + '% - 1rem);';

                return !percent ? style : style + 'transition: 1s;';
            }
        }
    }
</script>

<style lang="scss">
    #toolbar {
        background: $dark-blue;
        border-top: 6px solid $dark-blue-hover;
        height: 150px;
        min-height: 150px;
        position: relative;
        align-items: center;
        display: flex;
        flex-direction: column;

        .now-playing {
            color: $light-blue;
            margin: .5rem 0 0 0;
            text-align: center;
        }

        .player { display: none; }

        .play-control {
            align-items: center;
            background: $med-blue;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            height: 5rem;
            justify-content: center;
            margin-top: .75rem;
            width: 5rem;

            .play {
                border-bottom: 1rem solid transparent;
                border-left: 1.5rem solid $dark-blue;
                border-top: 1rem solid transparent;
                height: 0;
                margin-left: .25rem;
                width: 0;
            }

            .pause {
                display: flex;

                div {
                    background: $dark-blue;
                    height: 2.25rem;
                    margin: .25rem;
                    width: .5rem;
                }
            }

            &:hover {
                background: $med-blue-hover;
                transition: .2s;

                .play { border-left-color: $dark-blue-hover; }
                .pause div { background: $dark-blue-hover; }
            }
        }

        .seek {
            background: $light-blue;
            height: 1rem;
            width: 1rem;
            border-radius: 50%;
            position: absolute;
            left: 0;
            top: calc(-.5rem - 3px);
        }
    }
</style>
