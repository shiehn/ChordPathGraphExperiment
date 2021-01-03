package com.treblemaker.keypath.midi;

import java.util.*;

public class ArpeggiosBass {
    public static String WHOLE = "w";
    public static String HALF = "h";
    public static String QUARTER = "q";
    public static String EIGHTH = "i";

    private Map<String, List<Integer[]>> arpeggios = new HashMap<>();

    public ArpeggiosBass() {
        List<Integer[]> wholeArpeggios = new ArrayList<>();
        wholeArpeggios.add(new Integer[]{0});
        wholeArpeggios.add(new Integer[]{0});
        wholeArpeggios.add(new Integer[]{0});
        wholeArpeggios.add(new Integer[]{0});

        this.arpeggios.put(WHOLE, wholeArpeggios);

        List<Integer[]> halfArpeggios = new ArrayList<>();
        halfArpeggios.add(new Integer[]{0, 0});
        halfArpeggios.add(new Integer[]{0, 1});
        halfArpeggios.add(new Integer[]{0, 2});
        halfArpeggios.add(new Integer[]{0, 3});

        this.arpeggios.put(HALF, halfArpeggios);

        List<Integer[]> quarterArpeggios = new ArrayList<>();
        quarterArpeggios.add(new Integer[]{0, 1, 0, 1});
        quarterArpeggios.add(new Integer[]{0, 1, 0, 1});
        quarterArpeggios.add(new Integer[]{0, 2, 0, 1});
        quarterArpeggios.add(new Integer[]{0, 0, 0, 2});

        this.arpeggios.put(QUARTER, quarterArpeggios);

        List<Integer[]> eighthArpeggios = new ArrayList<>();
        eighthArpeggios.add(new Integer[]{0, 0, 0, 1, 0, 0, 0, 2});
        eighthArpeggios.add(new Integer[]{0, 0, 1, 2, 0, 0, 2, 3});
        eighthArpeggios.add(new Integer[]{0, 0, 0, 2, 0, 0, 0, 3});
        eighthArpeggios.add(new Integer[]{0, 1, 2, 2, 0, 1, 2, 3});

        this.arpeggios.put(EIGHTH, eighthArpeggios);
    }

    public Integer[] getRandomByType(String type) {
        List<Integer[]> arps = this.arpeggios.get(type);
        return arps.get(new Random().nextInt(arps.size()));
    }

    public String getRandomType(){
        List<String> arpeggioTypes = new ArrayList<>();
        arpeggioTypes.add(ArpeggiosTreble.WHOLE);
        arpeggioTypes.add(ArpeggiosTreble.HALF);
        arpeggioTypes.add(ArpeggiosTreble.QUARTER);
        arpeggioTypes.add(ArpeggiosTreble.EIGHTH);
        arpeggioTypes.add(ArpeggiosTreble.SIXTEENTH);

        return arpeggioTypes.get(new Random().nextInt(arpeggioTypes.size()));
    }
}
