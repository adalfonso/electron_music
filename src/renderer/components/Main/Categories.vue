<template>
    <section id="categories">
        <div class="category">
            <h5>Artists</h5>
            <div class="items" id="category-artist">
                <div class="item" @click="selected.artist = null">
                    [All Artists - {{artists.length}}]
                </div>
                <div v-for="artist in artists"
                    :class="selected.artist === artist ? 'item selected' : 'item'"
                    :id="'artist-' + artist.replace(/\s/g, '_')"
                    @click="selectArtist(artist)"
                    @dblclick="selectArtist(artist, true)">
                    {{ artist }}
                </div>
            </div>
        </div>        <div class="category">
            <h5>Albums</h5>
            <div class="items" id="category-album">
                <div v-for="album in albums"
                    :class="selected.album && selected.album.album === album.album ? 'item selected' : 'item'"
                    :id="'album-' + album.album.replace(/\s/g, '_')"
                    @click="selectAlbum(album)"
                    @dblclick="selectAlbum(album, true)">
                    {{ album.album === '' ? '[Unknown Album]' : album.album }}
                    <b class="stat" v-if="album.year && album.album">[{{ album.year }}]</b>
                </div>
            </div>
        </div>
        <div class="category">
            <h5>Genres</h5>
            <div class="items" id="category-genre">
                <div v-for="genre in genres"
                    :class="selected.genre === genre ? 'item selected' : 'item'"
                    :id="'genre-' + genre.replace(/\s/g, '_')"
                    @click="selectGenre(genre)"
                    @dblclick="selectGenre(genre, true)">
                    {{ genre }}
                </div>
            </div>
        </div>
        <div class="category">
            <h5>Media</h5>
            <div class="items" id="category-media">
                <div v-for="medium in media" class="item">
                    {{ medium.type }}
                    <b class="stat">[{{ medium.percent }}%]</b>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

import Collection from '@/../main/lib/Collection.js';
import moment from 'moment';

    export default {
        data() {
            return {
                categories: ['Artists', 'Albums', 'Genres', 'Media'],
                songs: [],

                selected: {
                    artist: null,
                    album: null,
                    genre: null,
                    last: null
                },

                goToTracker: {
                    at: moment(),
                    input: ''
                }
            }
        },

        created() {
            window.addEventListener('keyup', event => {
                switch(event.key) {
                    case 'ArrowUp': return this.traverseCategory('previous');
                    case 'ArrowDown': return this.traverseCategory('next');
                    case 'Enter': return this.select();
                    default: this.goToSearch(event);
                }
            });
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
                    .filter(genre => genre)
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
            },

            selectMethod() {
                let str = this.selected.last;

                return this['select' + str.charAt(0).toUpperCase() + str.slice(1)];
            }
        },

        methods: {
            goToSearch(event) {
                let now = moment();
                this.goToTracker.at.add(1000, 'milliseconds')

                let newSearch = this.goToTracker.at.isBefore(now);

                this.goToTracker.input = newSearch
                    ? event.key
                    : this.goToTracker.input + event.key;

                this.goToTracker.at = now;
                this.goTo();
            },

            goTo() {
                let type = this.selected.last
                let regex = new RegExp('^' + this.goToTracker.input, 'i');
                let isAlbum = type === 'album';

                let items = this[type+ 's']
                    .filter(item => regex.test(isAlbum ? item.album : item));

                if (!items.length) {
                    return;
                }

                let item = items[0];
                let name =  isAlbum ? item.album : item;

                this.selected[type] = name;

                location.hash = `#${type}-${name.replace(/\s/g, '_')}`;
                this.selectMethod(item);
            },

            traverseCategory(direction) {
                let type = this.selected.last
                let item = this.selected[type];
                let data = this[type + 's'];

                if (!item) {
                    return;
                }

                let index = data
                    .map((_item, i) => _item === item ? i : null)
                    .filter(item => item !== null )[0];

                if (direction === 'previous') {
                    index > 0 ? this.selected[type] = data[index - 1] : null;
                } else {
                    index < data.length - 1 ? this.selected[type] = data[index + 1] : null;
                }

                item = this.selected[type];
                let name = this.type === 'album' ? item.album : item;

                location.hash = `#${type}-${name.replace(/\s/g, '_')}`;
                this.selectMethod(item);
            },

            select() {
                let item = this.selected[this.selected.last];
                if (!item) {
                    return;
                }

                this.selectMethod(item, true);
            },

            play(song) {
                this.$emit('play', song);
            },

            selectArtist(artist, play = false) {
                this.selected.artist = artist;
                this.selected.last = 'artist';

                let songs = this.$collect(this.songs)
                    .filter(song => song.artist === artist)
                    .sortBy(song => song.album + song.track)
                    .use();

                this.$emit('playCategory', 'artist', songs, play);
            },

            selectAlbum(album, play = false) {
                this.selected.album = album;
                this.selected.last = 'album';

                let songs = this.$collect(this.songs)
                    .filter(song => song.album === album.album && song.year === album.year)
                    .sortBy('track')
                    .use();

                this.$emit('playCategory', 'album', songs, play);
            },

            selectGenre(genre, play = false) {
                this.selected.genre = genre;
                this.selected.last = 'genre';

                let songs = this.$collect(this.songs)
                    .filter(song => song.genre === genre)
                    .sortBy(song => {
                        return song.artist.padEnd(40, '') +
                        song.album.padEnd(20, '') +
                        song.track.toString().padStart(3, '0');
                    })
                    .use();

                this.$emit('playCategory', 'genre', songs, play);
            }
        }
    }
</script>

<style lang="scss">
    #categories {
        border-bottom: 6px solid $dark-blue-hover;
        display: flex;
        justify-content: space-around;
        min-height: 300px;
        flex: 0 0 auto;

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
                overflow-y: scroll;
                width: 100%;

                .stat { margin-left: .25rem; }

                .item {
                    border-bottom:1px solid $dark-blue;
                    display: flex;
                    justify-content: space-between;
                    padding: .2rem .5rem;
                    user-select: none;

                    &:hover, &.selected {
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
