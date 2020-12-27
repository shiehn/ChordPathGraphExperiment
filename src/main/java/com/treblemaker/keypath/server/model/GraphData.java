package com.treblemaker.keypath.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class GraphData {
    @JsonProperty("nodes")
    public List<IdKeyNote> Nodes = new ArrayList<>();

    @JsonProperty("links")
    public List<Link> Links = new ArrayList<>();

    @JsonProperty("midi")
    public String MidiURL;

    @JsonProperty("origin")
    public Integer Origin;

    @JsonProperty("destination")
    public Integer Destination;

    @JsonProperty("error")
    public String ErrorMessage;

    @JsonProperty("idkeychordmap")
    public Map<Integer, String> IdKeyChordMap;

    @JsonProperty("chordpathids")
    public List<Integer> ChordPathIds;
}
