<template>
    <section id="playlist">
        <section class="options">
            <div class="ui-button-set capitalize">
                <div v-for="s in states"
                    :class="s === state ? 'selected' : ''"
                    @click="changeState(s)">
                    {{ s }}
                </div>
            </div>
        </section>
        <div class="playlist-wrap">
            <table class="playlist">
                <tr>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Year</th>
                    <th>Title</th>
                    <th>Track</th>
                </tr>
                <tr v-for="(song, index) in songs"
                    :class="indexClass(index)"
                    @click="player.changeIndex(index)">
                    <td>{{ song.artist }}</td>
                    <td>{{ song.album }}</td>
                    <td>{{ song.year }}</td>
                    <td>
                        {{ song.title.substring(0, 50).trim() }}
                        {{ song.title.length > 50 ? '...' : '' }}
                    </td>
                    <td>{{ song.track }}</td>
                </tr>
            </table>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            player: { required: true }
        },

        data() {
            return {
                states: ['browsing', 'playlist']
            };
        },

        computed: {
            songs() {
                return this.state === 'browsing'
                    ? this.player.playlist.browsing
                    : this.player.playlist.list;
            },

            state () {
                return this.player.playlist.state;
            },

            playlist() {
                return this.player.playlist;
            }
        },

        methods: {
            changeState(state) {
                this.player.playlist.state = state;
            },

            indexClass(index) {
                return this.playlist.state === 'playlist' &&
                    index === this.playlist.index
                        ? 'selected' : ''
            }
        }
    }
</script>

<style lang="scss">
    #playlist {
        background: $dark-blue;
        position: relative;
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;

        .options {
            border-bottom: 6px solid $dark-blue-hover;
            padding: .5rem;
            flex: 0 0 auto;
            user-select: none;
        }

        .playlist-wrap {
            flex: 1 1 auto;
            overflow: auto;
        }

        .playlist {
            color: $light-blue;
            text-align: left;
            width: 100%;

            td, th { padding:.2rem .5rem; }

            tr {
                cursor: pointer;
                user-select: none;

                &:hover, &.selected {
                    td { background: $dark-blue-hover; }
                }
            }
        }
    }
</style>
