import * as vscode from 'vscode';
import * as path from 'path';
import { createDirectory, createFile } from '../utils/fileUtils';
import { runCommandsSequentially } from '../utils/terminalUtils';

export async function setupMern(projectPath: string, projectName: string, features: string[]) {
    vscode.window.showInformationMessage('Creating MERN project structure...');
    
    // Create Root
    createDirectory(projectPath);

    // Create Server Folders
    const serverPath = path.join(projectPath, 'server');
    const folders = ['controllers', 'models', 'routes', 'config', 'middleware'];
    folders.forEach(folder => createDirectory(path.join(serverPath, folder)));

    // Starter Files for Server
    const indexJsContent = `
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API route for the frontend to fetch
app.get('/api/status', (req, res) => {
    res.json({ status: 'success', message: 'MERN Server is running beautifully!', stack: ['MongoDB', 'Express', 'React', 'Node.js'] });
});

app.get('/', (req, res) => {
    res.send('MERN Server is running');
});

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});
`;
    createFile(path.join(serverPath, 'index.js'), indexJsContent);
    createFile(path.join(serverPath, '.env'), 'PORT=5000\nMONGO_URI=your_mongodb_connection_string');

    // README
    const readmeContent = `
# ${projectName}

## MERN Stack Project
- Client: React
- Server: Express, Node.js, MongoDB

## Setup
cd server
npm install
npm run dev

cd ../client
npm start
`;
    createFile(path.join(projectPath, 'README.md'), readmeContent);

    // Root package.json for running client and server together
    const rootPackageJson = `
{
  "name": "${projectName.toLowerCase().replace(/\\s+/g, '-')}-root",
  "version": "1.0.0",
  "scripts": {
    "install-all": "cd server && npm install && cd ../client && npm install",
    "dev": "concurrently \\"npm run server\\" \\"npm run client\\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
`;
    createFile(path.join(projectPath, 'package.json'), rootPackageJson);

    // Setup script to inject beautiful UI after React is installed
    const setupUiScript = `
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'client', 'src', 'App.js');
const appCssPath = path.join(__dirname, 'client', 'src', 'App.css');

const appJsContent = \`
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/status')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      <div className="glass-panel">
        <h1 className="title">DevInit</h1>
        <p className="subtitle">MERN Stack Successfully Deployed</p>
        
        <div className="status-box">
          <h2>Backend API Status:</h2>
          {loading ? (
             <div className="spinner"></div>
          ) : data ? (
             <div className="success-message">
               <span className="icon">🚀</span>
               <p>{data.message}</p>
               <div className="stack-badges">
                 {data.stack && data.stack.map((item, i) => (
                    <span key={i} className="badge">{item}</span>
                 ))}
               </div>
             </div>
          ) : (
             <div className="error-message">❌ Backend is not running or unreachable</div>
          )}
        </div>
        
        <button className="glowing-btn" onClick={() => window.location.reload()}>Refresh Connection</button>
      </div>
    </div>
  );
}

export default App;
\`;

const appCssContent = \`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, html {
  font-family: 'Inter', sans-serif;
  height: 100%;
  background: #0f172a;
  color: #fff;
  overflow: hidden;
}

.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: radial-gradient(circle at top right, #3b82f6 0%, transparent 40%),
              radial-gradient(circle at bottom left, #8b5cf6 0%, transparent 40%);
  background-color: #0f172a;
  animation: pulseBg 10s infinite alternate;
}

@keyframes pulseBg {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: translateY(20px);
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  to { transform: translateY(0); opacity: 1; }
  from { opacity: 0; }
}

.title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(to right, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.status-box {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.status-box h2 {
  font-size: 1rem;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.stack-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
}

.badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.badge:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: #f87171;
  font-weight: 600;
}

.glowing-btn {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
}

.glowing-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
}
\`;

try {
  if (fs.existsSync(appJsPath)) fs.writeFileSync(appJsPath, appJsContent);
  if (fs.existsSync(appCssPath)) fs.writeFileSync(appCssPath, appCssContent);
  
  // Create a server package.json start script so dev runs nodemon
  const serverPkg = path.join(__dirname, 'server', 'package.json');
  if (fs.existsSync(serverPkg)) {
    const pkg = JSON.parse(fs.readFileSync(serverPkg));
    pkg.scripts = { ...pkg.scripts, dev: "npx nodemon index.js" };
    fs.writeFileSync(serverPkg, JSON.stringify(pkg, null, 2));
  }
} catch (e) {
  console.error('Failed to inject UI', e);
}
`;
    createFile(path.join(projectPath, 'setup-ui.js'), setupUiScript);

    // Automation
    vscode.window.showInformationMessage('Installing dependencies and setting up React client... This may take a while.');
    
    // Commands sequence:
    // 1. Install server deps
    // 2. Create React App
    // 3. Run our UI injection script
    // 4. Install root dependencies (concurrently)
    // 5. Start the full application locally
    const commands = [
        'mkdir server -ea 0', // inside powershell
        'cd server',
        'npm init -y',
        'npm install express mongoose cors dotenv',
        'cd ..',
        'npx create-react-app client',
        'node setup-ui.js',
        'npm install',
        'npm run dev'
    ];
    
    runCommandsSequentially(commands, projectPath, `DevInit: ${projectName}`);
}
