package com.treblemaker.keypath.midi;

import com.treblemaker.keypath.database.MidiDB;
import com.treblemaker.keypath.graph.KeyMembers;
import com.treblemaker.keypath.server.model.Link;
import com.treblemaker.keypath.server.model.RenderData;
import org.jfugue.midi.MidiFileManager;
import org.jfugue.pattern.Pattern;
import org.jfugue.pattern.PatternProducer;
import org.jfugue.player.Player;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class Midi {

    private MidiDB midiDB;
    private KeyMembers keyMembers;

    public Midi(MidiDB midiDB, KeyMembers keyMembers){
        this.midiDB = midiDB;
        this.keyMembers = keyMembers;
    }

    public Pattern createChordPattern(List<Link> chordPath) {
        String chordString = "";
        for(int i = 0; i< chordPath.size(); i++){
            if(i == 0) {
                chordString = this.keyMembers.getById(chordPath.get(i).Source).Note;
                chordString = chordString + this.keyMembers.getById(chordPath.get(i).Source).Chord + "w ";
            }

            chordString = chordString + this.keyMembers.getById(chordPath.get(i).Target).Note;
            chordString = chordString + this.keyMembers.getById(chordPath.get(i).Target).Chord + "w ";
        }

        return new Pattern("V0 I[Piano] " + chordString.trim()).setTempo(60);
    }

    public Pattern createBassPattern(List<Link> chordPath) {
        String OCTAVE = "2";

        Map<String, Integer> rhythmTypes = new HashMap<>();
        rhythmTypes.put("q ", 4);
        rhythmTypes.put("h ", 2);
        rhythmTypes.put("w ", 1);

        Set<String> keySet = rhythmTypes.keySet();
        List<String> keyList = new ArrayList<>(keySet);

        int randIdx = new Random().nextInt(keyList.size());
        String randomRhytmType = keyList.get(randIdx);
        Integer randomValue = rhythmTypes.get(randomRhytmType);

        String bassString = "";
        for(int i = 0; i< chordPath.size(); i++){
            if(i == 0) {
                for(int j=0; j<randomValue; j++) {
                    bassString = bassString + this.keyMembers.getById(chordPath.get(i).Source).Note + OCTAVE + randomRhytmType;
                }
            }

            for(int j=0; j<randomValue; j++) {
                bassString = bassString + this.keyMembers.getById(chordPath.get(i).Target).Note + OCTAVE + randomRhytmType;
            }
        }

        return new Pattern("V1 I[Cello] " + bassString.trim()).setTempo(60);
    }

    public Pattern createTreblePattern(List<Link> chordPath) {
        String OCTAVE = "6";

        Map<String, Integer> rhythmTypes = new HashMap<>();
        rhythmTypes.put("i ", 8);
        rhythmTypes.put("q ", 4);
        rhythmTypes.put("h ", 2);
        rhythmTypes.put("w ", 1);

        Set<String> keySet = rhythmTypes.keySet();
        List<String> keyList = new ArrayList<>(keySet);

        int randIdx = new Random().nextInt(keyList.size());
        String randomRhytmType = keyList.get(randIdx);
        Integer randomValue = rhythmTypes.get(randomRhytmType);

        String trebleString = "";
        for(int i = 0; i< chordPath.size(); i++){
            if(i == 0) {
                for(int j=0; j<randomValue; j++) {
                    trebleString = trebleString + this.keyMembers.getById(chordPath.get(i).Source).Note + OCTAVE + randomRhytmType;
                }
            }

            for(int j=0; j<randomValue; j++) {
                trebleString = trebleString + this.keyMembers.getById(chordPath.get(i).Target).Note + OCTAVE + randomRhytmType;
            }
        }

        return new Pattern("V2 I[Flute] " + trebleString.trim()).setTempo(60);
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
