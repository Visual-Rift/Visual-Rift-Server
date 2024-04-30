import express from "express";

import { CREATERDS } from "../../controllers/v2/rdsScriptController.js";

const rdsScriptRouter = express.Router();

rdsScriptRouter.route("/").post(CREATERDS);

export { rdsScriptRouter as RDSSCRIPTROUTER };
