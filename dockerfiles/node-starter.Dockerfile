FROM node:20

RUN apt-get update && apt-get install -y curl

# Install dumb-init from GitHub releases
RUN curl -Lo /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_amd64 && \
    chmod +x /usr/local/bin/dumb-init

RUN curl -fsSL https://code-server.dev/install.sh | sh

RUN mkdir -p /workspace
WORKDIR /workspace

RUN npm install -D nodemon

EXPOSE 3001 8080

CMD ["dumb-init", "bash", "-c", "code-server --auth none --bind-addr 0.0.0.0:8080 /workspace"]

