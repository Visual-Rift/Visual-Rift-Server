import express from "express";

import {
  CREATEECR,
  DELETEECR,
} from "../../controllers/v2/ecrScriptController.js";

const ecrScriptRouter = express.Router();


ecrScriptRouter.route("/").post(CREATEECR).delete(DELETEECR);

export { ecrScriptRouter as ECRSCRIPTROUTER };

