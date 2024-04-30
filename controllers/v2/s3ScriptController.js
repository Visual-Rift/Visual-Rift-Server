import path from "path";
import { exec } from "child_process";
import { StatusCodes } from "http-status-codes";
import {
  SERVER_MESSAGES,
  S3_MESSAGES,
} from "../../utils/messages/messages.js";

// DATABASE CONTROLLERS
import { CREATES3DATABASE } from "../database/v2/s3ScriptDatabase.js";

const createS3 = async (req, res) => {
  try {
    const {
      s3BucketName,
      s3Region = "us-east-1"
    } = req.body;

    const scriptPath = path.resolve(
      new URL("../../scripts/v2/s3/createS3.sh", import.meta.url).pathname
    );

    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `${scriptPath} --bucket-name ${s3BucketName} --region ${s3Region}`,
      { cwd: scriptDir }
    );

    // Handle completion of the script execution
    provision.on("close", async (code) => {
      console.log(`Script execution completed with code ${code}`);
      if (code === 0) {
        // Script executed successfully, store data in the database
        const s3Data = {
            s3BucketName,
            s3Region
        };

        const response = await CREATES3DATABASE(s3Data);

        res.status(StatusCodes.CREATED).json({
          message: SERVER_MESSAGES.SUCCESS,
          data: response,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: S3_MESSAGES.ERROR,
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

const deleteS3 = async (req, res) => {
  try {
    const scriptPath = path.resolve(
      new URL("../../scripts/v2/s3/deleteS3.sh", import.meta.url).pathname
    );

    const scriptDir = path.dirname(scriptPath);


    const provision = exec(`${scriptPath} --bucket-name ${s3BucketName}`, {
      cwd: scriptDir,
    });

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
          message: "S3 bucket deleted successfully.",
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: S3_MESSAGES.ERROR,
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

export { createS3 as CREATES3, deleteS3 as DELETES3 };