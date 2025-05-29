#!/bin/bash
set -e

docker build -t react-starter -f dockerfiles/react-starter.Dockerfile .
docker build -t node-starter -f dockerfiles/node-starter.Dockerfile .
docker build -t html-starter -f dockerfiles/html-starter.Dockerfile .
