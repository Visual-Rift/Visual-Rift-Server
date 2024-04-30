import { StatusCodes } from "http-status-codes";
import {
  SERVER_MESSAGES,
  EC2_MESSAGES,
} from "../../utils/messages/messages.js";
import { exec } from "child_process";

//CONSTANTS
const fields = {
  _v: 0,
  createdAt: 0,
  updatedAt: 0,
};

// DATABASE CONTROLLERS
import {
  CREATEEC2DB,
  READEC2DB,
  DELETEEC2DB,
} from "../database/v1/ec2ConfigurationDatabase.js";

import path from "path";

// CONTROLLERS
const createEC2Configuration = async (req, res) => {
  try {
    const { githubUrl, instanceType, ami, port, ec2Name } = req.body;

    const scriptPath = path.resolve(
      new URL("../scripts/ec2/remote.sh", import.meta.url).pathname
    );
    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `"${scriptPath}" "${port}" "${githubUrl}" "${instanceType}" "${ami}" "${ec2Name}"`,
      // executes script in the script directory
      { cwd: scriptDir }
    );

    let publicIp = null;

    // Capture stdout and stderr and log them
    provision.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);

      // Assuming the last line of output is the public IP
      publicIp = data.trim();
    });

    provision.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    // Handle completion of the script execution
    provision.on("close", async (code) => {
      console.log(`Script execution completed with code ${code}`);
      if (code === 0) {
        // Script executed successfully, store data in the database
        try {
          const instance = await CREATEEC2DB({
            githubUrl,
            instanceType,
            ami,
            port,
            ec2Name,
            public_ip: publicIp,
          });
          console.log(EC2_MESSAGES.EC2_INSTANCE_CREATED, { instance });

          const instanceUrl = `${publicIp}:${port}`;

          res
            .status(StatusCodes.CREATED)
            .send(`Instance created successfully. URL : ${instanceUrl}`);
        } catch (error) {
          console.error("Error storing data in the database:", error);
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
  } catch (error) {
    console.log(EC2_MESSAGES.ERROR_CREATING_EC2_INSTANCE, { error });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const deleteEC2Configuration = async (req, res) => {
  try {
    const query = { _id: req.query.id };
    // check if instance already exists
    const instance = await READEC2DB(query);

    if (instance) {
      const { ec2Name, instanceType, ami, port } = instance;

      // Explicitly cast port to a number
      const portNumber = parseInt(port, 10);

      const scriptPath = path.resolve(__dirname, "../scripts/ec2/revert.sh");
      const scriptDir = path.dirname(scriptPath);

      const destroy = exec(
        `"${scriptPath}" "${portNumber}" "${instanceType}" "${ami}" "${ec2Name}"`,
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
            const deletedInstance = await DELETEEC2DB(query);
            console.log(EC2_MESSAGES.EC2_INSTANCE_TERMINATED, {
              deletedInstance,
            });
            res.status(StatusCodes.OK).send("Resources destroyed successfully");
          } catch (error) {
            console.error(EC2_MESSAGES.ERROR_TERMINATING_EC2_INSTANCE, error);
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
      res.status(StatusCodes.NOT_FOUND).json({ message: "Instance not found" });
    }
  } catch (error) {
    console.error("Error deleting EC2 configuration:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const readEC2Configuration = async (req, res) => {
  try {
    const query = !req.query.id ? {} : { _id: req.query.id };
    const instance = await READEC2DB(query, fields);

    if (instance.length > 0) {
      console.log(EC2_MESSAGES.EC2_INSTANCE_FOUND, { instance });

      return res.status(StatusCodes.OK).send(instance);
    } else {
      console.log(EC2_MESSAGES.EC2_INSTANCE_NOT_FOUND);
      return res
        .status(StatusCodes.NOT_FOUND)
        .send(EC2_MESSAGES.EC2_INSTANCE_NOT_FOUND);
    }
  } catch (error) {
    console.log(EC2_MESSAGES.ERROR_READING_EC2_INSTANCE, { error });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const updateEC2Configuration = async (req, res) => {
  res.send("updateEC2Configuration");
};

export {
  createEC2Configuration as CREATEEC2CONFIGURATION,
  readEC2Configuration as READEC2CONFIGURATION,
  updateEC2Configuration as UPDATEEC2CONFIGURATION,
  deleteEC2Configuration as DELETEEC2CONFIGURATION,
};
