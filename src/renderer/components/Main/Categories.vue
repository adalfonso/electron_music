<template>
    <section id="categories">
        <div class="category">
            <h5>Artists</h5>
            <div class="items">
                <div v-for="artist in artists" class="item"
                    @click="selectArtist(artist)">
                    {{ artist }}
                </div>
            </div>
        </div>
        <div class="category">
            <h5>Albums</h5>
            <div class="items">
                <div v-for="album in albums" class="item"
                    @click="selectAlbum(album)">
                    {{ album }}
                </div>
            </div>
        </div>
        <div class="category">
            <h5>Genres</h5>
            <div class="items">
                <div v-for="genre in genres" class="item"
                    @click="selectGenre(genre)">
                    {{ genre }}
                </div>
            </div>
        </div>
        <div class="category">
            <h5>Media</h5>
            <div class="items">
                <div v-for="genre in genres" class="item"
                    @click="selectGenre(genre)">
                    {{ genre }}
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                categories: ['Artists', 'Albums', 'Genres', 'Media'],
                songs: [],

                selected: {
                    artist: null
                }
            }
        },

        mounted() {
            setTimeout(() => {
                this.$db.library.find({}, (err, docs) => this.songs = docs);
            }, 100);
        },

        computed: {
            artists() {
                return  [...new Set(this.songs.map(song => song.artist))];
            },

            albums() {
                let albums = this.selected.artist
                    ? this.songs.filter(song => song.artist === this.selected.artist)
                    : this.songs;

                return  [...new Set(albums.map(song => song.album))]
                    .filter(album => album)
                    .sort();
            },

            genres() {
                return  [...new Set(this.songs.map(song => song.genre))];
            }
        },

        methods: {
            play(song) {
                this.$emit('play', song);
            },

            selectArtist(artist) {
                this.selected.artist = artist;
            },

            selectAlbum(album) {
                this.$emit('playAlbum', this.songs.filter(song => song.album === album))
            }
        }
    }
</script>

<style lang="scss">
    #categories {
        border-bottom: 6px solid $dark-blue-hover;
        display: flex;
        justify-content: space-around;

        .category {
            background: $dark-blue-hover;
            width: 25%;

            h5 {
                color: $med-blue-hover;
                font-size: 1rem;
                font-weight: 400;
                margin: .5rem;
                text-align: center;
            }

            .items {
                background: $dark-blue;
                color: $light-blue;
                max-height: 300px;
                overflow: auto;
                width: 100%;

                .item {
                    border-bottom:1px solid $dark-blue;
                    padding: .2rem .5rem;

                    &:hover {
                        background: $dark-blue-hover;
                    }

                    &:last-of-type {
                        border-bottom: none;
                    }
                }
            }
        }
    }
</style>
