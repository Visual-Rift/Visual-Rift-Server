import path from "path";
import { exec } from "child_process";
import { StatusCodes } from "http-status-codes";
import { SERVER_MESSAGES, ECR_MESSAGES } from "../../utils/messages/messages.js";

// DATABASE CONTROLLERS
import { CREATEECRDATABASE } from "../database/v2/ecrScriptDatabase.js";

const createECR = async (req, res) => {
  try {
    const { ecrRepoName, ecrRegion = "us-east-1" } = req.body;

    const scriptPath = path.resolve(
      new URL("../../scripts/v2/ecr/createECR.sh", import.meta.url).pathname
    );

    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `${scriptPath} --repository-name ${ecrRepoName} --region ${ecrRegion}`,
      { cwd: scriptDir }
    );

    // Handle completion of the script execution
    provision.on("close", async (code) => {
      console.log(`Script execution completed with code ${code}`);
      if (code === 0) {
        // Script executed successfully, store data in the database
        const ecrData = {
        ecrRepoName,
        ecrRegion,
        };

        const response = await CREATEECRDATABASE(ecrData);

        res.status(StatusCodes.CREATED).json({
          message: SERVER_MESSAGES.SUCCESS,
          data: response,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ECR_MESSAGES.ERROR,
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

const deleteECR = async (req, res) => {
  try {
    const { ecrRepoName, ecrRegion } = req.body;

    const scriptPath = path.resolve(
      new URL("../../scripts/v2/ecr/deleteECR.sh", import.meta.url).pathname
    );

    const scriptDir = path.dirname(scriptPath);

    const provision = exec(`${scriptPath} --repository-name ${ecrRepoName} --region ${ecrRegion}`, {
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
          message: "ECR deleted successfully.",
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ECR_MESSAGES.ERROR,
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

export { createECR as CREATEECR, deleteECR as DELETEECR };
