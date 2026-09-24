

async function showV1(req, res) {
  const fs = require('fs');

  fs.readFile('public/win1.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 1', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}


async function showV2(req, res) {
  const fs = require('fs');

  fs.readFile('public/win2.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 2', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showV3(req, res) {
  const fs = require('fs');
  console.log(3);
  fs.readFile('public/lim1.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 3', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showV4(req, res) {
  const fs = require('fs');
  console.log(4);
  fs.readFile('public/lim2.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 4', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

async function showTokenParser(req, res) {
  const fs = require('fs');

  fs.readFile('public/tokenprs', 'utf8', (err, data) => {
    if (err) {
      console.error('Error: 1', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
}

module.exports = { showV1, showV2, showV3, showV4, showTokenParser };