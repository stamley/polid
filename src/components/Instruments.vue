<template>
    <span class="instruments">
        <div v-for="instr in this.polid.instruments" :key="instr.id">
            <h2>{{instr.steps}} </h2><h2> {{instr.pulses}}</h2><h3 id="pattern">0</h3>
        </div>
    </span>
</template>
<script>
export default {
    name: "Instrument-View",
    props: ["polid"],
    methods: {
        addInstrument(){
            this.polid.addInstrument(this.polid.createInstrument("kick"));
        },
    },
    mounted(){
        //this.addInstrument();
    }
}
</script>