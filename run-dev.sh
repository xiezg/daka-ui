#########################################################################
# File Name: run-dev.sh
# Author: xiezg
# mail: xzghyd2008@hotmail.com
# Created Time: 2023-08-28 10:20:52
# Last modified: 2023-08-28 10:21:12
#########################################################################
#!/bin/bash

docker run --name daka-ui --network daka -it -v `pwd`:/data/ -p 3000:3000 node:18.16.0-alpine3.17 sh

