###################
# STAGE 1: builder
###################

FROM metabase/ci:java-11-clj-1.11.0.1100.04-2022-build as builder

ARG MB_EDITION=oss
ARG CDN
ARG PROD_URL
ARG PRE_URL
ARG TEST_URL
ARG BETA_URL
ARG ALPHA_URL
ARG STATIC_BUCKET_URL
ARG STATIC_BUCKET_HK_URL
ARG STATIC_BUCKET_KEY_ID
ARG STATIC_BUCKET_KEY_SECRET
ARG HASURA_URL
ARG HASURA_DEV_URL
ARG GAIA_DAO_URL
ARG GAIA_DAO_DEV_URL
ARG JUPYTER_SERVER_URL
ARG JUPYTER_TOKEN
ARG SLACK_URL
ARG ARMS_PID

ENV CDN $CDN
ENV PROD_URL $PROD_URL
ENV PRE_URL $PRE_URL
ENV TEST_URL $TEST_URL
ENV BETA_URL $BETA_URL
ENV ALPHA_URL $ALPHA_URL
ENV STATIC_BUCKET_URL $STATIC_BUCKET_URL
ENV STATIC_BUCKET_HK_URL $STATIC_BUCKET_HK_URL
ENV STATIC_BUCKET_KEY_ID $STATIC_BUCKET_KEY_ID
ENV STATIC_BUCKET_KEY_SECRET $STATIC_BUCKET_KEY_SECRET
ENV HASURA_URL $HASURA_URL
ENV HASURA_DEV_URL $HASURA_DEV_URL
ENV GAIA_DAO_URL $GAIA_DAO_URL
ENV GAIA_DAO_DEV_URL $GAIA_DAO_DEV_URL
ENV JUPYTER_SERVER_URL $JUPYTER_SERVER_URL
ENV JUPYTER_TOKEN $JUPYTER_TOKEN
ENV SLACK_URL $SLACK_URL
ENV ARMS_PID $ARMS_PID

RUN echo hello-duke & echo $STATIC_BUCKET_URL

WORKDIR /home/circleci

#COPY --chown=circleci . .
COPY --chown=circleci bin/ ./bin/
COPY --chown=circleci dev/ ./dev/
COPY --chown=circleci enterprise/ ./enterprise/
COPY --chown=circleci hooks/ ./hooks/
COPY --chown=circleci locales/ ./locales/
COPY --chown=circleci modules/ ./modules/
COPY --chown=circleci resources/ ./resources/
COPY --chown=circleci shared/ ./shared/
COPY --chown=circleci snowplow/ ./snowplow/
COPY --chown=circleci src/ ./src/
COPY --chown=circleci test/ ./test/
COPY --chown=circleci test_config/ ./test_config/
COPY --chown=circleci test_modules/ ./test_modules/
COPY --chown=circleci test_resources/ ./test_resources/

COPY --chown=circleci .babelrc .babelrc
COPY --chown=circleci .dir-locals.el .dir-locals.el
COPY --chown=circleci .mlc_config.json .mlc_config.json
COPY --chown=circleci .percy.yml .percy.yml

COPY --chown=circleci build.clj build.clj
COPY --chown=circleci codecov.yml codecov.yml
COPY --chown=circleci deps.edn deps.edn
COPY --chown=circleci jest.tz.unit.conf.json jest.tz.unit.conf.json
COPY --chown=circleci jest.unit.conf.json jest.unit.conf.json
COPY --chown=circleci jsconfig.json jsconfig.json
COPY --chown=circleci package.json package.json
COPY --chown=circleci postcss.config.js postcss.config.js
COPY --chown=circleci renovate.json renovate.json
COPY --chown=circleci shadow-cljs.edn shadow-cljs.edn
COPY --chown=circleci tsconfig.json tsconfig.json
COPY --chown=circleci webpack.config.js webpack.config.js
COPY --chown=circleci webpack.shared.config.js webpack.shared.config.js
COPY --chown=circleci webpack.static-viz.config.js webpack.static-viz.config.js
COPY --chown=circleci .env .env
COPY --chown=circleci yarn.lock yarn.lock

RUN INTERACTIVE=false CI=true MB_EDITION=$MB_EDITION bin/build version
RUN INTERACTIVE=false CI=true MB_EDITION=$MB_EDITION bin/build licenses
RUN INTERACTIVE=false CI=true MB_EDITION=$MB_EDITION bin/build translations
RUN INTERACTIVE=false CI=true MB_EDITION=$MB_EDITION bin/build drivers
RUN INTERACTIVE=false CI=true MB_EDITION=$MB_EDITION bin/build frontend-download-dependencies

COPY --chown=circleci frontend/ ./frontend/
RUN INTERACTIVE=false CI=true MB_EDITION=$MB_EDITION bin/build frontend-build-frontend
RUN INTERACTIVE=false CI=true MB_EDITION=$MB_EDITION bin/build frontend-static-viz
RUN INTERACTIVE=false CI=true MB_EDITION=$MB_EDITION bin/build uberjar


# ###################
# # STAGE 2: runner
# ###################

## Remember that this runner image needs to be the same as bin/docker/Dockerfile with the exception that this one grabs the
## jar from the previous stage rather than the local build
## we're not yet there to provide an ARM runner till https://github.com/adoptium/adoptium/issues/96 is ready

FROM --platform=linux/amd64 eclipse-temurin:11-jre-alpine as runner

ARG CDN
ARG PROD_URL
ARG PRE_URL
ARG TEST_URL
ARG BETA_URL
ARG ALPHA_URL
ARG STATIC_BUCKET_URL
ARG STATIC_BUCKET_HK_URL
ARG STATIC_BUCKET_KEY_ID
ARG STATIC_BUCKET_KEY_SECRET
ARG HASURA_URL
ARG HASURA_DEV_URL
ARG GAIA_DAO_URL
ARG GAIA_DAO_DEV_URL
ARG JUPYTER_SERVER_URL
ARG JUPYTER_TOKEN
ARG SLACK_URL
ARG ARMS_PID

ENV FC_LANG en-US LC_CTYPE en_US.UTF-8
ENV CDN $CDN
ENV PROD_URL $PROD_URL
ENV PRE_URL $PRE_URL
ENV TEST_URL $TEST_URL
ENV BETA_URL $BETA_URL
ENV ALPHA_URL $ALPHA_URL
ENV STATIC_BUCKET_URL $STATIC_BUCKET_URL
ENV STATIC_BUCKET_HK_URL $STATIC_BUCKET_HK_URL
ENV STATIC_BUCKET_KEY_ID $STATIC_BUCKET_KEY_ID
ENV STATIC_BUCKET_KEY_SECRET $STATIC_BUCKET_KEY_SECRET
ENV HASURA_URL $HASURA_URL
ENV HASURA_DEV_URL $HASURA_DEV_URL
ENV GAIA_DAO_URL $GAIA_DAO_URL
ENV GAIA_DAO_DEV_URL $GAIA_DAO_DEV_URL
ENV JUPYTER_SERVER_URL $JUPYTER_SERVER_URL
ENV JUPYTER_TOKEN $JUPYTER_TOKEN
ENV SLACK_URL $SLACK_URL
ENV ARMS_PID $ARMS_PID

# dependencies
RUN apk add -U bash ttf-dejavu fontconfig curl java-cacerts && \
    apk upgrade && \
    rm -rf /var/cache/apk/* && \
    mkdir -p /app/certs && \
    curl https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem -o /app/certs/rds-combined-ca-bundle.pem  && \
    /opt/java/openjdk/bin/keytool -noprompt -import -trustcacerts -alias aws-rds -file /app/certs/rds-combined-ca-bundle.pem -keystore /etc/ssl/certs/java/cacerts -keypass changeit -storepass changeit && \
    curl https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem -o /app/certs/DigiCertGlobalRootG2.crt.pem  && \
    /opt/java/openjdk/bin/keytool -noprompt -import -trustcacerts -alias azure-cert -file /app/certs/DigiCertGlobalRootG2.crt.pem -keystore /etc/ssl/certs/java/cacerts -keypass changeit -storepass changeit && \
    mkdir -p /plugins && chmod a+rwx /plugins

# add Metabase script and uberjar
COPY --from=builder /home/circleci/target/uberjar/metabase.jar /app/
COPY bin/docker/run_metabase.sh /app/
COPY bin/starburst-1.0.6.metabase-driver.jar /plugins/

# expose our default runtime port
EXPOSE 3000

# run it
ENTRYPOINT ["/app/run_metabase.sh"]
