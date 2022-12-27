<template>
    <div class="p5Canvas" id="p5Canvas"></div>
</template>

<script>
export default {
    name: "Circles-View",
    props: ["polid"],
    mounted(){
        const P5 = require("p5");
        let currentPolid = this.polid;
        new P5(circles());
        function circles(){
            return function(p5){
                let dotRadius = 3;

                let dotCounts = currentPolid.instruments.map((instrument)=>{
                    return instrument.steps;
                });

                // Incremented with 30% for each step
                //let radiuses = [50, 65, 84.5, 109.85, 142.81, 185.65, 241.34];
                let baseRadius = 400/2;
                let baseColor = 0;

                let radiuses = currentPolid.instruments.map(() => {
                    return baseRadius = baseRadius * 0.8; 
                }); 
                /* let dotDistances = radiuses.map((radius, index) => {
                    return radius / dotCounts[index];
                }); */
                let colors = radiuses.map(() => {
                    return baseColor = baseColor + 30;
                });
                p5.setup = () => {
                    //let canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
                    let canvas = p5.createCanvas(400, 400);
                    canvas.parent("p5Canvas");
                    p5.background(255);
                    p5.frameRate(60);
                };
                p5.draw = () => {
                    p5.background(255);
                    // Drawing each circle for each instrument
                    currentPolid.instruments.forEach((instrument, i)=>{
                        p5.fill(colors[i], 100, 100);
                        p5.ellipse(p5.width/2, p5.width/2, radiuses[i]*2, radiuses[i]*2);
                        // Drawing dots for the each instrument
                        for (let j = 0; j < dotCounts[i]; j++) {
                            let angle = j * p5.TWO_PI / dotCounts[i]; // calculate angle for current dot
                            
                            // Other color for the current beat
                            if(j === instrument.beat) p5.fill(255)
                            else if(instrument.pattern[j]) p5.fill(255, 100, 100);
                            else { p5.fill(0); }

                            let x = p5.width/2 + radiuses[i] * 0.9 * p5.cos(angle);
                            let y = p5.height/2 + radiuses[i] * 0.9 * p5.sin(angle);
                            p5.ellipse(x, y, dotRadius * 2, dotRadius * 2); // draw dot
                        }
                    });
                };
            }
        }
    },
}

</script>