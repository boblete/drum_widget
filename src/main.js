
import $ from 'jquery';
import jQuery from 'jquery';
import Tone from 'tone'

import StartAudioContext from 'startaudiocontext'
import DrumWidget from './widget/drumWidget';


const queryString = require('query-string');


	//create an audio context
window.AudioContext = window.AudioContext || window.webkitAudioContext

	
 window.drum_sequence = queryString.parse(location.search);

// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;
window.Tone = Tone;
//window.Interface = Interface;



//add in any framework script
//require("./framework.js");


//if we need to utilise

 StartAudioContext(Tone.context,'.starterButton').then(() => {
    //started
    console.log("Begun");
    window.audioContextStarted=true;

  //  
    var charangaDrumWidget = new DrumWidget();
    //charangaDrumWidget.deferedInit(parsed);
    $(".starterButton").hide();
    $(window).resize(() => {charangaDrumWidget.draw()});
    $(window).on("orientationchange",() => {charangaDrumWidget.draw()});
    charangaDrumWidget.startUserMedia();
})