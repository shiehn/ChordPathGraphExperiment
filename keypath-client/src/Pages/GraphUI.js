import React from 'react';
import {Graph} from "react-d3-graph";
import axios from "axios";
import * as Tone from 'tone'
import uuid from 'react-uuid'
import {Midi} from '@tonejs/midi'
import SynthProducer from "../Synths/SynthProducer";

export class GraphUI extends React.Component {
    SESSION_ID = undefined;
    //API_ROOT = "http://34.122.124.254:80/"
    API_ROOT = "http://localhost:80/"
    PATH_ORIGIN = 0;
    PATH_DESTINATION = 83;
    synthChordStack = [];
    synthBassStack = [];
    synthTrebleStack = [];
    midi = undefined;
    graphData = {}
    chordCount = 0;
    chordIndex = 0;
    SYNTH_PRODUCER;

    constructor() {
        super();

        this.SESSION_ID = uuid();

        this.state = {
            startBtn: {
                isPlaying: false,
                css: "start-btn-overlay-show",
            },
            divStyle: {
                color: 'blue',
            },
            loading: true,
            data: {
                idkeychordmap: {},
                chordpathids: [0],
                nodes: [
                    {
                        "id": 99,
                        "hkey": "as",
                        "note": "as",
                        "chord": "maj7",
                        "keyAndNote": "as,as-maj7",
                        "color": "pink",
                        "labelText": "as,as-maj7"
                    },

                ],
                links: [],
            },

            myConfig: {
                initialZoom: 1,
                width: this.getWidth(),
                height: this.getHeight(),
                //nodeHighlightBehavior: true,
                node: {
                    labelProperty: (node) => {
                        return node.labelText
                    },
                    renderLabel: true,
                    size: 120,
                    highlightStrokeColor: "black",
                },
                link: {
                    highlightColor: "lightblue",
                },
            }
        }

        this.SYNTH_PRODUCER = new SynthProducer();

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }


    loadGraphData = async () => {
        let max = 83;
        let min = 0;
        this.PATH_DESTINATION = Math.floor(Math.random() * (max - min + 1) + min);

        let resp = await axios.get(`${this.API_ROOT}graph/${this.SESSION_ID}/${this.PATH_ORIGIN}/${this.PATH_DESTINATION}`)
        this.graphData = resp.data;
        this.PATH_ORIGIN = resp.data.destination;
    }

    loadMidiData = async () => {
        this.midi = await Midi.fromUrl(`${this.API_ROOT}${this.graphData.midi}`);
    }

    renderGraph = async () => {
        this.setState({...this.state, data: this.graphData, loading: false})
    }

    initAudio = async () => {
        if (this.state.startBtn.isPlaying) {
            return;
        }

        this.setState({
            ...this.state, startBtn: {
                isPlaying: true,
                css: "start-btn-overlay-hide",
            }
        })

        await this.loadGraphData();
        await this.loadMidiData();
        await this.renderGraph();
        await this.startSeqence();

        Tone.Transport.bpm.value = 60
        Tone.Transport.start();
    }

    startSeqence = async () => {
        if (this.synthChordStack.length > 0) {
            this.synthChordStack[this.synthChordStack.length - 1].unsync();
        }

        if (this.synthBassStack.length > 0) {
            this.synthBassStack[this.synthBassStack.length - 1].unsync();
        }

        if (this.synthTrebleStack.length > 0) {
            this.synthTrebleStack[this.synthTrebleStack.length - 1].unsync();
        }

        let chordSynth = this.SYNTH_PRODUCER.getRandomChordSynth();
        this.synthChordStack.push(chordSynth);


        let bassSynth = this.SYNTH_PRODUCER.getRandomBassSynth();
        this.synthBassStack.push(bassSynth);

        let trebleSynth = this.SYNTH_PRODUCER.getRandomTrebleSynth();
        this.synthTrebleStack.push(trebleSynth);

        let noteCache = [];

        //CHORD NOTES
        let track = this.midi.tracks[0];
        let notes = track.notes
        let curTime = -1;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].time !== curTime) {
                curTime = notes[i].time;
                this.chordCount++;
            }

            const t = this.preventTimeCollision(Tone.now() + notes[i].time, noteCache);

            chordSynth.triggerAttackRelease(notes[i].name, notes[i].duration, t, 0.5)
        }

        //BASS NOTES
        track = this.midi.tracks[1];
        notes = track.notes
        curTime = -1;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].time !== curTime) {
                curTime = notes[i].time;
            }

            const t = this.preventTimeCollision(Tone.now() + notes[i].time, noteCache);

            bassSynth.triggerAttackRelease(notes[i].name, notes[i].duration, t, 0.5)
        }

        //TREBLE NOTES
        track = this.midi.tracks[2];
        notes = track.notes
        curTime = -1;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].time !== curTime) {
                curTime = notes[i].time;
            }

            const t = this.preventTimeCollision(Tone.now() + notes[i].time, noteCache);

            trebleSynth.triggerAttackRelease(notes[i].name, notes[i].duration, t, 0.5)
        }

        for (let i = 0; i < this.state.data.chordpathids.length; i++) {
            Tone.Transport.scheduleOnce(async () => {
                for (let j = 0; j < this.state.data.nodes.length; j++) {
                    if (this.state.data.nodes[j].id === this.state.data.chordpathids[i]) {
                        this.state.data.nodes[j].size = 700;
                        this.state.data.nodes[j].color = "white";

                        this.setState({...this.state.data, nodes: this.state.data.nodes})
                        break;
                    }
                }
            }, this.preventTimeCollision(
                new Tone.Time((this.chordCount - this.state.data.chordpathids.length) + i + ":0:0"),
                noteCache));
        }

        Tone.Transport.scheduleOnce(async () => {
            //START THE NEW PROGRESSION AT THE END OF THE LAST
            await this.loadGraphData();
            await this.loadMidiData();
        }, this.preventTimeCollision(new Tone.Time((this.chordCount - 1) + ":0:0"), noteCache));

        Tone.Transport.scheduleOnce(async () => {
            //START THE NEW PROGRESSION AT THE END OF THE LAST
            await this.renderGraph();
            await this.startSeqence();
        }, this.preventTimeCollision(new Tone.Time((this.chordCount) + ":0:0"), noteCache));
    }

    preventTimeCollision(time, timeCache) {
        if (timeCache.includes(time)) {
            time = time + 0.05;
        }

        timeCache.push(time)
        return time
    }

    async componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        let max = 83;
        let min = 0;
        this.PATH_DESTINATION = Math.floor(Math.random() * (max - min + 1) + min);

        let resp = await axios.get(`${this.API_ROOT}graph/${this.SESSION_ID}/${this.PATH_ORIGIN}/${this.PATH_DESTINATION}`);
        this.PATH_ORIGIN = resp.data.destination;

        this.setState({...this.state, data: resp.data, loading: false})
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({...this.state, myConfig: {width: this.getWidth(), height: this.getHeight()}});
    }

    getHeight() {
        return window.innerHeight;
    }

    getWidth() {
        return window.outerWidth;
    }

    getStartText() {
        let startText = ["", ""];
        const keyChord = this.state.data.idkeychordmap[this.state.data.chordpathids[0]];
        if (keyChord) {
            startText = keyChord.split(',');
        }

        let chordNoteType = ["", ""]
        if (startText[1]) {
            chordNoteType = startText[1].split('-');
        }

        return chordNoteType[0].toUpperCase() + chordNoteType[1];
    }

    getDestinationText() {
        let startText = ["", ""];
        const keyChord = this.state.data.idkeychordmap[this.PATH_DESTINATION];
        if (keyChord) {
            startText = keyChord.split(',');
        }

        let chordNoteType = ["", ""]
        if (startText[1]) {
            chordNoteType = startText[1].split('-');
        }

        return chordNoteType[0].toUpperCase() + chordNoteType[1];
    }

    getColorFromKey(key){
        switch(key) {
            case "a":
                return "green";
            case "a#":
                return "pink";
            case "b":
                return "yellow";
            case "c":
                return "orange";
            case "d":
                return "red";
            case "d#":
                return "maroon";
            case "e":
                return "teal";
            case "f":
                return "brown";
            case "f#":
                return "purple";
            case "g":
                return "lime";
            case "g#":
                return "blue";
            default:
                return ''
        }
    }

    getStartColor(){
        let startText = ["", ""];
        const keyChord = this.state.data.idkeychordmap[this.state.data.chordpathids[0]];
        if (keyChord) {
            startText = keyChord.split(',');
        }

        return this.getColorFromKey(startText[0])
    }

    getDestinationColor(){
        let startText = ["", ""];
        const keyChord = this.state.data.idkeychordmap[this.PATH_DESTINATION];
        if (keyChord) {
            startText = keyChord.split(',');
        }

        return this.getColorFromKey(startText[0])
    }

    render() {
        return <div style={this.state.divStyle} className={this.state.startBtn.css} onClick={this.initAudio}>
            <div className="bottomright">
                <div className="bottomborder">
                    <div className="bottomrightcircle" style={{background: this.getStartColor()}}></div>
                    <div className="bottomtext">&nbsp;{this.getStartText()}</div>
                </div>
                <div className="emoji">➡️</div>
                <div className="bottomborder">
                    <div className="bottomrightcircle" style={{background: this.getDestinationColor()}}></div>
                    <div className="bottomtext">&nbsp;{this.getDestinationText()}</div>
                </div>
            </div>
            {
                this.state.loading ? <div>Loading...</div> : <Graph
                    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                    data={this.state.data}
                    config={this.state.myConfig}
                />
            }
            <div className="bottomleft">
                <ol className="custom-bullet medals">
                    <li><b>A</b> major</li>
                    <li><b>A#</b> major</li>
                    <li><b>B</b> major</li>
                    <li><b>C</b> major</li>
                    <li><b>C#</b> major</li>
                    <li><b>D</b> major</li>
                    <li><b>D#</b> major</li>
                    <li><b>E</b> major</li>
                    <li><b>F</b> major</li>
                    <li><b>F#</b> major</li>
                    <li><b>G</b> major</li>
                    <li><b>G#</b> major</li>
                </ol>
            </div>
        </div>
    }
}



