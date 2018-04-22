<template>
    <section id="toolbar">
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
            playlist() {
                if (!this.playlist) {
                    return;
                }

                this.player.play(this.filePath);

            },

            playlistIndex() {
                this.player.play(this.filePath);
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
        }
    }
</script>

<style lang="scss">
    #toolbar {
        background: $dark-blue;
        border-top: 6px solid $dark-blue-hover;
        height: 150px;
        min-height: 150px;
        align-items: center;
        display: flex;
        flex-direction: column;

        .now-playing {
            color: $light-blue;
            margin: .5rem 0 .75rem 0;
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
    }
</style>
