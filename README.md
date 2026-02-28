# imdb-demo

A full stack IMDb browser demo. Vite+React frontend, Spring Boot backend, PostgreSQL database. I had worked on a
similar application in C# at university years ago. With some newfound React/Java knowledge, I have decided to put
together something far more advanced which I can work on to hone my skills. As a result, there will be many
inefficiencies, or areas with overkill functionality. For the most part though, the main branch should be stable.

# What's Inside

- WebSockets - Upload large .tsv BLOBs from frontend and pipe into Postgres via CopyManager
- Docker Compose - Automatically stand up a docker container housing a Postgres database
- JPA + QueryDSL - Experimenting on typesafe SQL
- React Compiler - Is new, curious to see how it performs
- PrimeReact - Skip boilerplate, nice UI
- Strict ESLint/Prettier - Keep frontend consistent + instil good coding practises

# Prerequisites

- Docker - Required to spin up a PostgreSQL database. Note: Maven `install` lifecycle needs to be run first so that the
necessary QueryDSL classes are generated. If tests are required to pass, they will fail the first time around as the
Docker container will not have been initialised. Starting the backend after the tests fail will generate and initialise
the Docker container. Future `install` lifecycle runs will succeed as long as the container is running and the backend
can connect to the database inside.
- NPM - Required to run the frontend, run `npm install` first
- Strict ESLint / Prettier Configs - Optional, may need some additional IDE setup to enable
- Depending on how the app is deployed (inside WSL for instance), `IMDB_DEMO_HOST` may need to be set to `0.0.0.0` so
that the backend can listen to frontend requests from outside the WSL environment

# Environment Variables

There are a number of backend and frontend environment variables available, all of which have working default values. If
one needs to be overridden, provide an environment variable with its corresponding name. These are:

**Backend**

| Variable             | Default                       | Description                                  |
|----------------------|-------------------------------|----------------------------------------------|
| `IMDB_DEMO_HOST`     | `localhost`                   | The hostname which the backend will bind to  |
| `IMDB_DEMO_PORT`     | `8443`                        | The port which the backend will bind to      |
| `IMDB_DEMO_USE_TLS`  | `false`                       | Whether the backend will use TLS             |
| `IMDB_DEMO_DB_HOST`  | `localhost`                   | The hostname which the database will bind to |
| `IMDB_DEMO_DB_PORT`  | `5432`                        | The port which the database will bind to     |
| `IMDB_DEMO_DB_NAME`  | `dev_imdb_demo`               | The name the database will have              |
| `IMDB_DEMO_DB_USER`  | `postgres`                    | The username of the database connection      |
| `IMDB_DEMO_DB_PASS`  | `password`                    | The password of the database connection      |
| `IMDB_DEMO_KS_PATH`  | `classpath:tls/imdb-demo.p12` | The path to the TLS keystore                 |
| `IMDB_DEMO_KS_TYPE`  | `PKCS12`                      | The type of the TLS keystore                 |
| `IMDB_DEMO_KS_ALIAS` | `imdb-demo`                   | The alias of the TLS keystore                |
| `IMDB_DEMO_KS_PASS`  | `changeit`                    | The password to the TLS keystore             |

**Frontend**

| Variable            | Default                       | Description                                  |
|---------------------|-------------------------------|----------------------------------------------|
| `VITE_HOST`         | `localhost`                   | The hostname which the frontend will bind to |
| `VITE_PORT`         | `5173`                        | The port which the frontend will bind to     |
| `VITE_USE_TLS`      | `false`                       | Whether the frontend will use TLS            |
| `VITE_API_HOST`     | `localhost`                   | The hostname which the backend is bound to   |
| `VITE_API_PORT`     | `8443`                        | The port which the backend is bound to       |
| `VITE_TLS_KEY_PATH` | `tls/imdb-demo-key.pem`       | The path to the TLS key                      |
| `VITE_TLS_CRT_PATH` | `tls/imdb-demo-fullchain.pem` | The path to the TLS certificate              |

# TLS

If TLS is needed, `IMDB_DEMO_USE_TLS` and `VITE_USE_TLS` can be set to `true`. Just ensure you have valid keys/certs
in the correct locations, specified by `IMDB_DEMO_KS_PATH` for the backend and `VITE_TLS_KEY_PATH`/`VITE_TLS_CRT_PATH`
for the frontend.
