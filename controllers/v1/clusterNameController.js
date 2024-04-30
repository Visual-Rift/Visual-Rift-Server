import { StatusCodes } from "http-status-codes";
import {CLUSTER_MESSAGES, SERVER_MESSAGES} from "../utils/messages/messages.js";
import { exec } from "child_process";
import axios from "axios";


//CONSTANTS
const fields = {
  _v: 0,
  createdAt: 0,
  updatedAt: 0,
};

// DATABASE CONTROLLERS
import {
  CREATECLUSTERDB,
  READCLUSTERDB,
  DELETECLUSTERDB,
} from "./database/clusterNameDatabase.js";

import path from "path";

// CONTROLLERS


const createClusterName = async (req, res) => {
  try {
    const { clusterName, nodeType, minNodes, maxNodes, region, githubUrl } = req.body;

    const scriptPath = path.resolve(
      new URL("../scripts/eks-deploy/eks.sh", import.meta.url).pathname
    );
    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `"${scriptPath}" --repo-url "${githubUrl}" --nodes-min "${minNodes}" --nodes-max "${maxNodes}" --name "${clusterName}" --region "${region}" --node-type "${nodeType}"`,
      { cwd: scriptDir }
    );

    // Capture stdout and stderr and log them
    provision.stdout.on("data", async (data) => {
      console.log(`stdout: ${data}`);

      // Send each log line to the API endpoint
      try {
        await axios.post('http://localhost:3000/api/v1/messages', {
          message: data.toString() // Convert data to string and send as message
        });
      } catch (error) {
        console.error('Error sending log message:', error);
      }
    });

    provision.stderr.on("data", async (data) => {
      console.error(`stderr: ${data}`);

      // Send each stderr error line to the API endpoint
      try {
        await axios.post('http://localhost:3000/api/v1/messages', {
          message: data.toString(), // Convert data to string and send as message
          isError: true // Flag to indicate that this message is an error
        });
      } catch (error) {
        console.error('Error sending error message:', error);
      }
    });

    // Handle completion of the script execution
    provision.on("close", async (code) => {
      console.log(`Script execution completed with code ${code}`);
      if (code === 0) {
        // Script executed successfully, store data in the database
        try {
          const cluster = await CREATECLUSTERDB({
            clusterName,
            nodeType,
            minNodes,
            maxNodes,
            region,
            githubUrl,
          });
          console.log(CLUSTER_MESSAGES.CLUSTER_NAME_CREATED, { cluster });

          res.status(StatusCodes.CREATED).send(`Cluster created successfully.`);
        } catch (error) {
          console.error("Error storing data in the database:", error);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
        }
      } else {
        // Script execution failed
        console.error("Error executing script");
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error executing script" });
      }
    });
  } catch (error) {
    console.log(CLUSTER_MESSAGES.ERROR_CREATING_CLUSTER_NAME, { error });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};


const deleteClusterName = async (req, res) => {
  try {
    const query = { _id: req.query.id };
    const cluster = await READCLUSTERDB(query);

    if (cluster) {
      const { clusterName, nodeType, minNodes, maxNodes, region,applicationPort } = cluster;

      // Explicitly cast port to a number
      const portNumber = parseInt(port, 10);

      const scriptPath = path.resolve(__dirname, "../scripts/eksctl/destroyEKS.sh");
      const scriptDir = path.dirname(scriptPath);

      const destroy = exec(
        `"${scriptPath}" "${clusterName}" "${nodeType}" "${minNodes}" "${maxNodes}" "${region}" "${applicationPort}"`,
        { cwd: scriptDir } // executes script in the script directory
      );

      // Capture stdout and stderr and log them
      destroy.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      destroy.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      // Handle completion of the script execution
      destroy.on("close", async (code) => {
        console.log(`Script execution completed with code ${code}`);
        if (code === 0) {
          // Script executed successfully, delete data from the database
          try {
            const deletedCluster = await DELETECLUSTERDB(query);
            console.log(CLUSTER_MESSAGES.CLUSTER_TERMINATED, {
              deletedCluster,
            });
            res.status(StatusCodes.OK).send("Terminated successfully");
          } catch (error) {
            console.error(CLUSTER_MESSAGES.ERROR_TERMINATING_CLUSTER, error);
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
          }
        } else {
          // Script execution failed
          console.error("Error executing script");
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error executing script" });
        }
      });
    } else {
      // Instance not found
      res.status(StatusCodes.NOT_FOUND).json({ message: "Cluster name not found" });
    }
  } catch (error) {
    console.error("Error deleting Cluster configuration:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(CLUSTER_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const readClusterName = async (req, res) => {
  try {
    const query = !req.query.id ? {} : { _id: req.query.id };
    const instance = await READCLUSTERDB(query, fields);

    if (instance.length > 0) {
      console.log(CLUSTER_MESSAGES.CLUSTER_NAME_FOUND, { instance });

      return res.status(StatusCodes.OK).send(instance);
    } else {
      console.log(CLUSTER_MESSAGES.CLUSTER_NAME_NOT_FOUND);
      return res
        .status(StatusCodes.NOT_FOUND)
        .send(CLUSTER_MESSAGES.CLUSTER_NAME_NOT_FOUND);
    }
  } catch (error) {
    console.log(CLUSTER_MESSAGES.ERROR_READING_CLUSTER_NAME, { error });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const updateClusterName = async (_req, res) => {
  res.send("updateClusterName");
};

export {
  createClusterName as CREATECLUSTERNAME,
  deleteClusterName as DELETECLUSTERNAME,
  readClusterName as READCLUSTERNAME,
  updateClusterName as UPDATECLUSTERNAME,
  
};
