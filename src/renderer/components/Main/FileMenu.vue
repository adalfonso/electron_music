<template>
    <section id="file-menu">
        <div v-for="group in groups" class="menu-item"
        @click="browse">
            {{ group.name }}
        </div>

        <file-browser
            v-if="browsing"
            @hide="browsing = false">
        </file-browser>
    </section>
</template>

<script>
    import fileBrowser from './FileMenu/FileBrowser.vue';

    export default {
        components : {
            fileBrowser
        },

        data() {
            return {
                browsing: false,

                groups: [
                    {
                        name: 'Library'
                    }
                ]
            }
        },

        methods: {
            browse() {
                this.browsing = true;
            }
        }
    }
</script>

<style lang="scss">
    #file-menu {
        background: $dark-blue;
        color: #fff;
        display: flex;
        font-weight: 300;
        height: 2rem;
        min-height: 2rem;
        flex: 0 0 auto;

        .menu-item {
            line-height: 1rem;
            padding: .5rem;
            transition: .2s;

            &:hover {
                background: $med-blue;
                color: $light-blue;
            }
        }
    }
</style>
