#########################################################################
# File Name: install-mermaind.sh
# Author: xiezg
# mail: xzghyd2008@hotmail.com
# Created Time: 2022-10-14 11:09:13
# Last modified: 2022-10-14 11:18:56
#########################################################################
#!/bin/bash

pushd ~/Desktop/local-modules/mermaid
npm link
popd

npm link @xiezg/mermaid

