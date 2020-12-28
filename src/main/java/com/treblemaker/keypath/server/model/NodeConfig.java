package com.treblemaker.keypath.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NodeConfig {
    @JsonProperty("nodeHighlightBehavior")
    public boolean NodeHighlightBehavior = false;

    @JsonProperty("labelPosition")
    public String LabelPosition = "center";

    @JsonProperty("renderLabel")
    public boolean RenderLabel = true;

    @JsonProperty("labelProperty")
    public String LabelProperty = "labelText";

    @JsonProperty("size")
    public int Size = 500;

    @JsonProperty("strokeColor")
    public String StrokeColor = "grey";

    @JsonProperty("strokeWidth")
    public double StrokeWidth = 1;

    @JsonProperty("fontColor")
    public String FontColor = "black";

    @JsonProperty("highlightStrokeColor")
    public String HighlightStrokeColor = "white";
}

