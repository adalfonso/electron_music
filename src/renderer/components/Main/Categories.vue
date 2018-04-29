<template>
    <section id="categories">
        <div class="category">
            <h5>Artists</h5>
            <div class="items">
                <div v-for="artist in artists" class="item"
                    @click="selectArtist(artist)"
                    @dblclick="selectArtist(artist, true)">
                    {{ artist }}
                </div>
            </div>
        </div>
        <div class="category">
            <h5>Albums</h5>
            <div class="items">
                <div v-for="album in albums" class="item"
                    @click="selectAlbum(album.album)"
                    @dblclick="selectAlbum(album.album, true)">
                    {{ album.album === '' ? '[Unknown Album]' : album.album }}
                    <b class="stat" v-if="album.year && album.album">[{{ album.year }}]</b>
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
                <div v-for="medium in media" class="item"
                    @click="selectGenre(medium)">
                    {{ medium.type }}
                    <b class="stat">[{{ medium.percent }}%]</b>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

import Collection from '@/../main/lib/Collection.js';

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
            }, 0);
        },

        computed: {
            artists() {
                return new Collection(this.songs)
                    .unique('artist')
                    .map(song => song.artist)
                    .sort()
                    .use();
            },

            albums() {
                let albums = this.selected.artist
                    ? this.songs.filter(song => song.artist === this.selected.artist)
                    : this.songs;

                return new Collection(albums)
                    .unique('album')
                    .sortBy('album')
                    .use();
            },

            genres() {
                return new Collection(this.songs)
                    .unique('genre')
                    .map(song => song.genre)
                    .sort()
                    .use();
            },

            media() {
                let total = this.songs.length;

                return new Collection(this.songs)
                    .groupBy(song => song.path.match(/.([\w\d]+)$/)[1])
                    .map((group, key) => {
                        return {
                            type: key.toUpperCase(),
                            count: group.length,
                            percent: (group.length / total * 100).toFixed(2)
                        }
                    }).sortByDesc('count')
                    .use();
            }
        },

        methods: {
            play(song) {
                this.$emit('play', song);
            },

            selectArtist(artist, play = false) {
                this.selected.artist = artist;

                let songs = this.$collect(this.songs)
                    .filter(song => song.artist === artist)
                    .sortBy(song => song.album + song.track)
                    .use();

                this.$emit('playArtist', songs, play);
            },

            selectAlbum(album, play = false) {
                let songs = this.$collect(this.songs)
                    .filter(song => song.album === album)
                    .sortBy('track')
                    .use();

                this.$emit('playAlbum', songs, play);
            }
        }
    }
</script>

<style lang="scss">
    #categories {
        border-bottom: 6px solid $dark-blue-hover;
        display: flex;
        justify-content: space-around;
        min-height: 200px;

        .category {
            background: $dark-blue-hover;
            display: flex;
            flex-direction: column;
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
                cursor: pointer;
                color: $light-blue;

                height: 300px;
                overflow: auto;
                width: 100%;

                .stat { margin-left: .25rem; }

                .item {
                    border-bottom:1px solid $dark-blue;
                    display: flex;
                    justify-content: space-between;
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
