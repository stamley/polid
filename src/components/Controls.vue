<template>
    <div class="controls">
        <div class="controls-text" v-if="active">
            <p>	<!--Left--><i>&#x2190;</i> OR <!--Right--><i>&#x2192;</i> = CHANGE ACTIVE INSTRUMENT</p> 
            <p>SHIFT + <i>&#x2190;</i> OR <i>&#x2192;</i> = CHANGE BPM</p>
            <p>ENTER = ADD INSTRUMENT</p>
            <p>BACKSPACE = REMOVE INSTRUMENT</p>
            <p>	<!--Up--><i>&#x2191;</i> OR <!--down--><i>&#x2193;</i> = CHANGE NR OF STEPS</p>
            <p>SHIFT + <i>&#x2191;</i> OR <i>&#x2193;</i> = INCREASE OR DECREASE PULSES</p>
            <p>CTRL + <i>&#x2191;</i> OR <i>&#x2193;</i> = CHANGE OFFSET</p>
            <p>SPACE = START SEQUENCE</p>
            <p>M = CHANGE STEP MODIFIER</p>
            <p>R = RESET</p>      
        </div>
    </div>
    <p class="show-text" @click="() => { active = !active }"><a v-if="!active">show</a><a v-if="active">hide</a> controls</p>
    <div class="controls right">
        <div class="controls-text" v-if="activeInfo">
                <p>
                    BASED ON THE MATHEMATICAL CONCEPT BEHIND <a href="https://www.youtube.com/watch?v=OHS3lN6snrE">EUCLIDEAN RHYTHMS</a>,
                    YOU CAN CREATE <a href="https://en.wikipedia.org/wiki/Polyrhythm">POLYRHYTHMICAL</a> BEATS QUICKLY AND SMOOTHLY.
                    INSPIRED BY OTHER IMPLEMENTATION OF THE CONCEPT, BUT WITH
                    A DESIRE TO MAKE IT MORE RESPONSIVE ASWELL AS VISUALLY PLEASING.
                    HOPE YOU ENJOY.

                    MADE BY <a href="https://github.com/stamley">STAMLEY</a>
                </p>
        </div>
    </div>
    <p class="show-text info" @click="() => { activeInfo = !activeInfo }"><a v-if="!activeInfo">show</a><a v-if="activeInfo">hide</a> info</p>
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
    line-height: 80%;
}

.controls.right { 
    right: 10%;
    left: 78%;
    width: 15%;
    line-height: 130%;
}

.show-text {
    text-decoration: underline;
    bottom: 2%;
    left: 2%;
    position: absolute;
}
.show-text.info {
    left: 93%;
}

.show-text:hover{ color: white; }

p { color: rgb(0, 240, 0) }

i { font-size: 3.4vh; }

a { text-decoration: underline; }
</style>
<script>
export default {
    name: "Controls-View",
    data() {
        return { active: true, activeInfo: false }
    },
}
</script>