package com.treblemaker.keypath;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KeypathApplication {

	public static void main(String[] args) {
		SpringApplication.run(KeypathApplication.class, args);
	}

}
