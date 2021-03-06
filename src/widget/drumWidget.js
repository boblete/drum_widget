import KickDrum from '../synths/KickDrum';
import SnareDrum from '../synths/SnareDrum';
import HighHat from '../synths/HighHat';
import Recorder from 'recorderjs';
import Tone from 'tone';
import Interface from 'interface.js'
/*
	TODO - OFFLINING
	SORTING OUT EXPORT SO ITS SAMPLE CORRECT
	SORTING OUT SOUNDS SO THEY UTILISE OFFLINE CONTEXTS
	TRY AND MAKE EVETYTHING USE OFFLINE CONTEXTS SO YOU CAN JUST EXPORT IT DIRECT 

	/CURRENT METHODS A HACK


*/

class DrumWidget {

    constructor() {
        console.log("Make Drum Widget")
        var sequence = window.drum_sequence;

        var bpm = sequence.bpm != undefined ? sequence.bpm / 240 : .5;
        var swing = sequence.swing || 0;

        var panel = this.panel = new Interface.Panel({ container: document.querySelector(".charanga_drum_widget") }) // panel fills page by default, alternatively you can specify boundaries
        var ob = this
        this.play = new Interface.Button({
            bounds: [.85, .05, .15, .2],
            label: 'Play',
            mode: "toggle",
            onvaluechange: () => { this.startstop() }

        });

        this.share = new Interface.Button({
            bounds: [.55, .05, .1, .2],
            label: 'Share',
            mode: 'contact',
            onvaluechange: () => { this.shareclick() }

        });

        this.export = new Interface.Button({
            bounds: [.65, .05, .1, .2],
            label: 'Export',
            mode: 'contact',
            onvaluechange: () => { this.exportclick() }

        });
        this.clear = new Interface.Button({
            bounds: [.75, .05, .1, .2],
            label: 'Clear',
            mode: 'contact',
            onvaluechange: () => { this.clearclick() }

        });


        var k1 = this.k1 = new Interface.Slider({
            bounds: [0.1, .05, .23, .2],
            label: 'horizontal slider',
            isVertical: false,
            value: bpm,
            label: "BPM",
            onvaluechange: function() {
                var val = (Math.round(this.value * 240))
                k1Label.setValue(val);
                window.Tone.Transport.bpm.value = val;
            }
        });
        /*.Knob({
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
        });*/
        var k2 = this.k2 = new Interface.Slider({
            bounds: [0.34, .05, .2, .2],
            label: 'horizontal slider',
            isVertical: false,
            value: swing,
            label: "Swing",
            onvaluechange: function() {
                window.Tone.Transport.swing = this.value / 2;
                k2Label.setValue((Math.round(this.value * 25) + 50));
            }
        });


        /*  .Knob({
              bounds: [.3, .05, .05],
              value: 0,
              usesRotation: false,
              centerZero: false,
              label: "Swing",
              onvaluechange: function() {
                  window.Tone.Transport.swing = this.value / 2;
                  k2Label.setValue((Math.round(this.value * 25) + 50));
              }
          });*/
        var k1Label = new Interface.Label({
            bounds: [.1, 0, .23, .1],
            hAlign: 'center',
            value: Math.round(bpm * 240),

        });
        var k2Label = new Interface.Label({
            bounds: [.35, 0, .2, .1],
            hAlign: 'center',
            value: Math.round(swing * 25) + 50,

        });

        var r1l = new Interface.Label({
            bounds: [0, 0.375, .1, .1],
            hAlign: 'center',
            value: 'o-h',

        });
        var r2l = new Interface.Label({
            bounds: [0, 0.55, .1, .1],
            hAlign: 'center',
            value: 'h-h',

        });
        var r3l = new Interface.Label({
            bounds: [0, 0.725, .1, .1],
            hAlign: 'center',
            value: 's-d',

        });
        var r4l = new Interface.Label({
            bounds: [0, 0.9, .1, .1],
            hAlign: 'center',
            value: 'k-d',

        });

        this.multiButton = new Interface.MultiButton({
            rows: 4,
            columns: 16,
            bounds: [.1, .3, .9, .7],
            onvaluechange: (row, col, value) => { this.multiButtonChanged(row, col, value) }

        });

        panel.add(k1Label, k2Label, k1, k2, this.multiButton, this.play, this.share, this.export, this.clear, r1l, r2l, r3l, r4l);

        this.initSequence(sequence);



    }
    parseqs(value) {
        if (value === undefined) {
            value = [];
        } else {
            value = value.split("") || [];
        }
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
        seq = seq || this.sequence;

        Tone.latencyHint = "playback";
        Tone.Transport.bpm.value = seq.bpm || 120;
        Tone.Transport.lookAhead = 0.5;
        Tone.Transport.swing = seq.swing || 0;
        Tone.Transport.swingSubdivision = "16n";
        Tone.Transport.timeSignature = 4;
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd = "4m";
        Tone.Transport.PPQ = 192;





        var oh = new HighHat({
            "envelope": {
                "decay": 0.5,
            }
        }).toMaster();


        var ohs = new Tone.Sequence(function(time, pitch) {

            oh.trigger(time, Math.random() * 0.5 + 0.5);


        }, this.parseqs(seq.r0), "16n").start(0)
        var hh = new HighHat({
            "envelope": {
                "decay": 0.1,
            }
        }).toMaster();;
        var hhs = new Tone.Sequence(function(time, pitch) {


            hh.trigger(time, Math.random() * 0.5 + 0.5);

        }, this.parseqs(seq.r1), "16n").start(0)
        var sd = new SnareDrum().toMaster();;
        var sds = new Tone.Sequence(function(time, pitch) {

            sd.trigger(time, Math.random() * 0.5 + 0.5);

        }, this.parseqs(seq.r2), "16n").start(0)

        var kd = new KickDrum().toMaster();

        var kds = new Tone.Sequence(function(time, pitch) {
                kd.trigger(time, Math.random() * 0.5 + 0.5);
            }, this.parseqs(seq.r3), "16n").start(0)
            // congaPart.loop = true;
            // congaPart.loopEnd = "1m";



        this.sequenceList = [
            ohs, hhs, sds, kds


        ]
        this.insts = [oh, hh, sd, kd]

        for (var s in this.sequenceList) {
            for (var i = 0; i < 16; i++) {

                this.multiButton.setValue(s, i, this.sequenceList[s].at(i))
            }
        }
        this.gainer = new Tone.Gain()
        Tone.Master.chain(this.gainer)
    }
    startstop() {
        console.log("startystop", this.play._value)
        if (this.play._value) {

            Tone.Transport.start("+0.1");
            this.play.label = "Pause"
        } else {

            Tone.Transport.stop();
            this.play.label = "Play"
        }
    }
    stop() {
        console.log(this.play._value);

    }
    shareclick() {
        console.log(this.multiButton._values);
        this.createLink()
    }
    clearclick() {
        console.log(this.multiButton._values);
        for (var s in this.sequenceList) {
            for (var i = 0; i < 16; i++) {

                this.multiButton.setValue(s, i, null)


                this.sequenceList[s].remove(i)

            }
        }
    }

    exportclick() {


        if (window.isRecording) {
            this.stopRecording()
        } else {
        	Tone.Transport.stop();
        	Tone.Transport.scheduleOnce((time) => {
		 this.stopRecording()
}, "1m")
        
        	Tone.Transport.scheduleOnce((time) => {
		 console.log("start",time)
		 this.startRecording()
}, "0m")
           //this.startRecording()
         
            Tone.Transport.start("+4n");
            
            window.isRecording =true;
        }
      
    }
    startUserMedia() {
        // Uncomment if you want the audio to feedback directly
        //input.connect(audio_context.destination);
        //console.log('Input connected to audio context destination.');
        this.recorder = new Recorder(this.gainer, { workerPath: "assets/recorder.js" });
        console.log('Recorder initialised.');
    }
    startRecording(button) {
        this.recorder && this.recorder.record();

        console.log('Recording...',Tone.Transport.seconds);
      
    }

    stopRecording(button) {
        this.recorder && this.recorder.stop();
        this.recordingCallbackID 
        console.log('Stopped recording.');

        //
      	Tone.Transport.stop();

        // create WAV download link using audio data blob
        this.createDownloadLink();

        this.recorder.clear();
        window.isRecording = false
    }
    createDownloadLink() {
        this.recorder && this.recorder.exportWAV(function(blob) {
            var url = URL.createObjectURL(blob);
            var li = document.createElement('div');
            var au = document.createElement('audio');
            var hf = document.createElement('a');
            li.setAttribute('class','download-element')
            au.controls = true;
            au.src = url;
            hf.href = url;
            hf.download = new Date().toISOString() + '.wav';
            hf.innerHTML = hf.download;
            li.appendChild(au);
            li.appendChild(hf);
            $(".exportLink").append(li);
        });
    }
    createLink() {
        var s = "?"
        for (var i = 0; i < this.multiButton._values.length; i++) {
            if (i == 0) {
                s += "r0="
            } else if (i == 16) {
                s += "&r1="
            } else if (i == 32) {
                s += "&r2="
            } else if (i == 48) {
                s += "&r3="
            }
            if (this.multiButton._values[i] !== null && this.multiButton._values[i] !== false) {
                s += "1";
            } else {
                s += "0";
            }
        }
        s += "&bpm=" + window.Tone.Transport.bpm.value
        s += "&swing" + this.k2.value
        var link = "http://demo.charanga.com/dw" + s;
        $("#shareLink").html("<a class='share' href='" + link + "'>" + link + "</a>").show();

    }
    multiButtonChanged(row, col, value) {

        console.log(row, col, value);
        console.log(this.sequenceList[row]);
        if (row < this.sequenceList.length) {
            if (value === 0) {
                this.sequenceList[row].remove(col);
            } else {
                this.sequenceList[row].add(col, value);
            }
        }
        $("#shareLink").hide();
    }
    draw() {
        //this.panel.redoBoundaries();
        window.context = document.querySelector(".charanga_drum_widget canvas").getContext("2d");
        context.canvas.width = $("div.charanga_drum_widget").width();
        context.canvas.height = $("div.charanga_drum_widget").innerHeight();
        console.log($("div.charanga_drum_widget").width());
        //document.querySelector(".charanga_drum_widget canvas").attributes.height=600
        //console.log(w)
        this.panel.width = context.canvas.width;
        //  this.panel.height = context.canvas.height;

        this.panel.refresh()
    }
}
export default DrumWidget;
