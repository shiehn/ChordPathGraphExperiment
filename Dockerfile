FROM adoptopenjdk/maven-openjdk11

WORKDIR /app
COPY . .

# Run the web service on container startup.
CMD ["mvn", "spring-boot:run"]
