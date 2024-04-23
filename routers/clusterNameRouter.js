import express from "express";

import {
  READCLUSTERNAME,
  CREATECLUSTERNAME,
  UPDATECLUSTERNAME,
  DELETECLUSTERNAME,
} from "../controllers/clusterNameController.js";

const clusterNameRouter = express.Router();

clusterNameRouter
  .route("/")
  .get(READCLUSTERNAME)
  .post(CREATECLUSTERNAME)
  .patch(UPDATECLUSTERNAME)
  .delete(DELETECLUSTERNAME);

export { clusterNameRouter as CLUSTERNAMEROUTER };
