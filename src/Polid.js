import * as Tone from "tone";
import euclideanRhythm from "./assets/euclidean-rhythm"

class Polid{
    constructor(){
        this.instruments = [];
        this.started = false;
        this.playing = false;

        let instr = this.createInstrument("kick", 4, 1);
        let instr2 = this.createInstrument("snare", 3, 3);
        let instr3 = this.createInstrument("hihat", 5, 5);
        this.addInstrument(instr);
        this.addInstrument(instr2);
        this.addInstrument(instr3);
        console.log("Instr: ");
        console.log(instr.pattern);
        console.log(instr2.pattern);
    }
    addInstrument(instrument){
        console.log("added: ");
        console.log(instrument.type);
        this.instruments = [...this.instruments, instrument]
    }
    createInstrument(type, steps, pulses){
        let instr = new Instrument(type, steps, pulses, 0, this.createSample(type)); 
        this.euclidify(instr);
        return instr;
    }
    createSample(type){
        return new Tone.Sampler({A1: require("/src/sounds/" + type + "/" + type + ".wav")}).toDestination();
    }
    euclidify(instrument){
        // Evenly divide the pulses on the specific number of steps for the instrument
        instrument.pattern = euclideanRhythm(instrument.pulses, instrument.steps);
    }
    scheduleInstruments(){
        this.instruments.forEach((instrument) => {
            
            Tone.Transport.scheduleRepeat((time)=> {
                if(instrument.pattern[instrument.beat]) 
                    instrument.sample.triggerAttackRelease("A1", "8n", time);
                instrument.beat = (instrument.beat + 1) % instrument.steps;
                console.log(instrument.type + " beat: ");
                console.log(instrument.beat);
            }, instrument.steps +"n");
        });
    }
    async startPlaying(){
        console.log("Playing");
        let button = document.getElementById("play-button");
        if(!this.started){
            await Tone.start();
            console.log("Tone started, scedhuling repeat: ");
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
}
class Instrument {
    constructor(type, steps, pulses, offset, sample){
        this.beat = 0;
        this.type = type;

        this.steps = steps;
        this.pulses = pulses;
        this.offset = offset;
        
        this.sample = sample;
        this.pattern = [];
    }
}

export default Polid;
