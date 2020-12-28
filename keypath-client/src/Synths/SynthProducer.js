import * as Tone from "tone";

export default class SynthProducer {
    getRandomBassSynth() {
        const numOfSynths = 4;
        const selection = Math.floor(Math.random() * numOfSynths);
        return this.getBassSynth(selection);
    }

    getBassSynth(selection) {
        let bassSynth;
        switch (selection) {
            case 0:
                bassSynth = new Tone.AMSynth();
                bassSynth.toDestination();
                bassSynth.volume.value = -8;

                return {selection: selection, synth: bassSynth};
            case 1:
                bassSynth = new Tone.FMSynth();
                bassSynth.toDestination();
                bassSynth.volume.value = -15;

                return {selection: selection, synth: bassSynth};
            case 2:
                bassSynth = new Tone.MonoSynth();
                bassSynth.toDestination();
                bassSynth.volume.value = -25;

                return {selection: selection, synth: bassSynth};
            case 3:
                bassSynth = new Tone.Synth();
                bassSynth.toDestination();
                bassSynth.volume.value = -10;

                return {selection: selection, synth: bassSynth};
        }
    }

    getRandomChordSynth() {
        const numOfSynths = 3;
        const selection = Math.floor(Math.random() * numOfSynths);
        return this.getChordSynth(selection);
    }

    getChordSynth(selection) {
        let chordSynth;
        switch (selection) {
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
                return {selection: selection, synth: chordSynth};
            case 1:
                chordSynth = new Tone.PolySynth().toDestination();
                chordSynth.volume.value = -20;

                const autoFilter = new Tone.AutoFilter("4n").toDestination().start();
                const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();

                chordSynth.chain(autoFilter, feedbackDelay);
                return {selection: selection, synth: chordSynth};
            case 2:
                chordSynth = new Tone.PolySynth().toDestination();
                chordSynth.volume.value = -40;

                const chorus = new Tone.Chorus(4, 2.5, 0.5);
                const reverb = new Tone.JCReverb(0.7).toDestination();

                chordSynth.chain(chorus, reverb);
                return {selection: selection, synth: chordSynth};
        }
    }

    getRandomTrebleSynth() {
        const numOfSynths = 4;
        const selection = Math.floor(Math.random() * numOfSynths);
        return this.getTrebleSynth(selection);
    }

    getTrebleSynth(selection) {
        let trebleSynth;
        switch (selection) {
            case 0:
                trebleSynth = new Tone.AMSynth().toDestination();
                trebleSynth.volume.value = -30;

                const tremolo = new Tone.Tremolo(4, 0.75).toDestination().start();
                const phaser = new Tone.Phaser({
                    "frequency": 6,
                    "octaves": 5,
                    "baseFrequency": 1000
                }).toDestination();
                const autoWah = new Tone.AutoWah(50, 6, -30).toDestination();
                const pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();

                trebleSynth.chain(pingPong, autoWah, phaser, tremolo);

                return {selection: selection, synth: trebleSynth};
            case 1:
                trebleSynth = new Tone.PolySynth().toDestination();
                trebleSynth.volume.value = -30;

                const autoFilter = new Tone.AutoFilter("4n").toDestination().start();
                // const cheby = new Tone.Chebyshev(50).toDestination();
                const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();

                trebleSynth.chain(autoFilter, feedbackDelay);

                return {selection: selection, synth: trebleSynth};
            case 2:
                trebleSynth = new Tone.MonoSynth().toDestination();
                trebleSynth.volume.value = -40;

                //const autoFilter = new Tone.AutoFilter("4n").toDestination().start();
                // const cheby = new Tone.Chebyshev(50).toDestination();
                // const chorus = new Tone.Chorus(4, 2.5, 0.5);
                const reverb = new Tone.JCReverb(0.8).toDestination();
                //const shift = new Tone.FrequencyShifter(42).toDestination();
                // const autoWah1 = new Tone.AutoWah(50, 6, -30).toDestination();
                const pingPong1 = new Tone.PingPongDelay("4n", 0.1).toDestination();

                trebleSynth.chain(pingPong1, reverb);

                return {selection: selection, synth: trebleSynth};
            case 3:
                trebleSynth = new Tone.MembraneSynth().toDestination();
                trebleSynth.volume.value = -50;

                //const autoFilter = new Tone.AutoFilter("4n").toDestination().start();
                // const cheby = new Tone.Chebyshev(50).toDestination();
                // const chorus = new Tone.Chorus(4, 2.5, 0.5);
                const reverb1 = new Tone.JCReverb(0.8).toDestination();
                //const shift = new Tone.FrequencyShifter(42).toDestination();
                // const autoWah1 = new Tone.AutoWah(50, 6, -30).toDestination();
                // const pingPong2 = new Tone.PingPongDelay("4n", 0.1).toDestination();
                // const feedbackDelay1 = new Tone.FeedbackDelay("1m", 0.1).toDestination();
                // const tremol1 = new Tone.Tremolo(4, 0.75).toDestination().start();
                trebleSynth.chain(reverb1);

                return {selection: selection, synth: trebleSynth};
        }
    }
}
