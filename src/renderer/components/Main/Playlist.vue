<template>
    <section id="playlist">
        <table class="playlist">
            <tr>
                <th>Artist</th>
                <th>Album</th>
                <th>Title</th>
                <th>Track</th>
            </tr>
            <tr v-for="(song, index) in playlist.songs" @click="changePlaylistIndex(index)">
                <td>{{ song.artist }}</td>
                <td>{{ song.album }} ({{ song.year }})</td>
                <td>{{ song.title }}</td>
                <td>{{ song.track }}</td>
            </tr>
        </table>
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

        methods: {
            changePlaylistIndex(index) {
                this.$emit('changePlaylistIndex', index);
            }
        }
    }
</script>

<style lang="scss">
    #playlist {
        background: $dark-blue;
        flex: 1 1 auto;

        .playlist {
            color: $light-blue;
            text-align: left;
            width: 100%;

            td,th { padding:.2rem .5rem; }

            tr:hover td {
                background: $dark-blue-hover;
            }
        }
    }
</style>
