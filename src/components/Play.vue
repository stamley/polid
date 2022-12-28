<template>
    <button class="play-button" id="play-button" @click="sequenceActivated">PLAY</button>
    <button class="add" id="add-button" @click="addInstr">ADD</button>
</template>
<script>
export default {
    name: "Play-View",
    props: ["polid"],
    methods: {
        sequenceActivated(){
            this.polid.startPlaying();
        },
        addInstr(){
            this.polid.addInstrument(this.polid.createInstrument("clav", 6, 2));
        }
    }
}
</script>