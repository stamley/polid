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
                //let dotRadius = 7;
                
                //let consolas;
                //p5.preload = () => {
                //    consolas = p5.loadFont('../assets/consola.ttf')
                //}
                p5.setup = () => {
                    let canvas = p5.createCanvas(window.innerWidth*0.95, window.innerHeight*0.93);
                    canvas.parent("p5Canvas");
                    p5.background(0);
                    p5.frameRate(60);
                    p5.textSize(30);
                    
                    //p5.textFont(consolas);
                };
                p5.draw = () => {
                    p5.background(0);
                    
                    let dotCounts = currentPolid.canvasData.dotCounts;
                    let radiuses = currentPolid.canvasData.radiuses;
                    //let glow = 30;
                    //let colors = currentPolid.canvasData.colors;
                    // Drawing each circle for each instrument
                    currentPolid.instruments.forEach((instrument, i) => {
                        let active = 0;
                        if(currentPolid.activeInstrument === i) active = 1.5;
                        
                        p5.drawingContext.setLineDash([]);
                        p5.fill(0);
                        p5.strokeWeight(2 + active);
                        p5.stroke(0, 240, 0);
                        p5.ellipse(p5.width/2, p5.height/2, radiuses[i]*2, radiuses[i]*2);
                
                        // Drawing dots for the each instrument
                        for (let j = 0; j < dotCounts[i]; j++) {
                            p5.drawingContext.setLineDash([]);
                            let angle = j * p5.TWO_PI / dotCounts[i]; // calculate angle for current dot
                            let x = p5.width/2 + radiuses[i] * p5.cos(angle);
                            let y = p5.height/2 + radiuses[i] * p5.sin(angle);

                            
                            p5.strokeWeight(2 + active)
                            // Other color for the current beat
                            if(j === (instrument.beat + (instrument.steps - 1)) % instrument.steps) p5.ellipse(x , y, 15, 15);
                            if(instrument.pattern[j]) p5.strokeWeight(11);
                            else { p5.drawingContext.setLineDash([10, 5]); }
                            
                            p5.line(p5.width/2, p5.height/2, x, y); // draw line
                        }
                    });
                    p5.fill(0, 240, 0);
                    p5.strokeWeight(0.4);
                    
                    p5.text(Tone.Transport.bpm.value.toFixed(0), 40, 40);
                    p5.textAlign(p5.CENTER, p5.CENTER);
                };
            }
        }
    },
}

</script>