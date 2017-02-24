
import $ from 'jquery';
import jQuery from 'jquery';
import Tone from 'tone'
import Interface from 'interface.js'
import StartAudioContext from 'startaudiocontext'
import DrumWidget from './widget/drumWidget';

const queryString = require('query-string');
const parsed = queryString.parse(location.search);
console.log(parsed);
// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;
window.Tone = Tone;
window.Interface = Interface;

StartAudioContext(Tone.context).then(function(){
    //started
    console.log("Begun")
})
//add in any framework script
//require("./framework.js");

const charangaDrumWidget = new DrumWidget(parsed);

//if we need to utilise

  