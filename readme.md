# 📁 Project Folder Structure Overview




---

## **Directory Details**

### **backend/**
Contains the API server, authentication, user/session management, and logic for spinning up and managing Docker containers for each user or session.

### **dockerfiles/**
Stores individual Dockerfiles for different development environments or starter templates.  
Examples:  
- `node-starter.Dockerfile`  
- `react-starter.Dockerfile`  
- etc.

### **frontend/**
The React dashboard (and possible supporting static assets) that users interact with to create, manage, and access their code environments.

### **starter_templates/**
Contains boilerplate source code for new environments.  
Examples:
- `react-starter/` for a React + Vite setup
- `node-starter/` for a Node.js API/app
- `html-starter/` for plain HTML/CSS/JS

### **user_workspaces/**
Per-user directories where each user’s (or session’s) code lives.  
Each workspace is mounted into its corresponding container so code changes persist.

---

## **Top-Level Scripts & Files**

- **.gitignore:**  
  Standard Git ignore rules (e.g., to avoid committing node_modules, secrets, Docker layers, etc).

- **build_docker_starter.sh:**  
  A helper script to build Docker images for your different starter templates.

- **run_app.sh:**  
  Script to run your app locally—can be customized to your workflow.

- **readme.md:**  
  This documentation file.

---

## **Usage Example**
- Make the script executable (only once):  
  ```sh
  chmod +x build_docker_starter.sh

- Build a starter image:  
  ```sh
  ./build_docker_starter.sh
