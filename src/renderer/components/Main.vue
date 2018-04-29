<template>
    <div id="wrap">
        <fileMenu></fileMenu>

        <categories @play="play"
            @playAlbum="playAlbum"
            @playArtist="playArtist"
            @playGenre="playGenre">
        </categories>

        <playlist
            :playlist="playlist"
            :browsing="browsing"
            :state="playlistState"
            @changePlaylistIndex="changePlaylistIndex"
            @changeState="changePlaylistState">
        </playlist>

        <toolbar :playlist="playlist"
            @next="playNextTrack">
        </toolbar>
    </div>
</template>

<script>

import fileMenu from './Main/FileMenu.vue';
import categories from './Main/Categories.vue';
import playlist from './Main/Playlist.vue';
import toolbar from './Main/Toolbar.vue';

export default {
    components : { fileMenu, categories, playlist, toolbar },

    data() {
        return {
            browsing: {
                type: 'none',
                songs: []
            },

            playlist: {
                type: 'none',
                songs: [],
                index: 0
            },

            playlistState: 'browsing'
        }
    },

    methods: {
        changePlaylistIndex(index) {
            if (this.playlistState === 'browsing') {
                this.playlistState = 'playlist';
                this.playlist.type = this.browsing.type;
                this.playlist.songs = this.browsing.songs;
                return this.playlist.index = index;
            }

            this.playlist.index = index;
        },

        changePlaylistState(state) {
            this.playlistState = state;
        },

        play(song) {
            this.playlistState = 'playlist';
            this.playlist = {
                type: 'song',
                songs: [song],
                index: 0
            };
        },

        playAlbum(songs, play) {
            if (play) {
                this.playlistState = 'playlist';

                return this.playlist = {
                    type: 'album',
                    songs: songs,
                    index: 0
                };
            }

            this.playlistState = 'browsing';

            this.browsing = {
                type: 'album',
                songs: songs
            };
        },

        playArtist(songs, play) {
            if (play) {
                this.playlistState = 'playlist';

                return this.playlist = {
                    type: 'artist',
                    songs: songs,
                    index: 0
                };
            }

            this.playlistState = 'browsing';

            this.browsing = {
                type: 'artist',
                songs: songs
            };
        },

        playGenre(songs) {
            this.playlistState = 'browsing';

            this.browsing = {
                type: 'genre',
                songs: songs
            };
        },

        playNextTrack() {
            let pl = this.playlist;

            if (pl.index + 1  < pl.songs.length) {
                pl.index++;
            }
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
