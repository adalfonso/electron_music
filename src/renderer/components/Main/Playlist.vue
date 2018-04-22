<template>
    <section id="playlist">
        <section class="options">
            <div class="ui-button-set capitalize">
                <div v-for="stateOption in states"
                    :class="stateOption === state ? 'selected' : ''"
                    @click="changeState(stateOption)">
                    {{ stateOption }}
                </div>
            </div>
        </section>
        <table class="playlist">
            <tr>
                <th>Artist</th>
                <th>Album</th>
                <th>Title</th>
                <th>Track</th>
            </tr>
            <tr v-for="(song, index) in songs"
                @click="changePlaylistIndex(index)">
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
                default: { type: 'none', songs: [] }
            },

            browsing: { default: [] },

            state: { default: 'browsing' }
        },

        data() {
            return {
                states: ['browsing', 'playlist']
            };
        },

        computed: {
            songs() {
                return this[this.state].songs;
            }
        },

        methods: {
            changePlaylistIndex(index) {
                this.$emit('changePlaylistIndex', index);
            },

            changeState(state) {
                if (state !== this.state) {
                    this.$emit('changeState', state);
                }
            }
        }
    }
</script>

<style lang="scss">
    #playlist {
        background: $dark-blue;
        flex: 1 1 auto;

        .options {
            padding: .5rem;
        }

        .playlist {
            color: $light-blue;
            text-align: left;
            width: 100%;

            td, th { padding:.2rem .5rem; }
            tr { cursor: pointer; }

            tr:hover td {
                background: $dark-blue-hover;
            }
        }
    }
</style>
