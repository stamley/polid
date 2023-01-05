<template>
    <div class="controls">
        <div class="controls-text" v-if="active">
            <p>	<!--Left--><i>&#x2190;</i> OR <!--Right--><i>&#x2192;</i> = CHANGE ACTIVE INSTRUMENT</p> 
            <p>SHIFT + <i>&#x2190;</i> OR <i>&#x2192;</i> = CHANGE BPM</p>
            <p>ENTER = ADD INSTRUMENT</p>
            <p>BACKSPACE = REMOVE INSTRUMENT</p>
            <p>	<!--Up--><i>&#x2191;</i> OR <!--down--><i>&#x2193;</i> = CHANGE NR OF STEPS</p>
            <p>SHIFT + <i>&#x2191;</i> OR <i>&#x2193;</i> = INCREASES OR DECREASES PULSES</p>
            <p>CTRL + <i>&#x2191;</i> OR <i>&#x2193;</i> = CHANGE OFFSET</p>
            <p>SPACE = START SEQUENCE</p>      
        </div>
    </div>
    <p class="show-text" @click="() => { active = !active }">show controls</p>
</template>
<style>
.controls {
    position: absolute;
    left: 2%;
    top: 34%;
    z-index: 100;
    width: 24%;
    height: 40%;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.7vh;
    font-weight: bold;
}
.show-text {
    text-decoration: underline1;
    bottom: 2%;
    left: 2%;
    position: absolute;
}
p {
    color: rgb(0, 240, 0)
}
i {
    font-size: 3.4vh;
}
</style>
<script>
export default {
    name: "Controls-View",
    data() {
        return { active: false }
    },
}
</script>