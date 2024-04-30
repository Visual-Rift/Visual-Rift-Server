import { StatusCodes } from "http-status-codes";
import {
  SERVER_MESSAGES,
  MERN_MESSAGES,
} from "../../utils/messages/messages.js";
import { exec } from "child_process";

//COSTANTS
const fields = {
  _v: 0,
  createdAt: 0,
  updatedAt: 0,
};

// DATABASE CONTROLLERS

import {
  CREATEMERNDB,
  READMERNDB,
  DELETEMERNDB,
} from "../database/v1/mernConfigurationDatabase.js";

import path from "path";

// CONTROLLERS
const createMernConfiguration = async (req, res) => {
  try {
    const {
      frontendGithubUrl,
      frontendInstanceType,
      frontendAmi,
      frontendPort,
      frontendec2Name,
      backendGithubUrl,
      backendInstanceType,
      backendAmi,
      backendPort,
      backendec2Name,
    } = req.body;

    const frontendScriptPath = path.resolve(
      new URL("../scripts/ec2/remote.sh", import.meta.url).pathname
    );
    const frontendScriptDir = path.dirname(frontendScriptPath);

    const provision = exec(
      `"${frontendScriptPath}" "${frontendPort}" "${frontendGithubUrl}" "${frontendInstanceType}" "${frontendAmi}" "${frontendec2Name}" "${backendPort}" "${backendGithubUrl}" "${backendInstanceType}" "${backendAmi}" "${backendec2Name}"`,
      // executes script in the script directory
      { cwd: frontendScriptDir }
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
          const mern = await CREATEMERNDB({
            frontendGithubUrl,
            frontendInstanceType,
            frontendAmi,
            frontendPort,
            frontendec2Name,
            backendGithubUrl,
            backendInstanceType,
            backendAmi,
            backendPort,
            backendec2Name,
            public_ip: publicIp,
          });
          console.log(MERN_MESSAGES.MERN_INSTANCE_CREATED, { mern });

          const frontendInstanceUrl = `${publicIp}:${frontendPort}`;
          const backendInstanceUrl = `${publicIp}:${backendPort}`;

          if (mern) {
            res.status(StatusCodes.CREATED).json({
              message: SERVER_MESSAGES.INSTANCE_CREATED,
              frontendInstanceId: mern._id,
              backendInstanceId: mern._id,
            });
          }
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
    console.log(MERN_MESSAGES.ERROR_CREATING_MERN_INSTANCE, { error });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const deleteMernConfiguration = async (req, res) => {
  try {
    const query = { _id: req.query.id };
    const mern = await READMERNDB(query);

    if (mern) {
      const {
        frontendec2Name,
        backendec2Name,
        frontendPort,
        backendPort,
        frontendAmi,
        backendAmi,
        frontendInstanceType,
        backendInstanceType,
      } = mern;

      const portNumber = parseInt(frontendPort, 10);

      const frontendScriptPath = path.resolve(
        __dirname,
        "../scripts/mern/deleteEC2.sh"
      );
      const frontendScriptDir = path.dirname(frontendScriptPath);

      const destroy = exec(
        `"${frontendScriptPath}" "${frontendec2Name}" "${backendec2Name}" "${frontendPort}" "${backendPort}" "${frontendAmi}" "${backendAmi}" "${frontendInstanceType}" "${backendInstanceType}"`,
        { cwd: frontendScriptDir }
      );

      destroy.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      destroy.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      destroy.on("close", async (code) => {
        console.log(`Script execution completed with code ${code}`);
        if (code === 0) {
          try {
            const mern = await DELETEMERNDB(query);
            console.log(MERN_MESSAGES.MERN_INSTANCE_DELETED, { mern });
            res.status(StatusCodes.OK).json({
              message: SERVER_MESSAGES.INSTANCE_DELETED,
            });
          } catch (error) {
            console.error("Error deleting data in the database:", error);
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
          }
        } else {
          console.error("Error executing script");
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error executing script" });
        }
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        message: SERVER_MESSAGES.INSTANCE_NOT_FOUND,
      });
    }
  } catch (error) {
    console.error(MERN_MESSAGES.ERROR_CREATING_MERN_INSTANCE, error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const readMernConfiguration = async (req, res) => {
  try {
    const query = !req.query.id ? {} : { _id: req.query.id };

    const mern = await READMERNDB(query, fields);

    if (mern) {
      res
        .status(StatusCodes.OK)
        .json({ message: SERVER_MESSAGES.INSTANCE_FOUND, mern });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: SERVER_MESSAGES.INSTANCE_NOT_FOUND });
    }
  } catch (error) {
    console.error(MERN_MESSAGES.ERROR_READING_MERN_INSTANCE, error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(SERVER_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const updateMernConfiguration = async (req, res) => {
  res.status(StatusCodes.NOT_IMPLEMENTED).send(SERVER_MESSAGES.NOT_IMPLEMENTED);
};

export {
  createMernConfiguration as CREATEMERNCONFIGURATION,
  deleteMernConfiguration as DELETEMERNCONFIGURATION,
  readMernConfiguration as READMERNCONFIGURATION,
  updateMernConfiguration as UPDATEMERNCONFIGURATION,
};
