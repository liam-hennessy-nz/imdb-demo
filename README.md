# imdb-demo

A full stack IMDB browser demo. Vite+React frontend. Spring Boot backend. PostgreSQL database.

# Prerequisites

There are some environment variables which must be made available to the backend. They are required by Docker Compose
as well as the Spring Boot application. These are:

- `IMDB_DEMO_DB_HOST` ~ the hostname which the database will use (typically `db`)
- `IMDB_DEMO_DB_PORT` ~ the port which the database will use (typically `5432`)
- `IMDB_DEMO_DB_NAME` ~ the name you want for the database
- `IMDB_DEMO_DB_USER` ~ the username you want for the database
- `IMDB_DEMO_DB_PASS` ~ the password you want for the database

These can also be overridden by the `application.properties` file using the respective properties:

- `imdb-demo.db.host`
- `imdb-demo.db.port`
- `imdb-demo.db.name`
- `imdb-demo.db.user`
- `imdb-demo.db.pass`

*NOTE*: It is recommended to change these properties in the environment variables. If you need to override in the
`application.properties` file, ensure to update the `compose.yml` file as well.

These must also point to a valid PostgreSQL database. This project uses Docker Compose to generate and run a PostgreSQL
database on backend startup. For this to work, the Docker Engine must be running is the same environment as the backend.