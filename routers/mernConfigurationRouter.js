import express from "express";

import {
  READMERNCONFIGURATION,
  CREATEMERNCONFIGURATION,
  UPDATEMERNCONFIGURATION,
  DELETEMERNCONFIGURATION,
} from "../controllers/mernConfigurationController.js";

const mernConfigurationRouter = express.Router();

mernConfigurationRouter
  .route("/")
  .get(READMERNCONFIGURATION)
  .post(CREATEMERNCONFIGURATION)
  .patch(UPDATEMERNCONFIGURATION)
  .delete(DELETEMERNCONFIGURATION);

export { mernConfigurationRouter as MERNCONFIGURATIONROUTER };
