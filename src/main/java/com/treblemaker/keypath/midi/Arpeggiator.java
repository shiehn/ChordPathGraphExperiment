package com.treblemaker.keypath.midi;

import org.jfugue.theory.Chord;

import java.util.List;

public class Arpeggiator {
    private ArpeggiosTreble arpeggiosTreble = new ArpeggiosTreble();
    private ArpeggiosBass arpeggiosBass = new ArpeggiosBass();

    public Arpeggiator(){
    }

    public String createTrebleArpeggio(String type, String octave, List<Chord> chords) {
        //select random arpeggio from type
        Integer[] selectedArpeggio = this.arpeggiosTreble.getRandomByType(type);

        int arpIndex = 0;

        String noteStr = "";
        // iterate the chords and create the notes
        for(int i=0; i<chords.size(); i++){
            for(int j=0; j<selectedArpeggio.length; j++){
                int index = selectedArpeggio[j];
                if(chords.get(i).getNotes().length < 4) {
                    if(index == 3) {
                        index = 0;
                    }
                }

                noteStr = noteStr + chords.get(i).getNotes()[index] + octave + type + " ";
                arpIndex++;
            }
        }

        return noteStr;
    }

    public String createBassArpeggio(String type, String octave, List<Chord> chords) {
        //select random arpeggio from type
        Integer[] selectedArpeggio = this.arpeggiosBass.getRandomByType(type);

        int arpIndex = 0;

        String noteStr = "";
        // iterate the chords and create the notes
        for(int i=0; i<chords.size(); i++){
            for(int j=0; j<selectedArpeggio.length; j++){
                int index = selectedArpeggio[j];
                if(chords.get(i).getNotes().length < 4) {
                    if(index == 3) {
                        index = 0;
                    }
                }

                noteStr = noteStr + chords.get(i).getNotes()[index] + octave + type + " ";
                arpIndex++;
            }
        }

        return noteStr;
    }
}
