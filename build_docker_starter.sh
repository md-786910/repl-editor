#!/bin/bash
set -e

docker build --no-cache -t react-starter:latest -f dockerfiles/react-starter.Dockerfile .
docker build  --no-cache -t node-starter:latest -f dockerfiles/node-starter.Dockerfile .
docker build --no-cache -t html-starter:latest -f dockerfiles/html-starter.Dockerfile .
