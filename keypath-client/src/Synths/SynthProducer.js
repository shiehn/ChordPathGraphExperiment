import * as Tone from "tone";

export default class SynthProducer {
    getRandomBassSynth() {
        const numOfSynths = 4;
        let bassSynth;
        const selection = Math.floor(Math.random() * numOfSynths);
        // console.log("BASS-SYNTH", selection)
        switch (selection) {
            //     switch (3) {
            case 0:
                bassSynth = new Tone.AMSynth();
                bassSynth.toDestination();
                bassSynth.volume.value = -8;

                return bassSynth;
            case 1:
                bassSynth = new Tone.FMSynth();
                bassSynth.toDestination();
                bassSynth.volume.value = -15;

                return bassSynth;
            case 2:
                bassSynth = new Tone.MonoSynth();
                bassSynth.toDestination();
                bassSynth.volume.value = -25;

                return bassSynth;
            case 3:
                bassSynth = new Tone.Synth();
                bassSynth.toDestination();
                bassSynth.volume.value = -10;

                return bassSynth;
        }
    }

    getRandomChordSynth() {
        const numOfSynths = 3;
        let chordSynth;
        const selection = Math.floor(Math.random() * numOfSynths);
        // console.log("CHORD-SYNTH", selection)
        switch (selection) {
            // switch (2) {
            case 0:
                chordSynth = new Tone.AMSynth().toDestination();
                chordSynth.volume.value = -30;

                const tremolo = new Tone.Tremolo(4, 0.75).toDestination().start();
                const phaser = new Tone.Phaser({
                    "frequency": 6,
                    "octaves": 5,
                    "baseFrequency": 1000
                }).toDestination();
                const autoWah = new Tone.AutoWah(50, 6, -30).toDestination();
                const pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();

                chordSynth.chain(pingPong, autoWah, phaser, tremolo);
                return chordSynth;
            case 1:
                chordSynth = new Tone.PolySynth().toDestination();
                chordSynth.volume.value = -20;

                const autoFilter = new Tone.AutoFilter("4n").toDestination().start();
                const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();

                chordSynth.chain(autoFilter, feedbackDelay);
                return chordSynth;
            case 2:
                chordSynth = new Tone.PolySynth().toDestination();
                chordSynth.volume.value = -40;

                const chorus = new Tone.Chorus(4, 2.5, 0.5);
                const reverb = new Tone.JCReverb(0.7).toDestination();

                chordSynth.chain(chorus, reverb);
                return chordSynth;
        }
    }

    getRandomTrebleSynth() {
        const numOfSynths = 4;
        let chordSynth;
        const selection = Math.floor(Math.random() * numOfSynths);
        // console.log("TREBLE-SYNTH", selection)
        switch (selection) {
        // switch (2) {
            case 0:
                chordSynth = new Tone.AMSynth().toDestination();
                chordSynth.volume.value = -30;

                const tremolo = new Tone.Tremolo(4, 0.75).toDestination().start();
                const phaser = new Tone.Phaser({
                    "frequency": 6,
                    "octaves": 5,
                    "baseFrequency": 1000
                }).toDestination();
                const autoWah = new Tone.AutoWah(50, 6, -30).toDestination();
                const pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();

                chordSynth.chain(pingPong, autoWah, phaser, tremolo);

                return chordSynth;
            case 1:
                chordSynth = new Tone.PolySynth().toDestination();
                chordSynth.volume.value = -30;

                const autoFilter = new Tone.AutoFilter("4n").toDestination().start();
                // const cheby = new Tone.Chebyshev(50).toDestination();
                const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();

                chordSynth.chain(autoFilter, feedbackDelay);

                return chordSynth;
            case 2:
                chordSynth = new Tone.MonoSynth().toDestination();
                chordSynth.volume.value = -40;

                //const autoFilter = new Tone.AutoFilter("4n").toDestination().start();
                // const cheby = new Tone.Chebyshev(50).toDestination();
                // const chorus = new Tone.Chorus(4, 2.5, 0.5);
                const reverb = new Tone.JCReverb(0.8).toDestination();
                //const shift = new Tone.FrequencyShifter(42).toDestination();
                // const autoWah1 = new Tone.AutoWah(50, 6, -30).toDestination();
                const pingPong1 = new Tone.PingPongDelay("4n", 0.1).toDestination();

                chordSynth.chain(pingPong1, reverb);

                return chordSynth;
            case 3:
                chordSynth = new Tone.MembraneSynth().toDestination();
                chordSynth.volume.value = -50;

                //const autoFilter = new Tone.AutoFilter("4n").toDestination().start();
                // const cheby = new Tone.Chebyshev(50).toDestination();
                // const chorus = new Tone.Chorus(4, 2.5, 0.5);
                const reverb1 = new Tone.JCReverb(0.8).toDestination();
                //const shift = new Tone.FrequencyShifter(42).toDestination();
                // const autoWah1 = new Tone.AutoWah(50, 6, -30).toDestination();
                // const pingPong2 = new Tone.PingPongDelay("4n", 0.1).toDestination();
                // const feedbackDelay1 = new Tone.FeedbackDelay("1m", 0.1).toDestination();
                // const tremol1 = new Tone.Tremolo(4, 0.75).toDestination().start();
                chordSynth.chain(reverb1);

                return chordSynth;
        }
    }
}
