import path from "path";
import { StatusCodes } from "http-status-codes";
import {
  SERVER_MESSAGES,
} from "../../utils/messages/messages.js";
import { exec } from "child_process";

//CONSTANTS
const fields = {
  _v: 0,
  createdAt: 0,
  updatedAt: 0,
};

// DATABASE CONTROLLERS
import { CREATERDSDATABASE } from "../database/v2/rdsScriptDatabase.js";

// CONTROLLERS
const createRDS = async (req, res) => {
  try {
    const {
      rdsName,
      rdsEngineName,
      rdsEngineVersion,
      rdsUsername,
      rdsPassword,
      rdsClass,
      rdsRegion,
      rdsAllocatedStorage,
    } = req.body;

    const scriptPath = path.resolve(
      new URL("../../scripts/v2/rds/createRds.sh", import.meta.url).pathname
    );
    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `${scriptPath} --identifier ${rdsName} --class ${rdsClass} --engine ${rdsEngineName} --version ${rdsEngineVersion} --username ${rdsUsername} --password ${rdsPassword}  --region ${rdsRegion} --allocated-storage ${rdsAllocatedStorage}`,
      // executes script in the script directory
      { cwd: scriptDir }
    );

    let endpoint = null;

    // Capture stdout and stderr and log them
    provision.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);

      // Assuming the last line of output is the public IP
      endpoint = data.trim();
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
          const rdsData = await CREATERDSDATABASE({
            rdsName,
            rdsEngineName,
            rdsEngineVersion,
            rdsUsername,
            rdsPassword,
            rdsClass,
            rdsRegion,
            rdsAllocatedStorage,
            rdsEndpoint: endpoint,
          });

          const response = await CREATERDSDATABASE(rdsData);

          res.status(StatusCodes.CREATED).json({
            message: SERVER_MESSAGES.SUCCESS,
            data: response,
          });
        } catch (error) {
          console.error(error);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: SERVER_MESSAGES.ERROR,
            error,
          });
        }
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: SERVER_MESSAGES.ERROR,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.ERROR,
      error,
    });
  }
};

const deleteRDS = async (req, res) => {
  try {
    const { rdsName, rdsRegion } = req.body;

    const scriptPath = path.resolve(
      new URL("../scripts/v2/rds/deleteRds.sh", import.meta.url).pathname
    );

    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `${scriptPath} --identifier ${rdsName} --region ${rdsRegion}`,
      { cwd: scriptDir }
    );

    // Capture stdout and stderr and log them
    provision.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    provision.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    // Handle completion of the script execution
    provision.on("close", async (code) => {
      console.log(`Script execution completed with code ${code}`);
      if (code === 0) {
        res.status(StatusCodes.OK).json({
          message: "RDS deleted successfully.",
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: RDS_MESSAGES.ERROR,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGES.ERROR,
    });
  }
};

export { createRDS as CREATERDS , deleteRDS as DELETERDS};
