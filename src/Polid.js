import * as Tone from "tone";
import euclideanRhythm from "./assets/euclidean-rhythm"

class Polid{
    constructor(){
        this.observers = [];
        this.instruments = [];
        this.started = false;
        this.playing = false;

        this.availableInstruments = ["kick","snare","hihat","ohh","clap","clav"]
        this.nextInstrument = 1;

        let instr = this.createInstrument("kick", 4, 1);
        this.canvasData = new CanvasData();
        this.addInstrument(instr);
        //let instr2 = this.createInstrument("snare", 3, 3);
        //let instr3 = this.createInstrument("hihat", 5, 5);
        //this.addInstrument(instr2);
        //this.addInstrument(instr3);       
        this.activeInstrument = 0;
    }
    addInstrument(){
        if(this.nextInstrument < this.availableInstruments.length){
            let instrument = this.createInstrument(this.availableInstruments[this.nextInstrument], 4, 1);
            this.nextInstrument = this.nextInstrument + 1;
            this.activeInstrument = this.activeInstrument + 1;
            this.instruments = [...this.instruments, instrument];
            this.updateCanvas();
        }
    }
    removeInstrument(){
        if(this.instruments.length > 1){
            if(this.activeInstrument === this.instruments.length - 1)
                this.activeInstrument = this.activeInstrument - 1;
            this.instruments.pop();
            console.log(this.nextInstrument);
            this.nextInstrument = this.nextInstrument - 1;
            console.log(this.nextInstrument);
            this.updateCanvas();
        }
    }
    createInstrument(type, steps, pulses){
        let instrument = new Instrument(type, steps, pulses, 0, this.createSample(type)); 
        // Evenly divide the pulses on the specific number of steps for the instrument
        instrument.pattern = euclideanRhythm(instrument.pulses, instrument.steps);
        return instrument;
    }
    createSample(type){
        return new Tone.Sampler({A1: require("/src/sounds/" + type + "/" + type + ".wav")}).toDestination();
    }
    scheduleInstruments(){
        this.instruments.forEach((instrument) => {
            Tone.Transport.scheduleRepeat((time)=> {
                if(instrument.pattern[instrument.beat]) 
                    instrument.sample.triggerAttackRelease("A1", "8n", time);
                instrument.beat = (instrument.beat + 1) % instrument.steps;
            }, instrument.steps +"n");
        });
    }
    async startPlaying(){
        let button = document.getElementById("play-button");
        if(!this.started){
            await Tone.start();
            Tone.Transport.bpm.value = 120;
            this.scheduleInstruments();
            Tone.getDestination().volume.rampTo(-10, 0.001);
            this.started = true;
        }
        if (this.playing) {
            Tone.Transport.stop();
            this.playing = false;
            button.innerText = "PLAY";
        } else {
            Tone.Transport.start();
            this.playing = true;
            button.innerText = "STOP";
        }

    }
    updateCanvas(){
        this.updateDotCounts();
        this.updateColors();
        this.updateRadiuses();
    }
    updateDotCounts(){
        // eslint-disable-next-line no-unused-vars
        this.canvasData.dotCounts = this.instruments.map((instrument)=>{
            return instrument.steps;
        });
    }
    updateRadiuses(){
        // eslint-disable-next-line no-unused-vars
        let radiusDecrease = this.canvasData.baseRadius;
        this.canvasData.radiuses = this.instruments.map(() => {
            return radiusDecrease = radiusDecrease - 30; 
        }); 
    }
    updateColors(){
        // eslint-disable-next-line no-unused-vars
        let colorGradient = this.canvasData.baseColor;
        this.canvasData.colors = this.instruments.map(() => {
            return colorGradient = colorGradient + 30;
        });
    }
    instrumentChangeLeft(){
        // 7 is the max amount of instruments
        if(this.activeInstrument >= this.instruments.length - 1) return;
        else {
            this.activeInstrument = this.activeInstrument + 1;
        }
    }
    instrumentChangeRight(){
        if(this.activeInstrument === 0) return;
        else {
            this.activeInstrument = this.activeInstrument - 1;
        }
    }
    increaseSteps(){
        let steps = this.instruments[this.activeInstrument].steps 
        if(steps < 32){
            this.instruments[this.activeInstrument].steps = steps + 1;
            this.updateDotCounts();
        }
    }
    decreaseSteps(){
        let steps = this.instruments[this.activeInstrument].steps 
        if(steps > 2){
            this.instruments[this.activeInstrument].steps = steps - 1;
            this.updateDotCounts();
        }
    }
    increasePulses(){
        if(this.instruments[this.activeInstrument].pulses < this.instruments[this.activeInstrument].steps)
            this.instruments[this.activeInstrument].pulses = this.instruments[this.activeInstrument].pulses + 1;
    }
    decreasePulses(){
        if(this.instruments[this.activeInstrument].pulses > 0)
            this.instruments[this.activeInstrument].pulses = this.instruments[this.activeInstrument].pulses - 1;
    }
}
class Instrument {
    constructor(type, steps, pulses, offset, sample){
        this.beat = 0;
        this.type = type;
        this.active = false;

        this.steps = steps;
        this.pulses = pulses;
        // Rotate array: https://stackoverflow.com/questions/1985260/rotate-the-elements-in-an-array-in-javascript
        this.offset = offset;
        
        this.sample = sample;
        this.pattern = [];
    }
}
class CanvasData {
    constructor(){
        this.baseRadius = window.innerHeight/3;
        this.baseColor = 0;
        this.dotCounts = []
        this.radiuses = []
        this.colors = []
    }
    
}

export default Polid;
