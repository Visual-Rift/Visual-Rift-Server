import path from "path";
import { StatusCodes } from "http-status-codes";
import { SERVER_MESSAGES, RDS_MESSAGES } from "../utils/messages/messages.js";
import { exec } from "child_process";

//CONSTANTS
const fields = {
  _v: 0,
  createdAt: 0,
  updatedAt: 0,
};

// DATABASE CONTROLLERS
import { CREATERDSDATABASE } from "./database/rdsScriptDatabase.js";

// CONTROLLERS
const CREATERDS = async (req, res) => {
  try {
    const { rdsName, rdsEngine, rdsUsername, rdsPassword, rdsPort } = req.body;

    const scriptPath = path.resolve(
      new URL("../scripts/rds/remote.sh", import.meta.url).pathname
    );
    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `"${scriptPath}" "${rdsName}" "${rdsEngine}" "${rdsUsername}" "${rdsPassword}" "${rdsPort}"`,
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
          const rds = await CREATERDSDATABASE({
            rdsName,
            rdsEngine,
            rdsUsername,
            rdsPassword,
            rdsPort,
            endpoint,
          });

          res.status(StatusCodes.CREATED).json({
            message: SERVER_MESSAGES.SUCCESS,
            data: rds,
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
