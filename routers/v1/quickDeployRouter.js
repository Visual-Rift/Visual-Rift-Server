import express from "express";

import { quickDeploy } from "../../controllers/v1/quickDeployController.js";

const quickDeployRouter = express.Router();

quickDeployRouter.route("/").post(quickDeploy);

export { quickDeployRouter as QUICKDEPLOYROUTER };
