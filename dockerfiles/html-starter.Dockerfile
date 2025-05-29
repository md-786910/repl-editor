FROM node:20


RUN apt-get update && apt-get install -y curl dumb-init

RUN curl -fsSL https://code-server.dev/install.sh | sh

RUN mkdir -p /workspace
WORKDIR /workspace

RUN npm install serve

EXPOSE 5500 8080

CMD ["dumb-init", "bash", "-c", "code-server --auth none --bind-addr 0.0.0.0:8080 /workspace "]
