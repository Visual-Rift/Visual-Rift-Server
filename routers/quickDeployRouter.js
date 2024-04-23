import express from "express";

import { quickDeploy } from "../controllers/quickDeployController.js";

const quickDeployRouter = express.Router();

quickDeployRouter.route("/").post(quickDeploy);

export { quickDeployRouter as QUICKDEPLOYROUTER };
