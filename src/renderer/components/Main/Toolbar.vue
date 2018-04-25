<template>
    <section id="toolbar">
        <template v-show="nowPlaying">
            <h2 class="now-playing">
                <template v-if="nowPlaying">
                    {{ nowPlaying.artist }} - {{ nowPlaying.title }}
                </template>
                <template v-else>N / A</template>
            </h2>

            <seekbar :player="player"></seekbar>

            <div class="play-control" @click="player.audio.src ? player.toggle() : null">
                <div v-if="player.playing" class="pause">
                    <div></div><div></div>
                </div>
                <div v-else class="play"></div>
            </div>
        </template>
    </section>
</template>

<script>

import Player from '@/../main/lib/player.js';
import seekbar from './Toolbar/Seekbar.vue';

export default {
    components : { seekbar },
        props: {
            playlist: {
                default: {
                    type: 'none',
                    songs: []
                }
            }
        },

        data() {
            return { player: new Player }
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
            }
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
            max-height: 1.5rem;
            text-align: center;
            user-select: none;
        }

        .player { display: none; }

        .play-control {
            align-items: center;
            background: $med-blue;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            height: 4rem;
            justify-content: center;
            margin-top: 1rem;
            width: 4rem;

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
                    height: 2rem;
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
