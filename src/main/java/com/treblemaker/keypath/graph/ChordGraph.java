package com.treblemaker.keypath.graph;

import com.treblemaker.keypath.database.MidiDB;
import com.treblemaker.keypath.server.model.IdKeyNote;
import com.treblemaker.keypath.server.model.Link;
import com.treblemaker.keypath.server.model.RenderData;
import org.jfugue.midi.MidiFileManager;
import org.jfugue.pattern.Pattern;
import org.jfugue.pattern.PatternProducer;
import org.jfugue.player.Player;
import play.mvc.WebSocket;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class ChordGraph {

    private KeyMembers keyMembers;
    private ChordPaths chordPaths;
    private ChordEdges chordEdges;
    private MidiDB midiDB;

    public ChordGraph() {
        this.keyMembers = new KeyMembers();
        this.chordPaths = new ChordPaths();
        this.chordEdges = new ChordEdges();
        this.midiDB = new MidiDB();
    }

    public RenderData createGraph(String sessionId, Integer origin, Integer destination) throws IOException {
        List<Link> edges = this.chordEdges.createEdges(this.keyMembers.getKeyNoteMap());
        List<Link> chordPath = this.chordPaths.generateChordPath(edges, this.keyMembers, origin, destination);
        List<Integer> chordPathIds = new ArrayList<>();

        for (int i=0; i<chordPath.size(); i++) {
            if(i == 0){
                chordPathIds.add(chordPath.get(i).Source);
            }

            chordPathIds.add(chordPath.get(i).Target);
        }

        edges = this.chordPaths.addOrUpdateChordPathLinks(chordPath, edges);

        //INCREASE THE SIZE OF THE FIRST NODE:
        List<IdKeyNote> nodes = markFirstNodeOnPath(chordPathIds);

        RenderData renderData = new RenderData(nodes, edges, origin, destination, this.keyMembers.getIdToKeyChordLookup(), chordPathIds);

        String chordStrPattern = createChordStrPattern(chordPath);
        String bassStrPattern = createBassStrPattern(chordPath);
        String trebleStrPattern = createTrebleStrPattern(chordPath);

        System.out.println("************************************************");
        System.out.println(chordStrPattern);
        System.out.println(bassStrPattern);
        System.out.println("************************************************");

        Pattern chordPattern = new Pattern("V0 I[Piano] " + chordStrPattern).setTempo(60);
        Pattern bassPattern = new Pattern("V1 I[Cello] " + bassStrPattern).setTempo(60);
        Pattern treblePattern = new Pattern("V2 I[Flute] " + trebleStrPattern).setTempo(60);;

        return saveMidiFile(renderData, chordPattern, bassPattern, treblePattern, sessionId);
    }

    private String createChordStrPattern(List<Link> chordPath) {
        String chordString = "";
        for(int i = 0; i< chordPath.size(); i++){
            if(i == 0) {
                chordString = this.keyMembers.getById(chordPath.get(i).Source).Note;
                chordString = chordString + this.keyMembers.getById(chordPath.get(i).Source).Chord + "w ";
            }

            chordString = chordString + this.keyMembers.getById(chordPath.get(i).Target).Note;
            chordString = chordString + this.keyMembers.getById(chordPath.get(i).Target).Chord + "w ";
        }
        return chordString.trim();
    }

    private String createBassStrPattern(List<Link> chordPath) {
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

        return bassString.trim();
    }

    private String createTrebleStrPattern(List<Link> chordPath) {
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

        return trebleString.trim();
    }

    private List<IdKeyNote> markFirstNodeOnPath(List<Integer> chordPathIds) {
        List<IdKeyNote> nodes = this.keyMembers.getAllKeys();
        for (int i=0; i<nodes.size(); i++) {
           if(chordPathIds.get(0) == nodes.get(i).Id){
               nodes.get(i).Size = 850;
               nodes.get(i).Color = "white";
               break;
           }
        }
        return nodes;
    }

    private RenderData saveMidiFile(RenderData renderData, PatternProducer chordPattern, PatternProducer bassPattern, PatternProducer treblePattern, String sessionID) throws IOException {
        String midiId = UUID.randomUUID().toString();
        String fileName = String.format("%s$%s.mid", (new Date()).getTime(), midiId);
        String sessionPath = this.midiDB.createMidiFilePath(sessionID);

        try {
            //MidiFileManager.savePatternToMidi(pattern, new File(sessionPath + "/" + fileName));
            MidiFileManager.save(new Player().getSequence(chordPattern, bassPattern, treblePattern), new File(sessionPath + "/" + fileName));
            renderData.data.MidiURL = String.format("midi/%s/%s", sessionID, midiId);
        } catch (Exception e){
            renderData.data.ErrorMessage = "failed to generate Midi data";
            System.out.println("ERROR: " + e.toString());
        }

        return renderData;
    }
}



/*
Encoding format
Each bar consists of a 72 digit encoding

[key][chords][bar1][bar2][bar3][bar4]
KEY EXAMPLE
[F-sharp] = [62]

CHORDS EXAMPLE
[G-major-7 | eb minor] = [713501]

BAR EXAMPLE
Each beat in a bar: [NOTE-SHARP-OCATAVE-LIFECYCLE]
[g-sharp-quarter | rest-quarter | d-quarter | e-eighth | f-eight] = [7140-7141-7141-7141--0000-0000-0000-0000--4140-4141-4141-4141--5140-5141-6140-6140]

NOTES:
0 | Rest
1 | a
2 | b
3 | c
4 | d
5 | e
6 | f
7 | g

FLAT/NATURAL/SHARP
0 - FLAT | 1 - NATURAL | 2 - SHARP

OCTAVES
0-5

NOTE LIFE_CYCLE
0 - START | 1 - SUSTAIN

CHORD TYPES
0 | maj
1 | min
2 | dim
3 | maj7
4 | min7
5 | dom7
6 | min7b5
#### CHORD TYPE

START/SUSTAIN
0 - START | 1 - SUSTAIN
 */
