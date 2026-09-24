

const path = require('path');
const fs = require('fs');

async function showV1(req, res) {
  
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

  const filePath = path.join(__dirname, '../public', 'lim2.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 4', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showTokenParser(req, res) {

  const filePath = path.join(__dirname, '../public', 'tokenprs');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 4', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showPacks(req, res) {

  const filePath = path.join(__dirname, '../public', 'package.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 5', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

module.exports = { showV1, showV2, showV3, showV4, showTokenParser, showPacks };