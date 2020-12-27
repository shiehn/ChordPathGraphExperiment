package com.treblemaker.keypath.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RenderData {
    @JsonProperty("data")
    public GraphData data = new GraphData();

    @JsonProperty("myconfig")
    public GraphConfig config = new GraphConfig();

    public RenderData(List<IdKeyNote> nodes, List<Link> links, Integer origin, Integer destination, Map<Integer, String> idKeyChordMap, List<Integer> chordPathIds) {
        this.data.Nodes = nodes;
        this.data.Links = links;
        this.data.Origin = origin;
        this.data.Destination = destination;
        this.data.IdKeyChordMap = idKeyChordMap;
        this.data.ChordPathIds = chordPathIds;
    }
}
