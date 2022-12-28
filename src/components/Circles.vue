<template>
    <div class="p5Canvas" id="p5Canvas"></div>
</template>

<script>
export default {
    name: "Circles-View",
    props: ["polid"],
    methods: {
        handleInstrumentChangeLeft(){
            this.polid.instrumentChangeLeft();
        },
        handleInstrumentChangeRight(){
            this.polid.instrumentChangeRight();
        },
        handleInstrumentAdd(){
            this.polid.addInstrument();
        },
        handleInstrumentRemove(){
            this.polid.removeInstrument();
        },
        handleIncreaseSteps(){
            this.polid.increaseSteps();
        },
        handleDecreaseSteps(){
            this.polid.decreaseSteps();
        },
        handleIncreasePulses(){
            this.polid.increasePulses();
        },
        handleDecreasePulses(){
            this.polid.decreasePulses();
        }
    },
    unmounted(){
    },
    mounted(){
        window.addEventListener('keyup', (e) => {
            if(e.key === 'ArrowLeft') this.handleInstrumentChangeLeft();
            if(e.key === 'ArrowRight') this.handleInstrumentChangeRight();
            if(e.key === 'Enter') this.handleInstrumentAdd();
            if(e.key === 'Backspace') this.handleInstrumentRemove();
            if(e.key === 'ArrowUp') this.handleIncreaseSteps();
            if(e.key === 'ArrowDown') this.handleDecreaseSteps();
            if(e.shiftKey && e.key === 'ArrowUp') this.handleIncreasePulses();
            if(e.shiftKey && e.key === 'ArrowDown') this.handleDecreasePulses();

        })

        const P5 = require("p5");
        let currentPolid = this.polid;

        new P5(circles());

        function circles(){
            return function(p5){
                let dotRadius = 3;
                /* let dotDistances = radiuses.map((radius, index) => {return radius / dotCounts[index];}); */
                
                p5.setup = () => {
                    let canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
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
                            if(j === instrument.beat) p5.fill(255)
                            else if(instrument.pattern[j]) p5.fill(255, 100, 100);
                            else { p5.fill(0); }

                            let x = p5.width/2 + (radiuses[i] - 15) * p5.cos(angle);
                            let y = p5.height/2 + (radiuses[i] - 15) * p5.sin(angle);
                            p5.ellipse(x, y, dotRadius * 2, dotRadius * 2); // draw dot
                        }
                    });
                };
            }
        }
    },
}

</script>