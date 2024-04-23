import express from "express";

import {
  READEC2CONFIGURATION,
  CREATEEC2CONFIGURATION,
  UPDATEEC2CONFIGURATION,
  DELETEEC2CONFIGURATION,
} from "../controllers/ec2ConfigurationController.js";

const ec2ConfigurationRouter = express.Router();

ec2ConfigurationRouter
  .route("/")
  .get(READEC2CONFIGURATION)
  .post(CREATEEC2CONFIGURATION)
  .patch(UPDATEEC2CONFIGURATION)
  .delete(DELETEEC2CONFIGURATION);

export { ec2ConfigurationRouter as EC2CONFIGURATIONROUTER };
