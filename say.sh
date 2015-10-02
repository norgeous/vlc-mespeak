#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
MSG=$( xsel )
node $DIR/components/say.js "$MSG"
