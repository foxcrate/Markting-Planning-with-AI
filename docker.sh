#!/bin/bash
docker stop crespo-staging;
docker rm crespo-staging;
docker image rm crespo/staging;
docker build . --tag crespo/staging;
docker run -d -p 127.0.0.1:3011:3000 --restart unless-stopped --name crespo-staging crespo/staging;
