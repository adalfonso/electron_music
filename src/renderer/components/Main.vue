<template>
    <div id="wrap">
        <fileMenu :settings="settings">
        </fileMenu>

        <categories
            :player="player"
            :settings="settings">
        </categories>

        <playlist :player="player">
        </playlist>

        <toolbar :player="player">
        </toolbar>
    </div>
</template>

<script>

import fileMenu from './Main/FileMenu.vue';
import categories from './Main/Categories.vue';
import playlist from './Main/Playlist.vue';
import toolbar from './Main/Toolbar.vue';
import Player from '@/../main/lib/Player.js';
import Settings from '@/../main/lib/Settings.js';

export default {
    components : { fileMenu, categories, playlist, toolbar },

    data() {
        return {
            player: new Player(),
            settings: new Settings()
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
