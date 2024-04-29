import express from "express";

import { CREATERDS } from "../controllers/rdsScriptController.js";

const rdsScriptRouter = express.Router();

rdsScriptRouter.route("/").post(CREATERDS);

export { rdsScriptRouter as RDSSCRIPTROUTER };
