import React from 'react';
import {Graph} from "react-d3-graph";
import axios from "axios";
import * as Tone from 'tone'
import uuid from 'react-uuid'
import {Midi} from '@tonejs/midi'

export class GraphUI extends React.Component {
    SESSION_ID = undefined;
    //API_ROOT = "http://34.122.124.254:80/"
    API_ROOT = "http://localhost:80/"
    PATH_ORIGIN = 0;
    PATH_DESTINATION = 83;
    synthStack = []
    midi = undefined;
    graphData = {}
    chordCount = 0
    chordIndex = 0

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
                height:  this.getHeight(),
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
        if (this.synthStack.length > 0) {
            console.log('this.synthStack.length', this.synthStack.length)
            this.synthStack[this.synthStack.length - 1].unsync();
            //this.synthStack[this.synthStack.length-1].dispose();
        }

        let curSynth = new Tone.PolySynth(Tone.AMSynth);
        this.synthStack.push(curSynth);

        curSynth.toDestination();
        curSynth.volume.value = -20;

        const track = this.midi.tracks[0];
        const notes = track.notes

        //let chordCount = 0;
        let curTime = -1;
        for (let i = 0; i < notes.length; i++) {
            // if (i == notes.length - 1) {
                // console.log("NOTE TIME: ", notes[i])
                // console.log("NOTE TIME: ", notes[i].time)
                // console.log("NOTE DUR: ", notes[i].duration)
            // }

            if (notes[i].time !== curTime) {
                curTime = notes[i].time;
                this.chordCount++;
            }

            curSynth.triggerAttackRelease(notes[i].name, notes[i].duration, Tone.now() + notes[i].time, 0.5)
        }


        //the control changes are an object
        //the keys are the CC number
        //track.controlChanges[64]
        //they are also aliased to the CC number's common name (if it has one)
        // track.controlChanges.sustain.forEach(cc => {
        //     // cc.ticks, cc.value, cc.time
        // })

        // var tremolo = new Tone.Tremolo(4, 0.75).toDestination().start();
        // var phaser = new Tone.Phaser({
        //     "frequency" : 6,
        //     "octaves" : 5,
        //     "baseFrequency" : 1000
        // }).toMaster();
        // const autoWah = new Tone.AutoWah(50, 6, -30).toDestination();
        // const pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();
        //
        // synth.chain(pingPong, autoWah, phaser, tremolo)

        //alert(notes.length)

        // Tone.Transport.scheduleOnce(async () => {
        //     console.log("Half FINISHED")
        //     //START LOADING THE GRAPH DATA HALFWAY THROUGH CURRENT PROGRESSION
        //     await this.loadGraphData();
        // }, (Tone.now() + notes[notes.length-1].time + notes[notes.length-1].duration) / 2)

        // Tone.Transport.scheduleOnce(async () => {
        //     alert("FINISHED")
        //     //START LOADING THE GRAPH DATA HALFWAY THROUGH CURRENT PROGRESSION
        //     await this.loadGraphData();
        // }, (Tone.now() + notes[notes.length-1].time) + notes[notes.length-1].duration))

        for (let i = 0; i < this.state.data.chordpathids.length; i++) {
            Tone.Transport.scheduleOnce(async () => {
                for(let j=0; j<this.state.data.nodes.length; j++){
                    if(this.state.data.nodes[j].id === this.state.data.chordpathids[i]) {

                        this.state.data.nodes[j].size = 700;
                        this.state.data.nodes[j].color = "white";

                        this.setState({...this.state.data, nodes: this.state.data.nodes})
                        break;
                    }
                }
            }, new Tone.Time((this.chordCount) - this.state.data.chordpathids.length) + i + ":0:0");
        }

        Tone.Transport.scheduleOnce(async () => {
            //START THE NEW PROGRESSION AT THE END OF THE LAST
            await this.loadGraphData();
            await this.loadMidiData();
        }, new Tone.Time((this.chordCount - 1) + ":0:0"));

        Tone.Transport.scheduleOnce(async () => {
            //START THE NEW PROGRESSION AT THE END OF THE LAST
            await this.renderGraph();
            await this.startSeqence();
        }, new Tone.Time((this.chordCount) + ":0:0"));


        //  console.log("midi", midi)
        //
        //  // make sure you set the tempo before you schedule the events
        //  Tone.Transport.bpm.value = 60
        //
        //
        //  // pass in the note events from one of the tracks as the second argument to Tone.Part
        //  var midiPart = new Tone.Part(function(time, note) {
        //
        //      //use the events to play the synth
        //      synth.triggerAttackRelease(note.name, note.duration, time, 0.5)
        //
        //  }, midi.tracks[0].notes).start()
        //


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
        this.setState({ ...this.state, myConfig: { width: this.getWidth(), height:  this.getHeight() }});
    }

    getHeight() {
        return window.innerHeight;
    }

    getWidth() {
        return window.outerWidth;
    }

    render() {
        return <div style={this.state.divStyle} className={this.state.startBtn.css} onClick={this.initAudio}>
            {/*<div>*/}
            {/*    CHORD PATH IDS: {this.state.data.chordpathids.join(",")}*/}
            {/*    Destination: {this.state.data.idkeychordmap[this.PATH_DESTINATION]}*/}
            {/*</div>*/}
            {
                this.state.loading ? <div>Loading...</div> : <Graph
                    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                    data={this.state.data}
                    config={this.state.myConfig}
                />
            }
        </div>
    }
}



