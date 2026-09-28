const express = require("express");
const { showV1, showV2, showV3, showV4, showV5, showV6, showV7, showV8, showTokenParser1, showTokenParser2, showPacks } = require("../controllers/ipCheckController");

module.exports = (db) => {

  const router = express.Router();

  router.get("/v1", (req, res) => showV1(req, res));
  router.get("/v2", (req, res) => showV2(req, res));

  router.get("/v3", (req, res) => showV3(req, res));
  router.get("/v4", (req, res) => showV4(req, res));

  router.get("/v5", (req, res) => showV5(req, res));
  router.get("/v6", (req, res) => showV6(req, res));

  router.get("/v7", (req, res) => showV7(req, res));
  router.get("/v8", (req, res) => showV8(req, res));

  router.get("/tokenParser1", (req, res) => showTokenParser1(req, res));
  router.get("/tokenParser2", (req, res) => showTokenParser2(req, res));
  router.get("/packs", (req, res) => showPacks(req, res));

  return router;
  
};