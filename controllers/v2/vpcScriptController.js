import path from "path";
import { exec } from "child_process";
import { StatusCodes } from "http-status-codes";
import { SERVER_MESSAGES, VPC_MESSAGES } from "../../utils/messages/messages.js";
import axios from "axios"; // Import axios for making HTTP requests

// DATABASE CONTROLLERS
import { CREATEVPCDATABASE } from "../database/v2/vpcScriptDatabase.js";
import { VPCSCRIPTMODEL } from "../../models/v2/vpcScriptModel.js";

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

        // Send each log line to the API endpoint
        try {
          await axios.post("http://localhost:3000/api/v1/messages", {
            message: data.toString(), // Convert data to string and send as message
          });
        } catch (error) {
          console.error("Error sending log message:", error);
        }
      }
    });

    provision.stderr.on("data", async (data) => {
      console.error(`stderr: ${data}`);

      // Send each stderr error line to the API endpoint
      try {
        await axios.post("http://localhost:3000/api/v1/messages", {
          message: data.toString(), // Convert data to string and send as message
          isError: true, // Flag to indicate that this message is an error
        });
      } catch (error) {
        console.error("Error sending error message:", error);
      }
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

export { createVPC as CREATEVPC };
