FROM metabase/ci:circleci-java-11-clj-1.10.3.929-07-27-2021-node-browsers as frontend

# Env
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

WORKDIR /home/circleci

# Install
COPY --chown=circleci package.json .
COPY --chown=circleci yarn.lock .
RUN yarn --frozen-lockfile
COPY --chown=circleci . .

# BE
COPY --from=registry-intl.us-east-1.aliyuncs.com/mexl/foot-print-frontend:metabase-v0-41-drivers-builder /home/circleci/modules/ ./modules/
COPY --from=registry-intl.us-east-1.aliyuncs.com/mexl/foot-print-frontend:metabase-v0-41-drivers-builder /home/circleci/.m2/ ./.m2/
COPY --from=registry-intl.us-east-1.aliyuncs.com/mexl/foot-print-frontend:metabase-v0-41-drivers-builder /home/circleci/resources/modules/ ./resources/modules/
COPY --from=registry-intl.us-east-1.aliyuncs.com/mexl/foot-print-frontend:metabase-v0-41-drivers-builder /home/circleci/shared/ ./shared/
COPY --from=registry-intl.us-east-1.aliyuncs.com/mexl/foot-print-frontend:metabase-v0-41-drivers-builder /home/circleci/src/ ./src/
COPY --from=registry-intl.us-east-1.aliyuncs.com/mexl/foot-print-frontend:metabase-v0-41-drivers-builder /home/circleci/java/ ./java/

# FE
RUN NODE_ENV=production MB_EDITION=$MB_EDITION && \
    chmod +x bin/i18n/build-translation-resources && \
    yarn build && yarn sitemap && yarn rss && yarn build-static-viz && bin/i18n/build-translation-resources && \
    chmod +x bin/build && \
    bin/build uberjar

# Run
FROM registry-intl.us-east-1.aliyuncs.com/mexl/foot-print-frontend:metabase-v0-41-runtime

COPY --from=frontend /home/circleci/target/uberjar/metabase.jar /app/
COPY --from=registry-intl.us-east-1.aliyuncs.com/mexl/foot-print-frontend:metabase-v0-41-drivers-builder /home/circleci/bin/docker/run_metabase.sh /app/

EXPOSE 3000

ENTRYPOINT ["/app/run_metabase.sh"]
