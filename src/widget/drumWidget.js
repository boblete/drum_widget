class DrumWidget {
    constructor(sequence) {
        console.log("new widget")

        var bpm = sequence.bpm!=undefined ? sequence.bpm / 240 : .5;
        var swing = sequence.swing || 0;

        var panel = new Interface.Panel({ container: document.querySelector(".charanga_drum_widget") }) // panel fills page by default, alternatively you can specify boundaries

        this.play = new Interface.Button({
            bounds: [.9, .05, .1, .1],
            label: 'Play',
            type: "toggle",
            onvaluechange: () => { this.startstop() }

        });

        var k1 = new Interface.Knob({
            bounds: [0, .05, .05],
            value: bpm,
            usesRotation: false,
            centerZero: false,
            label: "BPM",
            onvaluechange: function() {
                var val = (Math.round(this.value * 240))
                k1Label.setValue(val);
                window.Tone.Transport.bpm.value = val;
            }
        });
        var k2 = new Interface.Knob({
            bounds: [.1, .05, .05],
            value: 0,
            usesRotation: false,
            centerZero: false,
            label: "Swing",
            onvaluechange: function() {
                window.Tone.Transport.swing = this.value / 2;
                k2Label.setValue((Math.round(this.value * 25) + 50));
            }
        });
        var k1Label = new Interface.Label({
            bounds: [0, 0, .05, .1],
            hAlign: 'center',
            value: Math.round(bpm * 240),

        });
        var k2Label = new Interface.Label({
            bounds: [.1, 0, .05, .1],
            hAlign: 'center',
            value: Math.round(swing * 25) + 50,

        });

        var r1l = new Interface.Label({
            bounds: [0, 0.375, .05, .1],
            hAlign: 'right',
            value: 'oh',

        });
        var r2l = new Interface.Label({
            bounds: [0, 0.55, .05, .1],
            hAlign: 'right',
            value: 'hh',

        });
        var r3l = new Interface.Label({
            bounds: [0, 0.725, .05, .1],
            hAlign: 'right',
            value: 'sd',

        });
        var r4l = new Interface.Label({
            bounds: [0, 0.9, .05, .1],
            hAlign: 'right',
            value: 'kd',

        });

        this.multiButton = new Interface.MultiButton({
            rows: 4,
            columns: 16,
            bounds: [.1, .3, .9, .7],
            onvaluechange: (row, col, value) => { this.multiButtonChanged(row, col, value) }
        });

        panel.add(k1Label, k2Label, k1, k2, this.multiButton, this.play, r1l, r2l, r3l, r4l);
        this.initSequence(sequence);
    }
    parseqs(value) {
        value = value.split("") || [];
        for (var i = 0; i < 16; i++) {
            if (value[i]) {
                if (value[i] == 0) {
                    value[i] = null;
                }
            } else {
                value[i] = null
            }
        }
        console.log(value)
        return value;
    }
    initSequence(seq) {
        //set bpm 


        Tone.Transport.bpm.value = seq.bpm || 120;
        Tone.Transport.swing = seq.swing || 0;
        Tone.Transport.swingSubdivision = "8n"
        Tone.Transport.timeSignature = 4
        Tone.Transport.loopStart = 0
        Tone.Transport.loopEnd = "4m"
        Tone.Transport.PPQ = 192

        var oh = new Tone.MetalSynth({
            "harmonicity": 24,
            "resonance": 800,
            "modulationIndex": 20,
            "envelope": {
                "decay": 0.4,
            },
            "volume": -15
        }).toMaster();
     
        var ohs = new Tone.Sequence(function(time, pitch) {

            oh.frequency.setValueAtTime(900, time, Math.random() * 0.5 + 0.5);
            oh.triggerAttack(time);

        }, this.parseqs(seq.r0), "16n").start(0);
  		var hh = new Tone.MetalSynth({
            "harmonicity": 12,
            "resonance": 800,
            "modulationIndex": 20,
            "envelope": {
                "decay": 0.1,
            },
            "volume": -15
        }).toMaster();
        var hhs = new Tone.Sequence(function(time, pitch) {

            oh.frequency.setValueAtTime(1700, time, Math.random() * 0.5 + 0.5);
            oh.triggerAttack(time);

        }, this.parseqs(seq.r1), "16n").start(0);
        var sd = new Tone.MembraneSynth({
            "pitchDecay": 0.08,
            "octaves": -2,
            "envelope": {
                "attack": 0.0006,
                "decay": 0.5,
                "sustain": 0
            }
        }).toMaster();
        var sds = new Tone.Sequence(function(time, pitch) {

            sd.triggerAttack(100, time, Math.random() * 0.5 + 0.5);

        }, this.parseqs(seq.r2), "16n").start(0);


        var kd = new Tone.MembraneSynth({
            "pitchDecay": 0.008,
            "octaves": 1,
            "envelope": {
                "attack": 0.0006,
                "decay": 0.4,
                "sustain": 0
            }
        }).toMaster();
        var kds = new Tone.Sequence(function(time, pitch) {
            kd.triggerAttack(40, time, Math.random() * 0.5 + 0.5);
        }, this.parseqs(seq.r3), "16n").start(0);
        // congaPart.loop = true;
        // congaPart.loopEnd = "1m";



        this.sequenceList = [
            ohs, hhs, sds, kds


        ]
        this.multiButton
        console.log(this.multiButton, this.multiButton.serialiseMe)
        for (var s in this.sequenceList) {
            for (var i = 0; i < 16; i++) {

                this.multiButton.setValue(s, i, this.sequenceList[s].at(i))
            }
        }

    }
    startstop() {
        if (this.play._value) {
            Tone.Transport.start("+0.1");
        } else {

            Tone.Transport.stop();
        }
    }
    stop() {
        console.log(this.play._value);

    }
    multiButtonChanged(row, col, value) {
        console.log(row, col, value);
        console.log(this.sequenceList[row]);
        if (row < this.sequenceList.length) {
            if (value === 0) {
                this.sequenceList[row].remove(col)
            } else {
                this.sequenceList[row].add(col, value)
            }
        }

    }
}
export default DrumWidget;
