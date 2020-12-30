package com.treblemaker.keypath.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import scala.collection.generic.BitOperations;

import java.util.Locale;

public class IdKeyNote {
    @JsonProperty("id")
    public int Id;

    @JsonProperty("hkey")
    public String Key;

    @JsonProperty("note")
    public String Note;

    @JsonProperty("chord")
    public String Chord;

    @JsonProperty("keyAndNote")
    public String KeyNoteChord;

    @JsonProperty("color")
    public String Color;

    @JsonProperty("size")
    public Integer Size;

    @JsonProperty("labelText")
    public String LabelText;

    public IdKeyNote(int id, String key, String note, String chord, String color) {
        this.Id = id;
        this.Key = key;
        this.Note = note;
        this.Chord = chord;
        this.LabelText = this.Note.toUpperCase() + updateChordType(this.Chord);
        this.LabelText = Integer.toString(id);
        this.Color = color;
    }

    private String updateChordType(String originalVal){
        originalVal = originalVal.toLowerCase();

        if(originalVal.contains("maj")) {
            originalVal = originalVal.replace("maj", "M");
        }

        if(originalVal.contains("min")) {
            originalVal = originalVal.replace("min", "m");
        }

        if(originalVal.contains("dom7")) {
            originalVal = originalVal.replace("dom7", "dom");
        }

        if(originalVal.contains("dim")) {
            originalVal = originalVal.replace("dim", "ø");
        }

        return originalVal;
    }
}
