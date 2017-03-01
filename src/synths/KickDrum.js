import Tone from 'tone'
class KickDrum extends Tone.Instrument {

    constructor(options) {
    	super(options);
		this.defaults={
        	"pitchDecay": 0.4,
            "octaves": 4,
            "oscillator": {
                "type": "sine",
            },
            "envelope": {
                "attack": 0.0001,
                "decay": 0.3,
                "sustain": 0.0001,
                "release": 0.0001,
                "attackCurve": "exponential"
            }
        };       
        options = this.defaultArg(options, this.defaults);

       //Tone.Instrument.call(this, options);
        this.frQ = 200;
        this.decay = 0.4;
        this.setup();
        return this
    }
    setup() {

        this.osc = new Tone.OmniOscillator(this.defaults.oscillator).start();
        this.envelope = new Tone.AmplitudeEnvelope(this.defaults.envelope)
        this.octaves = this.defaults.octaves;
        this.pitchDecay = this.defaults.pitchDecay;
        this.osc.chain(this.envelope, this.output);

    };
    trigger(time, velocity){
    	this.triggerAttack(time, velocity);
    	this.triggerRelease(time +this.pitchDecay);
    }
    triggerAttack(time, velocity) {
        velocity = velocity || 1

        this.osc.frequency.cancelScheduledValues(time);
        //this.envelope.cancelScheduledValues(time);
        this.osc.frequency.setValueAtTime(this.frQ, time);
        this.osc.frequency.exponentialRampToValueAtTime(0.01, time + this.pitchDecay);
        this.envelope.triggerAttack(time, velocity);

        return this;



    }
    triggerRelease(time) {
        this.envelope.triggerRelease(time);
        return this;
    };
    dispose() {
        Tone.Instrument.prototype.dispose.call(this);
        this._writable(["oscillator", "envelope"]);
        this.oscillator.dispose();
        this.oscillator = null;
        this.envelope.dispose();
        this.envelope = null;
        return this;
    };
}
export default KickDrum;
