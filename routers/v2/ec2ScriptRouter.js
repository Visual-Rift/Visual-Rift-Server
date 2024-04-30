import express from "express";

import {
  CREATEEC2,
  DELETEEC2,
} from "../../controllers/v2/ec2ScriptController.js";

const ec2ScriptRouter = express.Router();

ec2ScriptRouter.route("/").post(CREATEEC2).delete(DELETEEC2);

export { ec2ScriptRouter as EC2SCRIPTROUTER };
