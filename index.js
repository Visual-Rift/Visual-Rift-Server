// MODULES IMPORT
import express from "express";
import cors from "cors";
import { Database } from "./config/database.js";
import dotenv from "dotenv";
dotenv.config();

// ROUTERS
import { EC2CONFIGURATIONROUTER } from "./routers/v1/ec2ConfigurationRouter.js";
import { MERNCONFIGURATIONROUTER } from "./routers/v1/mernConfigurationRouter.js";
import { CLUSTERNAMEROUTER } from "./routers/v1/clusterNameRouter.js";
import { QUICKDEPLOYROUTER } from "./routers/v1/quickDeployRouter.js";

import { RDSSCRIPTROUTER } from "./routers/v2/rdsScriptRouter.js";
import { EC2SCRIPTROUTER } from "./routers/v2/ec2ScriptRouter.js";
import { S3SCRIPTROUTER } from "./routers/v2/s3ScriptRouter.js";
import { ECRSCRIPTROUTER } from "./routers/v2/ecrScriptRouter.js";
import { VPCSCRIPTROUTER} from "./routers/v2/vpcScriptRouter.js"; 
import { SUBNETSCRIPTROUTER } from "./routers/v2/subnetScriptRouter.js";
import { IGSCRIPTROUTER } from "./routers/v2/internetGatewayScriptRouter.js";

//constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// INITIALIZING EXPRESS
const app = express();

// DATABASE
const database = new Database(MONGODB_URI);
database.connect();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//TEST ROUTE
app.use("/api/v1/test", (req, res) => {
  res.send("Server ✅");
});


// This is where you will store your messages
let messages = [];

// Route for fetching messages
app.get("/api/v1/messages", (req, res) => {
  // If there are no messages, wait for a new one
  if (messages.length === 0) {
    // Long-polling: Keep the request open until there are new messages
    const interval = setInterval(() => {
      if (messages.length > 0) {
        clearInterval(interval);
        res.json({ messages });
      }
    }, 1000); // Check for new messages every second
  } else {
    res.json({ messages });
    messages = []; // Clear messages after sending
  }
});

// Route for adding a new message
app.post("/api/v1/messages", (req, res) => {
  const { message } = req.body;
  messages.push(message);
  res.status(201).send("Message received!");
});

//ROUTES
app.use("/api/v1/configure/ec2Configure", EC2CONFIGURATIONROUTER);
app.use("/api/v1/configure/mern", MERNCONFIGURATIONROUTER);
app.use("/api/v1/configure/eks", CLUSTERNAMEROUTER);
app.use("/api/v1/configure/quickDeploy", QUICKDEPLOYROUTER);

// app.use("/api/v1/configure/rds", RDSSCRIPTROUTER);
// app.use("/api/v1/configure/ec2", EC2SCRIPTROUTER);
// app.use("/api/v1/configure/s3", S3SCRIPTROUTER);
// app.use("/api/v1/configure/ecr", ECRSCRIPTROUTER);
// app.use("/api/v1/configure/vpc", VPCSCRIPTROUTER);
// // app.use("/api/v1/configure/subnet", SUBNETSCRIPTROUTER);
// app.use("/api/v1/configure/ig", IGSCRIPTROUTER);
//LISTEN
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
