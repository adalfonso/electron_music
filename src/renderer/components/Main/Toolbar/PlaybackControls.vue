<template>
    <div id="play-control">
        <div class="previous" @click="player.previous()">
            <div></div>
            <div></div>
        </div>

        <div class="play-button" @click="player.toggle()">
            <div v-if="player.playing" class="pause">
                <div></div><div></div>
            </div>

            <div v-else class="play"></div>
        </div>

        <div class="next" @click="player.next()">
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        player: { required: true }
    }
}
</script>

<style lang="scss">
    #play-control {
        display: flex;
        align-items: center;
        margin-top: 1rem;

        .previous, .next {
            display: flex;

            div {
                border-bottom: 1rem solid transparent;
                border-top: 1rem solid transparent;
                height: 0;
                width: 0;
            }
        }

        .next {
            &:hover div { border-left: 1.5rem solid $med-blue-hover; }

            div {
                border-left: 1.5rem solid $med-blue;

                &:last-of-type { margin-left: -.75rem;}
            }
        }

        .previous {
            &:hover div { border-right: 1.5rem solid $med-blue-hover; }

            div {
                border-right: 1.5rem solid $med-blue;

                &:first-of-type { margin-right: -.75rem;}
            }
        }

        .play-button {
            align-items: center;
            background: $med-blue;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            height: 4rem;
            margin: 0 1rem;
            justify-content: center;
            width: 4rem;

            .play {
                border-bottom: 1rem solid transparent;
                border-left: 1.5rem solid $dark-blue;
                border-top: 1rem solid transparent;
                height: 0;
                margin-left: .25rem;
                width: 0;
            }

            .pause {
                display: flex;

                div {
                    background: $dark-blue;
                    height: 2rem;
                    margin: .25rem;
                    width: .5rem;
                }
            }

            &:hover {
                background: $med-blue-hover;
                transition: .2s;

                .play { border-left-color: $dark-blue-hover; }
                .pause div { background: $dark-blue-hover; }
            }
        }
    }
</style>
