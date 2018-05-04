<template>
    <div class="category">
        <h5>{{ title }}</h5>
        <div class="items" :id="'category-' + type">
            <div v-if="cat.hasDefault"
                class="item" @click="reset">
                [All {{ cat.title }} - {{ cat.list.length}}]
            </div>
            <div v-for="item in cat.list"
                :class="isSelected(item) ? 'item selected' : 'item'"
                :id="type + '-' + cat.display(item).replace(/\s/g, '_')"
                @click="select(item)"
                @dblclick="select(item, true)">
                {{ cat.display(item) }}
            </div>
        </div>
    </div>
</template>

<script>

import moment from 'moment';

export default {
    props: {
        type: { required: true },
        cat: { required: true },
        selected: { required: true }
    },

    data() {
        return {
            goToTracker: {
                at: moment(),
                input: ''
            }
        }
    },

    created() {
        window.addEventListener('keyup', event => {
            if (!this.active) {
                return;
            }

            switch(event.key) {
                case 'ArrowUp': return this.traverseCategory('previous');
                case 'ArrowDown': return this.traverseCategory('next');
                case 'Enter': return this.enterKeySelect();
                default: this.goToSearch(event);
            }
        });
    },

    computed: {
        active() {
            return this.selected.last === this.type;
        },

        title() {
            return this.type.charAt(0).toUpperCase() +
                this.type.slice(1) + 's';
        }
    },

    methods: {
        enterKeySelect() {
            this.select(this.selected[this.type] , true);
        },

        select(item, play) {
            this.$emit('select', this.type, item, play);
        },

        isSelected(item) {
            return this.selected[this.type] === item;
        },

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

            let items = this.cat.list
                .filter(item => regex.test(isAlbum ? item.album : item));

            if (!items.length) {
                return;
            }

            let item = items[0];
            let name =  isAlbum ? item.album : item;

            this.selected[type] = name;

            location.hash = `#${type}-${name.replace(/\s/g, '_')}`;
            this.select(item);
        },

        reset() {
            this.$emit('reset');
        },

        traverseCategory(direction) {
            let item = this.selected[this.type];

            let index = this.cat.list
                .map((_item, i) => _item === item ? i : null)
                .filter(item => item !== null)[0];

            let list = this.cat.list;

            if (direction === 'previous' && index > 0) {
                item = list[index - 1];
            } else if (direction === 'next' && index < list.length - 1) {
                item = list[index + 1];
            }

            let display = this.cat.display(item);

            location.hash = `#${this.type}-${display.replace(/\s/g, '_')}`;
            this.select(item);
        }
    }
}
</script>

<style lang="scss">

</style>
