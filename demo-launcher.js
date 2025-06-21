#!/usr/bin/env node
const { exec, execSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Configuration
const MERCADO_LATAM_DIR = path.join(__dirname, '..', 'CascadeProjects', 'mercado-latam');
const SALAME_DIR = __dirname;

// ANSI color codes
const PURPLE = '\x1b[35m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Display ASCII art banner
console.log(`
${PURPLE}${BOLD}
   ____    _    _      _    __  __ _____ 
  / ___|  / \\  | |    / \\  |  \\/  | ____|
  \\___ \\ / _ \\ | |   / _ \\ | |\\/| |  _|  
   ___) / ___ \\| |__/ ___ \\| |  | | |___ 
  |____/_/   \\_\\____/_/   \\_\\_|  |_|_____|
                                          
  Demo Launcher
${RESET}
`);

console.log(`${BOLD}Welcome to the SALAME Marketplace Demo Launcher!${RESET}\n`);
console.log('This tool will help you launch the appropriate demo environment.\n');

// Menu options
const options = [
  { 
    key: '1', 
    name: 'Mobile App Demo', 
    description: 'Launch the React Native mobile app experience',
    action: launchMobileApp
  },
  { 
    key: '2', 
    name: 'Desktop Web Demo', 
    description: 'Launch the desktop web experience for sellers',
    action: launchWebApp
  },
  { 
    key: 'q', 
    name: 'Quit', 
    description: 'Exit the launcher',
    action: exitLauncher
  }
];

// Function to display menu
function showMenu() {
  console.log(`\n${BOLD}Choose a demo to launch:${RESET}\n`);
  
  options.forEach(option => {
    console.log(`${BLUE}${option.key}${RESET}. ${option.name} - ${option.description}`);
  });
  
  rl.question('\nEnter your choice: ', (answer) => {
    const selectedOption = options.find(opt => opt.key === answer.toLowerCase());
    
    if (selectedOption) {
      selectedOption.action();
    } else {
      console.log('\nInvalid option. Please try again.');
      showMenu();
    }
  });
}

// Launch the mobile app demo
function launchMobileApp() {
  console.log(`\n${GREEN}Launching Mobile App Demo...${RESET}\n`);
  console.log('This will start the Expo development server for the SALAME mobile app.');
  console.log('You can view it on your mobile device with Expo Go app or in a web browser.');
  
  const command = 'npm start';
  
  console.log(`\nExecuting: ${BOLD}${command}${RESET}\n`);
  
  const child = exec(command, { cwd: SALAME_DIR });
  
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  
  child.on('exit', (code) => {
    if (code !== 0) {
      console.log(`\nExpo start process exited with code ${code}`);
    }
    rl.close();
  });
}

// Check if a command is available in the system
function isCommandAvailable(command) {
  try {
    // Use 'where' on Windows to check if command exists
    execSync(`where ${command}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Launch the web app demo
function launchWebApp() {
  console.log(`\n${GREEN}Launching Desktop Web Demo...${RESET}\n`);
  console.log('This will start the Next.js development server for the mercado-latam web app.');
  
  // Check if mercado-latam directory exists
  if (!fs.existsSync(MERCADO_LATAM_DIR)) {
    console.error(`\nError: Could not find the mercado-latam directory at: ${MERCADO_LATAM_DIR}`);
    console.log('Please check the path and try again.');
    return showMenu();
  }
  
  // Check if package.json exists in the directory
  const packageJsonPath = path.join(MERCADO_LATAM_DIR, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('\nError: package.json not found in the mercado-latam directory.');
    console.log('Please check if this is the correct project directory.');
    return showMenu();
  }
  
  // Determine whether to use yarn or npm
  const hasYarn = isCommandAvailable('yarn');
  const hasNpm = isCommandAvailable('npm');
  
  let command;
  if (hasYarn) {
    command = 'yarn start:web';
  } else if (hasNpm) {
    // Read package.json to find the equivalent npm command
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.scripts && packageJson.scripts['start:web']) {
        command = 'npm run start:web';
      } else {
        console.error('\nError: Could not find the start:web script in package.json');
        console.log('Please make sure the project has a start:web script defined.');
        return showMenu();
      }
    } catch (error) {
      console.error(`\nError reading package.json: ${error.message}`);
      return showMenu();
    }
  } else {
    console.error('\nError: Neither yarn nor npm is available in your system.');
    console.log('Please install either yarn or npm and try again.');
    return showMenu();
  }
  
  console.log(`\nExecuting: ${BOLD}${command}${RESET} in ${MERCADO_LATAM_DIR}\n`);
  
  const child = exec(command, { cwd: MERCADO_LATAM_DIR });
  
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  
  child.on('exit', (code) => {
    if (code !== 0) {
      console.log(`\nNext.js dev server process exited with code ${code}`);
    }
    rl.close();
  });
}

// Exit the launcher
function exitLauncher() {
  console.log('\nThank you for using the SALAME Demo Launcher!');
  rl.close();
}

// Start the launcher
showMenu();
