<template>
    <div class="p5Canvas" id="p5Canvas"></div>
</template>

<script>
export default {
    name: "Circles-View",
    props: ["polid"],
    methods: {
        updateDotCounts(){
            this.dotCounts = this.polid.instruments.map((instrument)=>{
                return instrument.steps;
            });
        },
        updateRadiuses(){
            this.radiuses = this.polid.instruments.map(() => {
                return this.baseRadius = this.baseRadius * 0.8; 
            }); 
        },
        updateColors(){
            this.colors = this.radiuses.map(() => {
                return this.baseColor = this.baseColor + 30;
            });
        }
    },
    /*setup(){
        let dotCounts = [];
        let radiuses = [];
        let colors = [];
        let baseRadius = 400/2;
        let baseColor = 0;
        return {
            dotCounts,
            radiuses,
            colors,
            baseRadius,
            baseColor,
        }
    },*/
    mounted(){
        const P5 = require("p5");
        let currentPolid = this.polid;

        //this.updateDotCounts();
        //this.updateRadiuses(); 
        //this.updateColors();

        new P5(circles());
        let dotCounts = currentPolid.canvasData.dotCounts;
        let radiuses = currentPolid.canvasData.radiuses;
        let colors = currentPolid.canvasData.colors;
        console.log("dotCounts: ");
        console.log(dotCounts);
        console.log("radiuses: ");
        console.log(radiuses);
        console.log("Colors: ");
        console.log(colors);
        console.log("Canvas data: ");
        console.log(currentPolid.canvasData);

        function circles(){
            return function(p5){
                let dotRadius = 3;
                /* let dotDistances = radiuses.map((radius, index) => {
                    return radius / dotCounts[index];
                }); */
                
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