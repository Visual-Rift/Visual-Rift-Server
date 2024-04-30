import express from "express";

import {
  CREATEVPC,
} from "../../controllers/v2/vpcScriptController.js";

const vpcScriptRouter = express.Router();

vpcScriptRouter.route("/").post(CREATEVPC);

export { vpcScriptRouter as VPCSCRIPTROUTER };
