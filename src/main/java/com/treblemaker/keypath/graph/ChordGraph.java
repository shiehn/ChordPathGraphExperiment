package com.treblemaker.keypath.graph;

import com.treblemaker.keypath.database.MidiDB;
import com.treblemaker.keypath.midi.Midi;
import com.treblemaker.keypath.server.model.IdKeyNote;
import com.treblemaker.keypath.server.model.Link;
import com.treblemaker.keypath.server.model.RenderData;
import org.jfugue.pattern.Pattern;

import java.io.IOException;
import java.util.*;

public class ChordGraph {

    private KeyMembers keyMembers;
    private ChordPaths chordPaths;
    private ChordEdges chordEdges;
    private MidiDB midiDB;
    private Midi midi;

    public ChordGraph() {
        this.keyMembers = new KeyMembers();
        this.chordPaths = new ChordPaths();
        this.chordEdges = new ChordEdges();
        this.midiDB = new MidiDB();
        this.midi = new Midi(this.midiDB, this.keyMembers);
    }

    public RenderData create(String sessionId, Integer origin, Integer destination) throws IOException {
        List<Link> edges = this.chordEdges.createEdges(this.keyMembers.getKeyNoteMap());
        List<Link> chordPath = this.chordPaths.generateChordPath(edges, this.keyMembers, origin, destination);
        edges = this.chordPaths.addOrUpdateChordPathLinks(chordPath, edges);

        List<Integer> chordPathIds = getChordPathIds(chordPath);
        List<IdKeyNote> nodes = markFirstNodeOnPath(chordPathIds);

        RenderData renderData = new RenderData(nodes, edges, origin, destination, this.keyMembers.getIdToKeyChordLookup(), chordPathIds);

        Pattern chordPattern = this.midi.createChordPattern(chordPathIds);
        Pattern bassPattern = this.midi.createBassPattern(chordPathIds);
        Pattern treblePattern = this.midi.createTreblePattern(chordPathIds);

        return this.midi.saveMidiFile(renderData, chordPattern, bassPattern, treblePattern, sessionId);
    }

    private List<Integer> getChordPathIds(List<Link> chordPath) {
        List<Integer> chordPathIds = new ArrayList<>();

        for (int i = 0; i< chordPath.size(); i++) {
            if(i == 0){
                chordPathIds.add(chordPath.get(i).Source);
            }

            chordPathIds.add(chordPath.get(i).Target);
        }
        return chordPathIds;
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
