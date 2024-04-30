import express from "express";

import { CREATEIG} from "../../controllers/v2/internetGatewayScriptController.js";

const igScriptRouter = express.Router();

igScriptRouter.route("/").post(CREATEIG);

export { igScriptRouter as IGSCRIPTROUTER };
