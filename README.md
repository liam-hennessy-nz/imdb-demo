# imdb-demo

A full stack IMDb browser demo. Vite+React frontend, Spring Boot backend, PostgreSQL database. I worked on a
similar application in C# at university years ago. With some newfound React/Java knowledge, I have decided to put
together something far more advanced which I can work on to hone my skills. As a result, there will be many
inefficiencies, or areas with overkill functionality. For the most part, the main branch should be stable.

# What's Inside

- WebSockets – Upload large .tsv files in the frontend and pipe into Postgres via CopyManager.
- Docker Compose – Automatically stands up a docker container housing a Postgres database.
- JPA + QueryDSL – Allows for typesafe SQL.
- React Compiler – Automatically memo-ises components.
- MUI – Out-of-the-box components and standardised styling.
- Strict ESLint/Prettier rules – Keep frontend consistent and instil good coding practices.

# Set-up (Dev)

## Prerequisites

- IntelliJ IDEA – Not required, but is what I have been using for development. An IDE that supports Maven at least.
- Docker – Not required, but a Docker Compose file is provided which will make spinning up the database a lot easier.
- PostgreSQL 18+ – Database the backend has been built around. As noted above, recommend using Docker to set this up.
- NPM – For downloading frontend dependencies and running the frontend.
- Java 25+ – For running the backend.
- Maven – For downloading backend dependencies and building backend QueryDSL classes.

## Steps

First, of course, clone the repo.

### Backend

1. Download the backend dependencies. Ideally, your IDE should pick up the Maven project and do this automatically.
2. Ensure a PostgreSQL database is running.
   1. If you are using Docker, run `docker-compose up`. This will automatically fetch the latest PostgreSQL image and
      create a database. The name, username and password can all be configured via
      [environment variables](#environment-variables).
   2. If you are not using Docker, ensure the database configuration matches the environment variables for the backend.
3. Run `mvn install` to generate the QueryDSL classes.
4. Create a run configuration for `ImdbDemoApplication` and run it.
5. Depending on how the app is deployed (inside WSL for instance), you may need to change the host
   [environment variable](#environment-variables) to `0.0.0.0` so that the frontend can connect to the backend.

### Frontend

1. Open a terminal in the `webapp` directory.
2. Run `npm install` to download the frontend dependencies.
3. Optionally, configure your IDE to use the strict ESLint/Prettier rules provided.
4. Run `npm run dev` to run the frontend.

# Environment Variables

There are many front and backend environment variables. Each will have a default value but can be overridden by
providing alternative values at runtime. This is the preferred method of changing these, rather than editing property
files directly.

## Backend

<details>
  <summary>Expand to see backend variables.</summary>

   | Variable                           | Default                       | Description                                             |
   |------------------------------------|-------------------------------|---------------------------------------------------------|
   | `IMDB_DEMO_HOST`                   | `localhost`                   | The hostname which the backend will bind to             |
   | `IMDB_DEMO_PORT`                   | `8443`                        | The port which the backend will bind to                 |
   | `IMDB_DEMO_USE_TLS`                | `false`                       | Whether the backend will use TLS                        |
   | `IMDB_DEMO_TEMP_DIR`               | `/tmp/imdb-demo`              | The directory where temporary data will live            |
   | `IMDB_DEMO_DB_HOST`                | `localhost`                   | The hostname which the database will bind to            |
   | `IMDB_DEMO_DB_PORT`                | `5432`                        | The port which the database will bind to                |
   | `IMDB_DEMO_DB_NAME`                | `dev_imdb_demo`               | The name the database will have                         |
   | `IMDB_DEMO_DB_USER`                | `postgres`                    | The username of the database connection                 |
   | `IMDB_DEMO_DB_PASS`                | `password`                    | The password of the database connection                 |
   | `IMDB_DEMO_KS_PATH`                | `classpath:tls/imdb-demo.p12` | The path to the TLS keystore                            |
   | `IMDB_DEMO_KS_TYPE`                | `PKCS12`                      | The type of the TLS keystore                            |
   | `IMDB_DEMO_KS_ALIAS`               | `imdb-demo`                   | The alias of the TLS keystore                           |
   | `IMDB_DEMO_KS_PASS`                | `changeit`                    | The password to the TLS keystore                        |
   | `IMDB_DEMO_WS_CHUNK_BYTE_SIZE`     | `1048576` (1MiB)              | The size upload BLOBs will be broken up in              |
   | `IMDB_DEMO_WS_CHUNK_ACK_INTERVAL`  | `20`                          | The number of chunks to process before sending an ACK   |
   | `IMDB_DEMO_WS_CHUNK_IN_FLIGHT_MAX` | `150`                         | The max number of unACKed chunks that can exist         |
   | `IMDB_DEMO_UL_TEMP_DIR`            | `/tmp/imdb-demo/uploads`      | The directory where partially uploaded data will live   |
   | `IMDB_DEMO_UL_QUEUE_SIZE`          | `2000`                        | The size of the backend worker queue processing uploads |

</details>

## Frontend

<details>
  <summary>Expand to see frontend variables.</summary>

   | Variable            | Default                       | Description                                  |
   |---------------------|-------------------------------|----------------------------------------------|
   | `VITE_HOST`         | `localhost`                   | The hostname which the frontend will bind to |
   | `VITE_PORT`         | `5173`                        | The port which the frontend will bind to     |
   | `VITE_USE_TLS`      | `false`                       | Whether the frontend will use TLS            |
   | `VITE_API_HOST`     | `localhost`                   | The hostname which the backend is bound to   |
   | `VITE_API_PORT`     | `8443`                        | The port which the backend is bound to       |
   | `VITE_TLS_KEY_PATH` | `tls/imdb-demo-key.pem`       | The path to the TLS key                      |
   | `VITE_TLS_CRT_PATH` | `tls/imdb-demo-fullchain.pem` | The path to the TLS certificate              |

</details>

# TLS

If TLS is needed, `IMDB_DEMO_USE_TLS` and `VITE_USE_TLS` can be set to `true`. Ensure you have valid keys/certs in the
correct locations, specified by `IMDB_DEMO_KS_PATH` for the backend and `VITE_TLS_KEY_PATH`/`VITE_TLS_CRT_PATH` for the
frontend.
