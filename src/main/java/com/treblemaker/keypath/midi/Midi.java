package com.treblemaker.keypath.midi;

import com.treblemaker.keypath.database.MidiDB;
import com.treblemaker.keypath.graph.KeyMembers;
import com.treblemaker.keypath.server.model.RenderData;
import org.jfugue.midi.MidiFileManager;
import org.jfugue.pattern.Pattern;
import org.jfugue.pattern.PatternProducer;
import org.jfugue.player.Player;
import org.jfugue.theory.Chord;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class Midi {

    private MidiDB midiDB;
    private KeyMembers keyMembers;
    private Arpeggiator arpeggiator;

    public Midi(MidiDB midiDB, KeyMembers keyMembers){
        this.midiDB = midiDB;
        this.keyMembers = keyMembers;
        this.arpeggiator = new Arpeggiator();
    }

    public Pattern createChordPattern(List<Integer> chordPathIds) {
        String chordString = "";
        for(int i = 0; i< chordPathIds.size(); i++){
            chordString = chordString + this.keyMembers.getById(chordPathIds.get(i)).Note;
            chordString = chordString + this.keyMembers.getById(chordPathIds.get(i)).Chord + "w ";
        }

        return new Pattern("V0 I[Piano] " + chordString.trim()).setTempo(60);
    }

    public Pattern createBassPattern(List<Integer> chordPathIds) {
        String OCTAVE = "2";

        List<Chord> jfChords = new ArrayList<>();
        for(int i = 0; i< chordPathIds.size(); i++){
            Chord chord = new Chord(this.keyMembers.getById(chordPathIds.get(i)).Note + this.keyMembers.getById(chordPathIds.get(i)).Chord);
            jfChords.add(chord);
        }

        String bassString = arpeggiator.createTrebleArpeggio(new ArpeggiosBass().getRandomType(), OCTAVE, jfChords);

        return new Pattern("V1 I[Cello] " + bassString.trim()).setTempo(60);
    }

    public Pattern createTreblePattern(List<Integer> chordPathIds) {
        String OCTAVE = "6";

        List<Chord> jfChords = new ArrayList<>();
        for(int i = 0; i< chordPathIds.size(); i++){
            Chord chord = new Chord(this.keyMembers.getById(chordPathIds.get(i)).Note + this.keyMembers.getById(chordPathIds.get(i)).Chord);
            jfChords.add(chord);
        }

        String trebleString = arpeggiator.createTrebleArpeggio(new ArpeggiosTreble().getRandomType(), OCTAVE, jfChords);

        return new Pattern("V2 I[Flute] " + trebleString.trim());
    }

    public RenderData saveMidiFile(RenderData renderData, PatternProducer chordPattern, PatternProducer bassPattern, PatternProducer treblePattern, String sessionID) throws IOException {
        String midiId = UUID.randomUUID().toString();
        String fileName = String.format("%s$%s.mid", (new Date()).getTime(), midiId);
        String sessionPath = this.midiDB.createMidiFilePath(sessionID);

        MidiFileManager.save(new Player().getSequence(chordPattern, bassPattern, treblePattern), new File(sessionPath + "/" + fileName));
        renderData.data.MidiURL = String.format("midi/%s/%s", sessionID, midiId);

        return renderData;
    }
}
