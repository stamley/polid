<template>
    <button class="play-button" id="play-button" @click="sequenceActivated">PLAY</button>
</template>
<script>
export default {
    name: "Play-View",
    props: ["polid"],
    methods: {
        sequenceActivated(){
            this.polid.startPlaying();
            this.polid.addInstrument(this.polid.createInstrument("clav", 6, 2))
        }
    }
}
</script>