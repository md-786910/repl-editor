FROM node:20

RUN apt-get update && apt-get install -y curl dumb-init

# Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh

# Setup workspace
RUN mkdir -p /workspace
WORKDIR /workspace


# Install Vite globally (optional)
RUN npm install -g create-vite

# Create Vite React app if not exists
RUN [ ! -f "package.json" ] && npm init vite@latest . -- --template react || true

RUN npm install

EXPOSE 5173 8080

CMD ["dumb-init", "bash", "-c", "code-server --auth none --bind-addr 0.0.0.0:8080 /workspace "]
