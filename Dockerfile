FROM adoptopenjdk/maven-openjdk11

WORKDIR /app
COPY . .

EXPOSE 8080

# Run the web service on container startup.
CMD ["mvn", "spring-boot:run"]
