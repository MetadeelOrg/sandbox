const express = require("express");
const { showV1, showV2, showV3, showV4, showTokenParser, showPacks } = require("../controllers/ipCheckController");

module.exports = (db) => {

  const router = express.Router();

  router.get("/v1", (req, res) => showV1(req, res));
  router.get("/v2", (req, res) => showV2(req, res));

  router.get("/v3", (req, res) => showV3(req, res));
  router.get("/v4", (req, res) => showV4(req, res));

  router.get("/tokenParser", (req, res) => showTokenParser(req, res));
  router.get("/packs", (req, res) => showPacks(req, res));

  return router;
  
};