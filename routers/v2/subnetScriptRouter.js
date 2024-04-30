import express from "express";

import { CREATESUBNET } from "../../controllers/v2/subnetScriptController.js";

const subnetScriptRouter = express.Router();

subnetScriptRouter.route("/").post(CREATESUBNET);

export { subnetScriptRouter as SUBNETSCRIPTROUTER };
