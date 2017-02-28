import Tone from 'tone'
class SnareDrum extends Tone.Instrument {
    constructor(options) {
        super(options);
        this.defaults = {
            "decay": 0.4,
            "octaves": 4,
            "oscillator": {
                "type": "triangle",
            },
            "envelope": {
                "attack": 0.001,
                "decay": 0.1,
                "sustain": 0.01,
                "release": 0.001,
                "attackCurve": "exponential"
            },
            "noise_envelope": {
                "attack": 0.001,
                "decay": 0.25,
                "sustain": 0.001,
                "release": 0.004,
                "attackCurve": "exponential"
            }
        };
        options = this.defaultArg(options, this.defaults);

        //Tone.Instrument.call(this, options);
        this.frQ = 1500
        this.funD = 100;
        this.decay = 0.3;
        this.setup();
        return this
    }
    setup() {
    	/*
        this.eq3 = new Tone.EQ3(-5,0,-1);
        this.eq3.lowFrequency.value =  this.funD-1 ;
         this.eq3.highFrequency.value =  this.frQ+1500 ;
*/
		this.gain = new Tone.Gain()

        this.oscEnvelope = new Tone.AmplitudeEnvelope(this.defaults.envelope);
        this.noiseEnvelope = new Tone.AmplitudeEnvelope(this.defaults.noise_envelope);
        this.noise = new Tone.Noise("white").start();
        this.noiseFilter = new Tone.Filter();
        this.noiseFilter.type = 'highpass';
        this.noiseFilter.frequency.value = this.freQ;

        this.noise.connect(this.noiseFilter);
        this.noiseFilter.connect(this.noiseEnvelope)
        //this.noiseEnvelope.connect(this.eq3);
        this.noiseEnvelope.connect(this.gain);
        this.osc = new Tone.OmniOscillator(this.defaults.oscillator).start();


          this.osc.frequency.value = this.funD;
        this.osc.connect(this.oscEnvelope);

       /* this.oscEnvelope.connect(this.eq3);
        this.eq3.connect(Tone.Master)*/
       
        this.oscEnvelope.connect( this.gain);
         this.gain.connect(Tone.Master)

    }
    trigger(time, velocity){
    	this.triggerAttack(time, velocity);
    	this.triggerRelease(time);
    }
    triggerAttack(time, velocity) {
        velocity = velocity || 1

        //this.osc.frequency.cancelScheduledValues(time);
        this.noiseFilter.frequency.cancelScheduledValues(time);
        //this.envelope.cancelScheduledValues(time);

        this.noiseEnvelope.triggerAttack(time, velocity);
        this.oscEnvelope.triggerAttack(time, velocity);
     

     
      

        return this;
    }
    triggerRelease(time) {
        this.oscEnvelope.triggerRelease(time);
        this.noiseEnvelope.triggerRelease(time+this.defaults.decay);
        return this;
    };
    dispose() {
        Tone.Instrument.prototype.dispose.call(this);
        this._writable(["oscillator", "envelope"]);
        this.oscillator.dispose();
        this.oscillator = null;
        this.noiseEnvelope.dispose()
        this.noiseEnvelope = null;
        this.noiseFilter.dispose()
        this.noiseFilter = null;
        this.envelope.dispose();
        this.envelope = null;
        return this;
    };
}
export default SnareDrum;
