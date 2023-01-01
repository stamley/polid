<template>
    <div class="p5Canvas" id="p5Canvas"></div>
</template>

<script>
import * as Tone from 'tone';

export default {
    name: "Circles-View",
    props: ["polid"],
    unmounted(){
        window.removeEventListener('keyup');
    },
    mounted(){
        window.addEventListener('keyup', (e) => {
            /*
                < or > = Change active instrument
                Shift + < or > = Change bpm
                Enter = Add instrument
                Backspace = Remove instrument
                ^ or v = Change nr of steps
                Shift + ^ or v = Increases or decrease pulses
                Ctrl + ^ or v = Change offset 
                Space = Start sequence            
            */
            if(e.shiftKey && e.key === 'ArrowLeft') this.polid.decreaseBpm(); 
            else if(e.key === 'ArrowLeft') this.polid.instrumentChangeLeft();
            if(e.shiftKey && e.key === 'ArrowRight')  this.polid.increaseBpm();
            else if(e.key === 'ArrowRight')  this.polid.instrumentChangeRight();
            if(e.key === 'Enter') this.polid.addInstrument();
            if(e.key === 'Backspace') this.polid.removeInstrument();
            if(e.shiftKey && e.key === 'ArrowUp') this.polid.increasePulses();
            else if(e.ctrlKey && e.key === 'ArrowUp') this.polid.increaseOffset();
            else if(e.key === 'ArrowUp') this.polid.increaseSteps();
            if(e.shiftKey && e.key === 'ArrowDown') this.polid.decreasePulses();
            else if(e.ctrlKey && e.key === 'ArrowDown') this.polid.decreaseOffset();
            else if(e.key === 'ArrowDown') this.polid.decreaseSteps();
            if(e.code === 'Space') this.polid.startPlaying();
            if(e.key === 'm') this.polid.reset();
        })

        const P5 = require("p5");
        let currentPolid = this.polid;

        new P5(circles());

        function circles(){
            return function(p5){
                let dotRadius = 7;
                /* let dotDistances = radiuses.map((radius, index) => {return radius / dotCounts[index];}); */
                
                p5.setup = () => {
                    let canvas = p5.createCanvas(window.innerWidth*0.95, window.innerHeight*0.93);
                    canvas.parent("p5Canvas");
                    p5.background(255);
                    p5.frameRate(60);
                };
                p5.draw = () => {
                    p5.background(255);
                    let dotCounts = currentPolid.canvasData.dotCounts;
                    let radiuses = currentPolid.canvasData.radiuses;
                    let colors = currentPolid.canvasData.colors;
                    // Drawing each circle for each instrument
                    currentPolid.instruments.forEach((instrument, i) => {
                        let active = 0;
                        if(currentPolid.activeInstrument === i) active = 40;
                        p5.fill(colors[i], 100, 100 + active);
                        p5.ellipse(p5.width/2, p5.height/2, radiuses[i]*2, radiuses[i]*2);
                        // Drawing dots for the each instrument
                        for (let j = 0; j < dotCounts[i]; j++) {
                            let angle = j * p5.TWO_PI / dotCounts[i]; // calculate angle for current dot
                            
                            // Other color for the current beat
                            if(j === (instrument.beat + (instrument.steps - 1)) % instrument.steps) p5.fill(255)
                            else if(instrument.pattern[j]) p5.fill(255, 100, 100);
                            else { p5.fill(0); }

                            let x = p5.width/2 + (radiuses[i] - 25) * p5.cos(angle);
                            let y = p5.height/2 + (radiuses[i] - 25) * p5.sin(angle);
                            p5.ellipse(x, y, dotRadius * 2, dotRadius * 2); // draw dot
                        }
                    });
                    p5.fill(0);
                    p5.text(Tone.Transport.bpm.value.toFixed(0), p5.width/2, p5.height/2);
                    p5.textAlign(p5.CENTER, p5.CENTER);
                };
            }
        }
    },
}

</script>