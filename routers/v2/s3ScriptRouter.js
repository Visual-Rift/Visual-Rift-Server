import express from "express";

import {
  CREATES3,
  DELETES3,
} from "../../controllers/v2/s3ScriptController.js";

const s3ScriptRouter = express.Router();

s3ScriptRouter.route("/").post(CREATES3).delete(DELETES3);

export { s3ScriptRouter as S3SCRIPTROUTER };