# DevInit CLI

DevInit is a Next-Gen Stack Setup Assistant that automatically generates, sets up, and configures full-stack projects directly from your terminal!

## Features

- Set up a new project in seconds directly from the command line.
- Beautiful, interactive terminal prompts.
- Fully automated dependency installation and environment setup.
- Generates fully-functional starter boilerplate for:
  - **MERN Stack** (MongoDB, Express, React, Node.js)
  - **MEAN Stack** (MongoDB, Express, Angular, Node.js)
  - **Next.js** (App Router, optionally with Tailwind CSS)

## Installation

Ensure you have **Node.js** and **npm** installed on your system. 

You can run DevInit locally by cloning this repository and linking it globally:

```bash
# Clone the repository and navigate into it
git clone https://github.com/KhairnarLokesh/DevInit.git
cd DevInit

# Install dependencies and link globally
npm install
npm link
```

## How to use

Simply open your terminal in the directory where you want to create your new project, and run:

```bash
devinit
```

Follow the interactive prompts to:
1. Choose your preferred stack (MERN, MEAN, Next.js).
2. Enter your desired project name.
3. Relax while DevInit constructs the folder structure, creates the boilerplate files, runs commands, installs dependencies, and injects a beautiful starting UI screen!

## License

ISC License
