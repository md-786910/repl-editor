# 🚀 REPL Editor - Cloud IDE & Code Execution Platform

A scalable, containerized cloud IDE and code execution platform similar to Replit, built with modern web technologies. This platform allows users to create, manage, and execute code in isolated Docker containers with real-time collaboration features.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **Multi-Language Support**: Create workspaces for React, Node.js, HTML/CSS/JS, and more
- **Containerized Execution**: Isolated Docker containers for each user workspace
- **Real-time Code Editing**: Live code editor with syntax highlighting
- **Template-based Setup**: Quick start with pre-configured development environments
- **User Management**: Session-based user workspaces with persistent storage
- **Container Management**: Automatic container lifecycle management with idle cleanup
- **Web-based Dashboard**: Intuitive React frontend for managing environments

## 🛠 Tech Stack

### Frontend

- **React 18+** - bootstrap UI library
- **Vite** - Fast build tool and dev server
- **vs code-server Editor** - VS Code-like code editor

### Backend

- **Node.js 20+** - JavaScript runtime
- **Express.js** - Web application framework
- **Docker SDK** - Container management
- **WebSocket** - Real-time communication
- **cors** - Cross-origin resource sharing

### Infrastructure

- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (optional)

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Docker** (v20.0.0 or higher)
- **Docker Compose** (v2.0.0 or higher)
- **Git** for version control

### System Requirements

- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 10GB free space
- **OS**: Linux, macOS, or Windows with WSL2

## 📁 Project Structure

```
└── repl-editor/
    ├── backend/                    # Node.js backend (API, container management, logic)
    │   ├── src/
    │   │   ├── command/            # custom vs code extension
    │   │   ├── config/             # Starter template configuration port mapping & command etc
    │   │   ├── constant/           # Constant for application level
    │   │   ├── event/              # EvenEmiiter configuration and accessbility
    │   │   ├── init/               # initializtion of docker instance node at once singleton
    │   │   └── docker.js           # docker service manager for creating,termination
    │   │   └── index.js            # Express app configuration
    │   │   └── terminal.js         # Loging and attach to external editor docker logs/shell
    │   ├── package.json
    │
    ├── dockerfiles/                # Dockerfiles for each starter template/environment
    │   ├── node-starter.Dockerfile
    │   ├── react-starter.Dockerfile
    │   ├── html-starter.Dockerfile
    │
    ├── frontend/                   # React-based dashboard and UI for managing containers
    │   ├── src/
    │   │   ├── components/         # Reusable React components
    │   │   └── api.js              # Managing api axios services
    │   │   └── config.js           # Managing config/env exporter
    │   │   └── App.jsx             # Main App component
    │   ├── public/
    │   ├── package.json
    │   └── vite.config.js
    │
    ├── starter_templates/          # Prebuilt starter templates
    │   ├── react-starter/          # React + Vite setup
    │   ├── node-starter/           # Node.js API/app
    │   ├── html-starter/           # Plain HTML/CSS/JS
    │
    ├── user_workspaces/            # Per-user workspace directories (mounted into containers)
    │   ├── user-user-001/
    │   ├── user-user-002/
    │   └── ...
    │
    ├── /                    # Utility scripts
    │   ├── build_docker_starter.sh # Build all Docker starter images
    │   └── run_app.sh              # Run the complete application
    │
    ├── .gitignore                  # Git ignore rules
    ├── docker-compose.yml          # Multi-container setup
    ├── package.json                # Root package.json
    └── README.md                   # Project documentation
```

### Directory Details

#### **backend/**

Contains the API server, user/session management, and logic for:

- Spinning up and managing Docker containers
- Container lifecycle management
- Idle container cleanup and termination
- WebSocket connections for real-time updates
- File system operations within user workspaces

#### **dockerfiles/**

Stores individual Dockerfiles for different development environments:

- `node-starter.Dockerfile` - Node.js development environment
- `react-starter.Dockerfile` - React + Vite development setup
- `html-starter.Dockerfile` - Static HTML/CSS/JS environment

#### **frontend/**

React-based dashboard that users interact with to:

- Create new development environments
- Manage existing containers
- Access code editors
- Monitor container status
- Configure environment settings

#### **starter_templates/**

Contains boilerplate source code for new environments:

- Ready-to-use project templates
- Pre-configured development setups
- Best practices and folder structures
- Sample code and documentation

#### **user_workspaces/**

Per-user directories where each user's code lives:

- Persistent storage for user projects
- Mounted as volumes into Docker containers
- Maintains file permissions and ownership
- Automatic backup and cleanup policies

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/md-786910/repl-editor.git
cd repl-editor
```

### 2. Make Scripts Executable

```bash
chmod +x scripts/build_docker_starter.sh
chmod +x scripts/run_app.sh
```

### 3. Build Docker Images

```bash
./scripts/build_docker_starter.sh
```

### 4. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 5. Start the Application

```bash
./scripts/run_app.sh
```

### 6. Access the Application

- **Frontend Dashboard**: http://localhost:3016
- **Backend API**: http://localhost:4000

## 💻 Usage

### Creating a New Workspace

1. **Access Dashboard**: Navigate to the frontend dashboard
2. **Select Template**: Choose from available starter templates
3. **Configure Environment**: Set up your development environment
4. **Start Coding**: Access the integrated code editor

### Managing Containers

- **View Active Containers**: Monitor running environments
- **Start/Stop Containers**: Control container lifecycle
- **Resource Monitoring**: Check CPU and memory usage
- **Cleanup**: Remove idle or unused containers

### Code Editing

- **vs code-server Editor**: VS Code-like editing experience
- **Syntax Highlighting**: Support for multiple languages
- **Auto-completion**: Intelligent code suggestions
- **File Explorer**: Navigate your project structure

### Running in Development Mode

```bash
# Start backend in development mode
cd backend
npm run dev

# Start frontend in development mode (in another terminal)
cd frontend
npm run dev
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build and start backend
cd backend
npm run build
npm start
```

### Adding New Templates

1. **Added new Template to existing Directory**:

   ```bash
   mkdir starter_templates/new-template
   ```

2. **Add Dockerfile**:

   ```bash
   touch dockerfiles/new-template.Dockerfile
   ```

3. **Update Build Script**:
   Edit `scripts/build_docker_starter.sh` to include the new template

4. **Test Template**:
   ```bash
   ./scripts/build_docker_starter.sh
   ```

## 🤝 Contributing

1. **Fork the Repository**
2. **Commit Changes**: `git commit -m 'Add amazing feature'`
3. **Push to Branch**: `git push origin feature/amazing-feature`
4. **Open Pull Request**

### Development Guidelines

- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [Wiki](https://github.com/md-786910/repl-editor.git/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/md-786910/repl-editor.git/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/md-786910/repl-editor.git/discussions)

---

## 📊 Project Status

![Build Status](https://img.shields.io/github/workflow/status/yourusername/repl-editor/CI)
![License](https://img.shields.io/github/license/yourusername/repl-editor)
![Version](https://img.shields.io/github/package-json/v/yourusername/repl-editor)
![Contributors](https://img.shields.io/github/contributors/yourusername/repl-editor)

**Happy Coding! 🎉**
