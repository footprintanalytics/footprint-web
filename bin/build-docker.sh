#! /usr/bin/env bash

set -eo pipefail

INTERACTIVE=false
MB_EDITION=oss

source "./bin/check-clojure-cli.sh"
check_clojure_cli

yarn build

#bin/i18n/build-translation-resources

#bin/build-drivers.sh

lein deps :tree

bin/build version uberjar

cp target/uberjar/metabase.jar bin/docker
#cd bin/docker
#docker build -t registry-intl.us-east-1.aliyuncs.com/mexl/foot-print-frontend:$1 .

