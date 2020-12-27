package com.treblemaker.keypath.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GraphConfig {
    @JsonProperty("initialZoom")
    public int InitialZoom = 1;

    @JsonProperty("nodeHighlightBehavior")
    public boolean NodeHighlightBehavior = false;



    @JsonProperty("node")
    public NodeConfig NodeConfig = new NodeConfig();
}
