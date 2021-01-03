package com.treblemaker.keypath.midi;

import org.jfugue.theory.Chord;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ArpeggiatorTests {
    @Test
    public void shouldCreateWholeNoteArpeggio(){
        Arpeggiator arpeggiator = new Arpeggiator();

        List<Chord> chords = new ArrayList<>();
        chords.add(new Chord("Cmaj7"));
        chords.add(new Chord("Bdim"));

        String arpegStr = arpeggiator.createTrebleArpeggio(ArpeggiosTreble.WHOLE, "6", chords);

        String[] splitArpeg = arpegStr.split(" ");
        assertEquals(2, splitArpeg.length);

        assertEquals(2, StringUtils.countOccurrencesOf(arpegStr, "w"));
    }

    @Test
    public void shouldCreateQuarterNoteArpeggio(){
        Arpeggiator arpeggiator = new Arpeggiator();

        List<Chord> chords = new ArrayList<>();
        chords.add(new Chord("Cmaj7"));
        chords.add(new Chord("Bdim"));

        String arpegStr = arpeggiator.createTrebleArpeggio(ArpeggiosTreble.QUARTER, "6", chords);

        String[] splitArpeg = arpegStr.split(" ");
        assertEquals(8, splitArpeg.length);

        assertEquals(8, StringUtils.countOccurrencesOf(arpegStr, "q"));
    }

    @Test
    public void shouldCreateEighthNoteArpeggio(){
        Arpeggiator arpeggiator = new Arpeggiator();

        List<Chord> chords = new ArrayList<>();
        chords.add(new Chord("Cmaj7"));
        chords.add(new Chord("Bdim"));

        String arpegStr = arpeggiator.createTrebleArpeggio(ArpeggiosTreble.EIGHTH, "6", chords);

        String[] splitArpeg = arpegStr.split(" ");
        assertEquals(16, splitArpeg.length);

        assertEquals(16, StringUtils.countOccurrencesOf(arpegStr, "i"));
    }

    @Test
    public void shouldCreateSixteenthNoteArpeggio(){
        Arpeggiator arpeggiator = new Arpeggiator();

        List<Chord> chords = new ArrayList<>();
        chords.add(new Chord("Cmaj7"));
        chords.add(new Chord("Bdim"));

        String arpegStr = arpeggiator.createTrebleArpeggio(ArpeggiosTreble.SIXTEENTH, "6", chords);

        String[] splitArpeg = arpegStr.split(" ");
        assertEquals(32, splitArpeg.length);

        assertEquals(32, StringUtils.countOccurrencesOf(arpegStr, "s"));
    }
}
