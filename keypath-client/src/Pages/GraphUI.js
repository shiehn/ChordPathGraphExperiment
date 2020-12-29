import React from 'react';
import {Graph} from "react-d3-graph";
import axios from "axios";
import * as Tone from 'tone'
import uuid from 'react-uuid'
import {Midi} from '@tonejs/midi'
import SynthProducer from "../Synths/SynthProducer";
import ReactGA from 'react-ga';

export class GraphUI extends React.Component {
    SESSION_ID = undefined;
    API_ROOT = "http://34.122.124.254:80/"
    // API_ROOT = "http://localhost:80/"
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
    tonePlayers = [];

    currentLoop = -1;
    currentTrebleSynth = -1;
    currentChordSynth = -1;
    currentBassSynth = -1;

    constructor() {
        super();

        this.SESSION_ID = uuid();

        this.state = {
            shuffleSounds: {
                loop: true,
                treble: true,
                chords: true,
                bass: true,
            },
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
                        "hkey": "a#",
                        "note": "a#",
                        "chord": "maj7",
                        "keyAndNote": "a#,a#-maj7",
                        "color": "pink",
                        "labelText": "a#,a#-maj7"
                    },
                ],
                links: [],
            },
            myconfig: {
                initialZoom: 1,
                width: this.getWidth(),
                height: this.getHeight(),
                nodeHighlightBehavior: false,
                node: {
                    labelPosition: 'center',
                    labelProperty: "labelText",
                    strokeColor: "grey",
                    strokeWidth: 1,
                    fontColor: "grey",
                    renderLabel: true,
                    size: 850,
                    highlightStrokeColor: "white",
                },
            }
        }

        this.SYNTH_PRODUCER = new SynthProducer();

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    loadAudioFile = async () => {
        let loopSelection = this.currentLoop;
        if(this.state.shuffleSounds.loop) {
            loopSelection = this.API_ROOT + "output/loops/" + Math.floor(Math.random() * 27) + "-loop.mp3";
            this.currentLoop = loopSelection;
        }

        const audioPlayer = new Tone.Player(loopSelection).toDestination();
        audioPlayer.set({
            volume: -20,
        });

        this.tonePlayers.push(audioPlayer);
    }

    loadGraphData = async () => {
        let max = 83;
        let min = 0;
        this.PATH_DESTINATION = Math.floor(Math.random() * (max - min + 1) + min);

        let resp = await axios.get(`${this.API_ROOT}graph/${this.SESSION_ID}/${this.PATH_ORIGIN}/${this.PATH_DESTINATION}`)
        this.graphData = resp.data.data;
        this.PATH_ORIGIN = resp.data.data.destination;
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

        await this.loadAudioFile();
        await this.loadGraphData();
        await this.loadMidiData();
        await this.renderGraph();
        await this.startSeqence();

        Tone.Transport.bpm.value = 60
        Tone.Transport.start();
    }

    startSeqence = async () => {
        this.disposedUnused();

        let noteTriggerTimeCache = [];

        //SELECT CHORD SYNTH
        let chordSynth = undefined;
        if(this.state.shuffleSounds.chords){
            const {selection, synth} = this.SYNTH_PRODUCER.getRandomChordSynth();
            this.currentChordSynth = selection;
            chordSynth = synth;
        } else {
            const {selection, synth} = this.SYNTH_PRODUCER.getChordSynth(this.currentChordSynth);
            this.currentChordSynth = selection;
            chordSynth = synth;
        }
        this.synthChordStack.push(chordSynth);

        //SCHEDULE CHORD NOTES
        let track = this.midi.tracks[0];
        let notes = track.notes
        let curTime = -1;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].time !== curTime) {
                curTime = notes[i].time;
                this.chordCount++;
            }
            const t = this.preventTimeCollision(Tone.now() + notes[i].time, noteTriggerTimeCache);
            chordSynth.triggerAttackRelease(notes[i].name, notes[i].duration, t, 0.5)
        }

        //SELECT BASS SYNTH
        let bassSynth = undefined;
        if(this.state.shuffleSounds.bass){
            const {selection, synth} = this.SYNTH_PRODUCER.getRandomBassSynth();
            this.currentBassSynth = selection;
            bassSynth = synth;
        } else {
            const {selection, synth} = this.SYNTH_PRODUCER.getBassSynth(this.currentBassSynth);
            this.currentBassSynth = selection;
            bassSynth = synth;
        }
        this.synthBassStack.push(bassSynth);

        //SCHEDULE BASS NOTES
        track = this.midi.tracks[1];
        notes = track.notes
        curTime = -1;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].time !== curTime) {
                curTime = notes[i].time;
            }
            const t = this.preventTimeCollision(Tone.now() + notes[i].time, noteTriggerTimeCache);
            bassSynth.triggerAttackRelease(notes[i].name, notes[i].duration, t, 0.5)
        }

        //SELECT TREBLE SYNTH
        let trebleSynth = undefined;
        if(this.state.shuffleSounds.treble){
            const {selection, synth} = this.SYNTH_PRODUCER.getRandomTrebleSynth();
            this.currentTrebleSynth = selection;
            trebleSynth = synth;
        } else {
            const {selection, synth} = this.SYNTH_PRODUCER.getTrebleSynth(this.currentBassSynth);
            this.currentTrebleSynth = selection;
            trebleSynth = synth;
        }
        this.synthTrebleStack.push(trebleSynth);

        //SCHEDULE TREBLE NOTES
        track = this.midi.tracks[2];
        notes = track.notes
        curTime = -1;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].time !== curTime) {
                curTime = notes[i].time;
            }
            const t = this.preventTimeCollision(Tone.now() + notes[i].time, noteTriggerTimeCache);
            trebleSynth.triggerAttackRelease(notes[i].name, notes[i].duration, t, 0.5)
        }

        //SCHEDULE DRUM LOOP TRIGGERS
        //SCHEDULE NODE UI UPDATES
        for (let i = 0; i < this.state.data.chordpathids.length + 1; i++) {
            Tone.Transport.scheduleOnce(async () => {
                this.tonePlayers[this.tonePlayers.length - 1].start();

                for (let j = 0; j < this.state.data.nodes.length; j++) {
                    if (this.state.data.nodes[j].id === this.state.data.chordpathids[i]) {
                        this.state.data.nodes[j].size = 800;
                        this.state.data.nodes[j].color = "white";

                        this.setState({...this.state.data, nodes: this.state.data.nodes})
                        break;
                    }
                }
            }, this.preventTimeCollision(
                new Tone.Time((this.chordCount - this.state.data.chordpathids.length) + i + ":0:0"),
                noteTriggerTimeCache));
        }

        Tone.Transport.scheduleOnce(async () => {
            //START THE NEW PROGRESSION AT THE END OF THE LAST
            this.shuffleSounds();
            await this.loadAudioFile();
            await this.loadGraphData();
            await this.loadMidiData();
        }, this.preventTimeCollision(new Tone.Time((this.chordCount - 1) + ":0:0"), noteTriggerTimeCache));

        Tone.Transport.scheduleOnce(async () => {
            //START THE NEW PROGRESSION AT THE END OF THE LAST
            await this.renderGraph();
            await this.startSeqence();
        }, this.preventTimeCollision(new Tone.Time((this.chordCount) + ":0:0"), noteTriggerTimeCache));
    }

    shouldShuffle() {
        return Math.random() < 0.5
    }

    shuffleSounds() {
        this.setState({
            ...this.state, shuffleSounds: {
                loop: this.shouldShuffle(),
                treble: this.shouldShuffle(),
                chords: this.shouldShuffle(),
                bass: this.shouldShuffle(),
            }
        })
    }

    disposedUnused() {
        if (this.synthChordStack.length > 0) {
            this.synthChordStack[this.synthChordStack.length - 1].unsync();
            if (this.synthChordStack.length > 1) {
                if (!this.synthChordStack[this.synthChordStack.length - 2].disposed) {
                    this.synthChordStack[this.synthChordStack.length - 2].dispose();
                }
            }
        }

        if (this.synthBassStack.length > 0) {
            this.synthBassStack[this.synthBassStack.length - 1].unsync();
            if (this.synthBassStack.length > 1) {
                if (!this.synthBassStack[this.synthBassStack.length - 2].disposed) {
                    this.synthBassStack[this.synthBassStack.length - 2].dispose();
                }
            }
        }

        if (this.synthTrebleStack.length > 0) {
            this.synthTrebleStack[this.synthTrebleStack.length - 1].unsync();
            if (this.synthTrebleStack.length > 1) {
                if (!this.synthTrebleStack[this.synthTrebleStack.length - 2].disposed) {
                    this.synthTrebleStack[this.synthTrebleStack.length - 2].dispose();
                }
            }
        }

        if (this.tonePlayers.length > 1) {
            if (!this.tonePlayers[this.tonePlayers.length - 2].disposed) {
                this.tonePlayers[this.tonePlayers.length - 2].dispose();
            }
        }
    }

    preventTimeCollision(time, timeCache) {
        if (timeCache.includes(time)) {
            time = time + 0.00001;
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
        this.PATH_ORIGIN = resp.data.data.destination;

        //set browser dims
        resp.data.myconfig.width = this.getWidth();
        resp.data.myconfig.height = this.getHeight();

        this.setState({...this.state, data: resp.data.data, myconfig: resp.data.myconfig, loading: false})
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({...this.state.myconfig, width: this.getWidth(), height: this.getHeight()});
    }

    getHeight() {
        return window.innerHeight;
    }

    getWidth() {
        return window.outerWidth;
    }

    getStartText() {
        if (this.state.data.chordpathids === undefined) {
            return "";
        }

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
        if (!this.state.data.idkeychordmap) {
            return "";
        }

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

    getColorFromKey(key) {
        switch (key) {
            case "a":
                return "green";
            case "a#":
                return "pink";
            case "b":
                return "yellow";
            case "c":
                return "orange";
            case "c#":
                return "black";
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

    getStartColor() {
        if (this.state.data.chordpathids === undefined) {
            return "";
        }

        let startText = ["", ""];
        const keyChord = this.state.data.idkeychordmap[this.state.data.chordpathids[0]];
        if (keyChord !== undefined) {
            startText = keyChord.split(',');
        }

        return this.getColorFromKey(startText[0])
    }

    getDestinationColor() {
        if (this.state.data.chordpathids === undefined) {
            return "";
        }

        let startText = ["", ""];
        const keyChord = this.state.data.idkeychordmap[this.PATH_DESTINATION];
        if (keyChord !== undefined) {
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
                    config={this.state.myconfig}
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



