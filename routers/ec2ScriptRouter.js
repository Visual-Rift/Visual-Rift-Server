import express from "express";

import { CREATEEC2, DELETEEC2 } from "../controllers/ec2ScriptController.js";

const rdsScriptRouter = express.Router();

rdsScriptRouter.route("/").post(CREATEEC2).delete(DELETEEC2);

export { rdsScriptRouter as RDSSCRIPTROUTER };
