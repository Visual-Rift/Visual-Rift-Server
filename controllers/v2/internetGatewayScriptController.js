import path from "path";
import { exec } from "child_process";
import { StatusCodes } from "http-status-codes";
import { SERVER_MESSAGES, IG_MESSAGES } from "../../utils/messages/messages.js";

// DATABASE CONTROLLERS
import { CREATEIGDATABASE } from "../database/v2/internetGatewayScriptDatabase.js";

const createIG = async (req, res) => {
  try {
    const { igVpcId,igName, igRegion = "us-east-1" } = req.body;

    const scriptPath = path.resolve(
      new URL("../../scripts/v2/internetGateway/createInternetGateway.sh", import.meta.url).pathname
    );

    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `${scriptPath} --vpc-id ${igVpcId} --gateway-name ${igName} --region ${igRegion}`,
      { cwd: scriptDir }
    );

    // Handle completion of the script execution
    provision.on("close", async (code) => {
      console.log(`Script execution completed with code ${code}`);
      if (code === 0) {
        // Script executed successfully, store data in the database
        const igData = {
          igVpcId,
          igRegion,
          igName,
        };

        const response = await CREATEIGDATABASE(igData);

        res.status(StatusCodes.CREATED).json({
          message: SERVER_MESSAGES.SUCCESS,
          data: response,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: IG_MESSAGES.ERROR,
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


export { createIG as CREATEIG};