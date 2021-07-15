#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd ${MY_DIR}

cd src

rm -rf node_modules/

${MY_DIR}/update_dependencies.sh

yarn

${MY_DIR}/build.sh
