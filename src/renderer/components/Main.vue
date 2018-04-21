<template>
    <div id="wrap">
        <fileMenu></fileMenu>

        <categories @play="play"
            @playAlbum="playAlbum">
        </categories>

        <playlist
            :playlist="playlist"
            @changePlaylistIndex="changePlaylistIndex">
        </playlist>

        <toolbar :playlist="playlist"></toolbar>
    </div>
</template>

<script>

import fileMenu from './Main/FileMenu.vue';
import categories from './Main/Categories.vue';
import playlist from './Main/Playlist.vue';
import toolbar from './Main/Toolbar.vue';

    export default {
        components : {
            fileMenu, categories, playlist, toolbar
        },

        data() {
            return {
                playlist: {
                    type: 'none',
                    songs: [],
                    index: 0
                }
            }
        },

        methods: {
            changePlaylistIndex(index) {
                this.playlist.index = index;
            },

            play(song) {
                this.playlist = {
                    type: 'song',
                    songs: [song],
                    index: 0
                };
            },

            playAlbum(songs) {
                this.playlist = {
                    type: 'album',
                    songs: songs,
                    index: 0
                };
            }
        }
    }
</script>

<style lang="scss">
    #wrap {
        align-items: stretch;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>
