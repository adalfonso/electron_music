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
            <playbackControls :player="player"></playbackControls>

        </template>
    </section>
</template>

<script>

import Player from '@/../main/lib/player.js';
import playbackControls from './Toolbar/PlaybackControls.vue';
import seekbar from './Toolbar/Seekbar.vue';

export default {
    components : { playbackControls, seekbar },
        props: {
            playlist: {
                default: {
                    type: 'none',
                    songs: []
                }
            }
        },

        data() {
            return { player: new Player(this.playlist) }
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

                this.player.playlist = this.playlist;

                this.player.changeIndex().play();

            },

            playlistIndex(index) {
                if (!this.playlist.songs.length) {
                    return;
                }

                this.player.changeIndex(index).play();
            }
        },

        computed: {
            ended() {
                return this.player.ended;
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
    }
</style>
