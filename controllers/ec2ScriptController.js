import path from "path";
import { exec } from "child_process";
import { StatusCodes } from "http-status-codes";
import { SERVER_MESSAGES, EC2_MESSAGES } from "../utils/messages/messages.js";

// CONSTANTS
const fields = {
  _v: 0,
  createdAt: 0,
  updatedAt: 0,
};

// DATABASE CONTROLLERS
import {
  CREATEEC2DATABASE,
  DELETEEC2DATABASE,
} from "./database/ec2ScriptDatabase.js";

// CONTROLLERS
const createEC2 = async (req, res) => {
  try {
    const {
      ec2Name,
      ec2InstanceType,
      ec2KeyPair,
      ec2SecurityGroup,
      ec2Region,
      ec2AmiId,
    } = req.body;

    const scriptPath = path.resolve(
      new URL("../scripts/v2/ec2/createEc2.sh", import.meta.url).pathname
    );
    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `${scriptPath} --name ${ec2Name} --instanceType ${ec2InstanceType} --keyPair ${ec2KeyPair} --securityGroup ${ec2SecurityGroup} --region ${ec2Region} --amiId ${ec2AmiId}`,
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
        const ec2Data = {
          ec2Name,
          ec2InstanceType,
          ec2KeyPair,
          ec2SecurityGroup,
          ec2Region,
          ec2AmiId,
          endpoint,
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

export { createEC2 as CREATEEC2 };
