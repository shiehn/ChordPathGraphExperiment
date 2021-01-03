package com.treblemaker.keypath.server;

import com.treblemaker.keypath.graph.ChordGraph;
import com.treblemaker.keypath.server.model.RenderData;
import org.apache.commons.compress.utils.IOUtils;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.*;

@CrossOrigin(origins = "*")
@RestController
public class Server {

    private static final Logger log = LoggerFactory.getLogger(Server.class);

    public Server() {
    }

    @GetMapping("/graph/{sessionid}/{origin}/{destination}")
    RenderData get(@PathVariable("sessionid") String sessionId, @PathVariable("origin") Integer origin, @PathVariable("destination") Integer destination) {
        ChordGraph chordGraph = new ChordGraph();
        RenderData renderData = null;
        try {
            renderData = chordGraph.create(sessionId, origin, destination);
        } catch (IOException e) {
            log.error(e.toString());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return renderData;
    }

    @GetMapping(value = "/midi/{sessionid}/{midiid}", produces = MediaType.MULTIPART_MIXED_VALUE)
    public @ResponseBody byte[] getImageWithMediaType(@PathVariable("sessionid") String sessionId, @PathVariable("midiid") String midiId) {
        File dir = new File(String.format("output/%s", sessionId));
        FileFilter fileFilter = new WildcardFileFilter(String.format("*$%s.mid", midiId));
        File[] files = dir.listFiles(fileFilter);

        byte[] output;
        try {
            final InputStream in = new DataInputStream(new FileInputStream(files[0]));
            output = IOUtils.toByteArray(in);
        } catch (Exception e) {
            log.error(e.toString());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return output;
    }
}

