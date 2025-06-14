FROM node:20


RUN apt-get update && apt-get install -y curl dumb-init

RUN curl -fsSL https://code-server.dev/install.sh | sh

# Add your starter files (for example, from build context)
# Place them in /starter, then copy to /workspace as node
COPY --chown=node:node ../starter_templates/html-starter/* /workspace/

WORKDIR /workspace

RUN npm install -D serve

EXPOSE 5500 8080

# 👇 Add this line to run container as 'node' (UID 1000)
USER node

CMD ["dumb-init", "bash", "-c", "code-server --auth none --bind-addr 0.0.0.0:8080 /workspace "]
