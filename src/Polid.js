import * as Tone from "tone";
import euclideanRhythm from "./assets/euclidean-rhythm"

class Polid{
    constructor(){
        this.observers = [];
        this.instruments = [];
        this.started = false;
        this.playing = false;
        this.modifier = 1;

        this.availableInstruments = ["kick","snare","hihat","ohh","clap","clav"]
        this.nextInstrument = 0;

        this.canvasData = new CanvasData();
        this.addInstrument();
             
        this.activeInstrument = 0;
    }
    createInstrument(type, steps, pulses){
        let instrument = new Instrument(type, steps, pulses, this.createSample(type)); 
        // Evenly divide the pulses on the specific number of steps for the instrument
        instrument.pattern = euclideanRhythm(instrument.pulses, instrument.steps);
        return instrument;
    }
    createSample(type){
        return new Tone.Sampler({A1: require("/src/sounds/" + type + "/" + type + ".wav")}).chain( Tone.Destination);
    }
    reset(){
        if(this.instruments.length > 1){
            Tone.Transport.cancel();
            this.instruments = [];
            this.nextInstrument = 0;
            this.activeInstrument = -1;
            this.addInstrument();
            this.updateCanvas();
        }
    }
    switchModifier(){
        this.modifier = (this.modifier) % 3 + 1;
        if(this.modifier === 2){
            if(!(this.instruments[this.activeInstrument].steps % 2 === 0)) 
                this.instruments[this.activeInstrument].steps--;
        }
        else if(this.modifier === 3){
            if(this.instruments[this.activeInstrument].steps % 3 === 1)
                this.instruments[this.activeInstrument].steps += 2;
            else if(this.instruments[this.activeInstrument].steps % 3 === 2)
                this.instruments[this.activeInstrument].steps ++;
        }
        this.updateCanvas();
    }
    addInstrument(){
        // Add the next available instrument from the list
        // The index for the next instrument is increased as
        // long as there are samples to choose from.
        if(this.nextInstrument < this.availableInstruments.length){
            let instrument = this.createInstrument(this.availableInstruments[this.nextInstrument], 4, 1);
            this.instruments = [...this.instruments, instrument];
            this.nextInstrument++;
            this.activeInstrument++;
            // Update the new values to the canvas
            this.updateCanvas();
            this.scheduleInstrument(instrument);
            this.rescheduleInstruments();
        }
    }
    removeInstrument(){
        if(this.instruments.length > 1){
            if(this.activeInstrument === this.instruments.length - 1)
                this.activeInstrument = this.activeInstrument - 1;
            this.instruments.pop();
            Tone.Transport.cancel();
            this.rescheduleInstruments();
            this.nextInstrument = this.nextInstrument - 1;
            this.updateCanvas();
        }
    }
    scheduleInstrument(instrument){
        Tone.Transport.scheduleRepeat((time) => {
            if(instrument.pattern[instrument.beat]) 
                instrument.sample.triggerAttackRelease("A1", "8n", time);
            instrument.beat = (instrument.beat + 1) % instrument.steps;
        }, instrument.steps + "n");
    }
    // Used to resync instruments when a new one is added
    rescheduleInstruments(){
        Tone.Transport.cancel();
        this.instruments.forEach((instrument) => {
            Tone.Transport.scheduleRepeat((time)=> {
                if(instrument.pattern[instrument.beat]) 
                    instrument.sample.triggerAttackRelease("A1", "8n", time);
                instrument.beat = (instrument.beat + 1) % instrument.steps;
            }, instrument.steps +"n");
        });
        this.instruments.forEach((instrument) => { instrument.beat = 0; });
        this.updateCanvas();
    }
    async startPlaying(){
        //let button = document.getElementById("play-button");
        if(!this.started){
            await Tone.start();
            Tone.Transport.bpm.value = 120;
            Tone.getDestination().volume.rampTo(-10, 0.001);
            this.started = true;
        }
        if (this.playing) {
            Tone.Transport.stop();
            this.playing = false;
            //button.innerText = "PLAY";
        } else {
            Tone.Transport.start();
            this.playing = true;
            //button.innerText = "STOP";
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
            return radiusDecrease = radiusDecrease - 70; 
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
        if(this.instruments[this.activeInstrument].steps < 32){
            this.instruments[this.activeInstrument].steps += 1 * this.modifier;
            this.rescheduleInstruments();
            this.updateDotCounts();
        }
    }
    decreaseSteps(){
        if(this.instruments[this.activeInstrument].steps > 2){
            this.instruments[this.activeInstrument].steps -= 1 * this.modifier;
            this.rescheduleInstruments();
            this.updateDotCounts();
        }
    }
    increasePulses(){
        if(this.instruments[this.activeInstrument].pulses < this.instruments[this.activeInstrument].steps){
            this.instruments[this.activeInstrument].pulses++;
            this.instruments[this.activeInstrument].pattern = euclideanRhythm(
                this.instruments[this.activeInstrument].pulses, 
                this.instruments[this.activeInstrument].steps
            );
        }
    }
    decreasePulses(){
        let pulses = this.instruments[this.activeInstrument].pulses;
        let steps = this.instruments[this.activeInstrument].steps;
        if(pulses > 0){
            this.instruments[this.activeInstrument].pulses = pulses - 1;
            this.instruments[this.activeInstrument].pattern = euclideanRhythm(pulses - 1, steps)
        }
    }
    increaseBpm(){
        if(Tone.Transport.bpm.value < 280)
            Tone.Transport.bpm.value = Tone.Transport.bpm.value + 5; 
    }
    decreaseBpm(){
        if(Tone.Transport.bpm.value > 20)
            Tone.Transport.bpm.value = Tone.Transport.bpm.value - 5; 
    }
    increaseOffset(){
        this.arrayRotate(this.instruments[this.activeInstrument].pattern);
    }
    decreaseOffset(){
        this.arrayRotate(this.instruments[this.activeInstrument].pattern, true);
    }
    arrayRotate(arr, reverse) {
        // By stackoverflow user: Yukulélé
        // https://stackoverflow.com/questions/1985260/rotate-the-elements-in-an-array-in-javascript
        if (reverse) arr.unshift(arr.pop());
        else arr.push(arr.shift());
        return arr;
    }
}
class Instrument {
    constructor(type, steps, pulses, sample){
        this.beat = 0;
        this.type = type;
        this.active = false;

        this.steps = steps;
        this.pulses = pulses;
        // Rotate array: https://stackoverflow.com/questions/1985260/rotate-the-elements-in-an-array-in-javascript        
        this.sample = sample;
        this.pattern = [];
    }
}
class CanvasData {
    constructor(){
        this.baseRadius = window.innerHeight/1.95;
        this.baseColor = 0;
        this.dotCounts = []
        this.radiuses = []
        this.colors = []
    }
    
}

export default Polid;
