import path from "path";
import { exec } from "child_process";
import { StatusCodes } from "http-status-codes";
import {
  SERVER_MESSAGES,
  EC2_MESSAGES,
} from "../../utils/messages/messages.js";

// DATABASE CONTROLLERS
import { CREATEEC2DATABASE } from "../database/v2/ec2ScriptDatabase.js";

const createEC2 = async (req, res) => {
  try {
    const {
      ec2Name,
      ec2InstanceType,
      ec2KeyPair,
      ec2SecurityGroup = "default",
      ec2Region,
      ec2AmiId,
      ec2StorageSize,
      ec2Count,
    } = req.body;

    const scriptPath = path.resolve(
      new URL("../../scripts/v2/ec2/createEc2.sh", import.meta.url).pathname
    );

    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `${scriptPath} --instance-name ${ec2Name} --instance-type ${ec2InstanceType} --key-name ${ec2KeyPair} --region ${ec2Region} --ami-id ${ec2AmiId} --storage-size ${ec2StorageSize} --count ${ec2Count}`,
      { cwd: scriptDir }
    );

    const ec2InstanceIds = [];

    // Capture stdout and stderr and log them
    provision.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      // Filter lines containing instance IDs
      const ids = data.split("\n");

      ec2InstanceIds.push(...ids.filter((id) => id.startsWith("i-")));
    });

    provision.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    // Handle completion of the script execution
    provision.on("close", async (code) => {
      console.log(`Script execution completed with code ${code}`);
      if (code === 0) {
        // Script executed successfully, store data in the database
        const ec2Data = {
          ec2Name,
          ec2InstanceType,
          ec2KeyPair,
          ec2SecurityGroup,
          ec2Region,
          ec2AmiId,
          ec2StorageSize,
          ec2InstanceIds,
        };

        const response = await CREATEEC2DATABASE(ec2Data);

        res.status(StatusCodes.CREATED).json({
          message: SERVER_MESSAGES.SUCCESS,
          data: response,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: EC2_MESSAGES.ERROR,
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

const deleteEc2 = async (req, res) => {
  try {
    const { ec2InstanceIds } = req.body;

    const scriptPath = path.resolve(
      new URL("../../scripts/v2/ec2/deleteEc2.sh", import.meta.url).pathname
    );

    const scriptDir = path.dirname(scriptPath);

    const finalEc2InstanceIds = [];

    for (const id of ec2InstanceIds) {
      finalEc2InstanceIds.push(`"${id}"`);
    }

    const provision = exec(`${scriptPath} '[${finalEc2InstanceIds}]'`, {
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
          "message": "EC2 instances deleted successfully.",
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: EC2_MESSAGES.ERROR,
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

export { createEC2 as CREATEEC2, deleteEc2 as DELETEEC2 };
