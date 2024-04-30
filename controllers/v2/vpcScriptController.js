import path from "path";
import { exec } from "child_process";
import { StatusCodes } from "http-status-codes";
import {
  SERVER_MESSAGES,
  VPC_MESSAGES,
} from "../../utils/messages/messages.js";

// DATABASE CONTROLLERS
import { CREATEVPCDATABASE } from "../database/v2/vpcScriptDatabase.js";
import {VPCSCRIPTMODEL} from "../../models/v2/vpcScriptModel.js";

const createVPC = async (req, res) => {
  try {
    const {
      vpcName,
      vpcCIDRBlock = '172.31.0.0/16',
      vpcRegion = "us-east-1" // Default to us-east-1
    } = req.body;

    const scriptPath = path.resolve(
      new URL("../../scripts/v2/vpc/createVPC.sh", import.meta.url).pathname
    );

    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `${scriptPath} --vpc-name ${vpcName} --cidr-block ${vpcCIDRBlock} --region ${vpcRegion} `,
      { cwd: scriptDir }
    );

    let vpcId;

    // Capture stdout and stderr and log them
    provision.stdout.on("data", async (data) => {
      console.log(`stdout: ${data}`);
      // Filter lines containing instance IDs
      if (data.includes("VpcId")) {
        vpcId = data.trim().split("\t")[1];
        console.log(`VPC ID: ${vpcId}`);
        
        // Store the VPC ID in the database
        const vpcData = {
          vpcName,
          vpcRegion,
          vpcCIDRBlock,
          vpcId
        };
        await CREATEVPCDATABASE(vpcData);
      }
    });

    provision.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    // Handle completion of the script execution
    provision.on("close", (code) => {
      console.log(`Script execution completed with code ${code}`);
      if (code === 0) {
        res.status(StatusCodes.CREATED).json({
          message: SERVER_MESSAGES.SUCCESS,
          data: {
            vpcId: vpcId,
          },
        });
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
    });
  }
};

export { createVPC as CREATEVPC};