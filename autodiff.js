const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

async function autoDiff() {
  try {
    await executeCommand(`node grabvrg.js`);
    const todayDate = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
	const xDaysAgo = new Date(new Date().setDate(new Date().getDate() - process.argv[2])).toISOString().slice(0, 10)
    console.log(`${todayDate} ${xDaysAgo}`);
    await executeCommand(`node diffvrg.js ${xDaysAgo} ${todayDate}`);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}
if (process.argv.length !== 3) {
  console.log('Usage: node autodiff.js amountOfDaysGap');
  process.exit(1);
}

autoDiff();
