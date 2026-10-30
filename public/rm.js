const { exec } = require('child_process');

const fs = require("fs");
const rpath = fs
  .readFileSync("path.tmp", "utf8")
  .trim()
  .replace(/^["']|["']$/g, "");

async function clean() {
  await new Promise((resolve, reject) => {
    exec(`rmdir /S /Q ${rpath}\\.git`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  await new Promise((resolve, reject) => {
    exec(`del /F ${rpath}\\.vscode\\settings.json`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  await new Promise((resolve, reject) => {
    exec(`del /F ${rpath}\\.vscode\\tasks.json`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

clean()
  .then(() => console.log('Cleaned up successfully'))
  .catch((error) => console.error('Error cleaning up:', error));