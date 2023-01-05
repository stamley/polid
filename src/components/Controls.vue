<template>
    <div class="controls">
        <div class="controls-text">
            <p>&lt; OR > = CHANGE ACTIVE INSTRUMENT</p> 
            <p>SHIFT + &lt; OR > = CHANGE BPM</p>
            <p>ENTER = ADD INSTRUMENT</p>
            <p>BACKSPACE = REMOVE INSTRUMENT</p>
            <p><i>&#xf062;</i> OR v = CHANGE NR OF STEPS</p>
            <p>SHIFT + ^ OR v = INCREASES OR DECREASES PULSES</p>
            <p>CTRL + ^ OR v = CHANGE OFFSET</p>
            <p>SPACE = START SEQUENCE</p>      
        </div>
    </div>
</template>
<style>
.controls {
    position: absolute;
    left: 2%;
    top: 40%;
    z-index: 100;
}
.controls-text {
   font-family: 'Courier New', Courier, monospace;
}
p {
    color: rgb(0, 240, 0)
}
</style>
<script>
export default {
    name: "Controls-View",
}
</script>