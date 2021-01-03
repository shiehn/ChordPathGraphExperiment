## Signals And Sorcery - Procedural Music Application

This application consists of 2 components:
* **NODE/REACT/TONE.JS** client located in /client
* **JAVA/SPRING-BOOT** server located in the root


## How to run locally:

#### Requirements:
* install latest JAVA
* install latest MAVEN
* install latest NODE 

Navigate to root of repo and execute the maven command:
`mvn spring-boot:run`

The application should become available in your browser at `http://localhost:80`

note: *by default the client is packaged by a maven plugin and server by the same Tomcat server as the API*


## How to deploy to server:
* set the variable `API_ROOT=http://localhost:80/` to your servers IP in `/SignalsAndSorcery/client/src/Pages/GraphUI.js` 
* update the proxy IP to your servers IP in the package.json located in `/SignalsAndSorcery/client/package.json`


