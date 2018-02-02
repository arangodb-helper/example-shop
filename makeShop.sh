#!/bin/bash
docker run -it --net=host -v `pwd`:/mnt arangodb arangosh --javascript.execute /mnt/shop.js

