#!/bin/bash
docker run -it --net=host -v `pwd`:/mnt arangodb arangosh --javascript.execute /mnt/shop.js --server.endpoint tcp://ec2-35-167-245-247.us-west-2.compute.amazonaws.com:8529 

