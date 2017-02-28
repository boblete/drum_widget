import Tone from 'tone'
class HighHat extends Tone.Instrument {
    constructor(options) {
        super(options);
        this.defaults = this.defaultArg(options,  {
            "pitchDecay": 0.4,
            "decay":0.1,
            "octaves": 4,
            "oscillator": {
                "type": "sine",
            },
            "envelope": {
                "attack": 0.001,
                "decay": 0.5,
                "sustain": 0.01,
                "release": 0.2,
                "attackCurve": "exponential"
            }
        });
        options = this.defaultArg(options, this.defaults);

        //Tone.Instrument.call(this, options);
        this.fundM = 59
        this.hpQ = 7000
        this.setup();
        return this
    }
    setup() {
        this.fundamental = this.fundM;
        this.ratios = [2, 3, 4.13, 5.43, 6.79, 8.21];



        this.envelope = new Tone.AmplitudeEnvelope(this.defaults.envelope);

        // Bandpass
        this.bandpass = new Tone.Filter()
        this.bandpass.type = "bandpass";
        this.bandpass.frequency.value = 9000;
  
            // Highpass
        this.highpass = new Tone.Filter()
        this.highpass.type = "highpass";
        this.highpass.frequency.value = this.hpQ;
        this.oscs = []
        this.ratios.forEach((ratio) => {
            var osc = new Tone.PulseOscillator( this.fundamental * ratio,.51).start()
            
            // Frequency is the fundamental * this oscillator's ratio
          
            osc.connect(this.bandpass);
            this.oscs.push(osc);
        });

        // Connect the graph
        this.bandpass.connect(this.highpass);
        this.highpass.connect(this.envelope);
        this.envelope.connect(Tone.Master);
    }
    trigger(time, velocity) {

        this.triggerAttack(time, velocity);
        this.triggerRelease(time+this.defaults.decay);
    }
    triggerAttack(time, velocity) {

        this.envelope.triggerAttack(time, velocity);
    }
    triggerRelease(time) {
        this.envelope.triggerRelease(time); 
      
        return this;
    };
    dispose() {
        Tone.Instrument.prototype.dispose.call(this);
        this._writable(["oscillator", "envelope"]);
          this.oscs.forEach((osc) => {
          	osc.dispose()
          	osc=null;
          });

        return this;
    };
}
export default HighHat;
