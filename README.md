# imdb-demo

A full stack IMDb browser demo. Vite+React frontend. Spring Boot backend. PostgreSQL database. This app is just an
experiment. I had worked on something similar at university in C#. With some newfound React/Java knowledge, I have
decided to put together something far more advanced which I can work on to hone my skills. As a result, there will be
some inefficiencies, or areas which have overkill functionality. For the most part though, the main branch should be
stable.

# What's Inside

- WebSocket uploads of large BLOBs piped into PostgreSQL CopyManager
- Docker Compose housing a PostgreSQL instance
- JPA + QueryDSL
- React Compiler
- PrimeReact

# Prerequisites

Out of the box, this application requires Docker to spin up a PostgreSQL database. Ensure the Docker Engine is running
in the same environment as the backend. The backend is also built to run in the Java 21 environment. Depending on how
the app is deployed (inside WSL for instance), `IMDB_DEMO_HOST` may need to be set to `0.0.0.0` so that outside machines
can connect to the backend.

# Environment Variables

There are a number of backend and frontend environment variables available, all of which have working default values. If
one needs to be overridden, the recommended way is to introduce a process or system level environment variable with the
same name. This will override the default value. The environment variables are:

**Backend**

| Variable             | Default                       | Description                                  |
|----------------------|-------------------------------|----------------------------------------------|
| `IMDB_DEMO_HOST`     | `localhost`                   | The hostname which the backend will bind to  |
| `IMDB_DEMO_PORT`     | `8443`                        | The port which the backend will bind to      |
| `IMDB_DEMO_USE_TLS`  | `false`                       | Whether the backend will use TLS             |
| `IMDB_DEMO_DB_HOST`  | `localhost`                   | The hostname which the database will bind to |
| `IMDB_DEMO_DB_PORT`  | `5432`                        | The port which the database will bind to     |
| `IMDB_DEMO_DB_NAME`  | `dev_imdb_demo`               | The name the database will have              |
| `IMDB_DEMO_DB_USER`  | `postgres`                    | The username the database user will use      |
| `IMDB_DEMO_DB_PASS`  | `password`                    | The password the database user will use      |
| `IMDB_DEMO_KS_PATH`  | `classpath:tls/imdb-demo.p12` | The relative path to the tls keystore        |
| `IMDB_DEMO_KS_TYPE`  | `PKCS12`                      | The type of the tls keystore                 |
| `IMDB_DEMO_KS_ALIAS` | `imdb-demo-cert`              | The alias of the tls keystore                |
| `IMDB_DEMO_KS_PASS`  | `changeit`                    | The password to the tls keystore             |

**Frontend**

| Variable            | Default             | Description                                  |
|---------------------|---------------------|----------------------------------------------|
| `VITE_HOST`         | `localhost`         | The hostname which the frontend will bind to |
| `VITE_PORT`         | `5173`              | The port which the frontend will bind to     |
| `VITE_USE_TLS`      | `false`             | Whether the frontend will use TLS            |
| `VITE_API_HOST`     | `localhost`         | The hostname which the backend is bound to   |
| `VITE_API_PORT`     | `8443`              | The port which the backend is bound to       |
| `VITE_TLS_KEY_PATH` | `tls/imdb-demo.key` | The relative path to the tls key             |
| `VITE_TLS_CRT_PATH` | `tls/imdb-demo.crt` | The relative path to the tls certificate     |

# TLS

If TLS is needed, `IMDB_DEMO_USE_TLS` and `VITE_USE_TLS` can be set to `true`. Just ensure you have valid keys/certs
in the correct locations, specified by `IMDB_DEMO_KS_PATH` for the backend and `VITE_TLS_KEY_PATH`/`VITE_TLS_CRT_PATH`
for the frontend.
