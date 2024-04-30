import path from "path";
import { exec } from "child_process";
import { StatusCodes } from "http-status-codes";
import { SERVER_MESSAGES, SUBNET_MESSAGES } from "../../utils/messages/messages.js";

// DATABASE CONTROLLERS
import { CREATESUBNETDATABASE } from "../database/v2/subnetScriptDatabase.js";

const createSUBNET = async (req, res) => {

  try {
    const { 
      subnetVpcId,
      subnetName,
      subnetCidrBlock,
      subnetRegion,
    } = req.body;

    const scriptPath = path.resolve(
      new URL("../../scripts/v2/subnet/createSubnet.sh", import.meta.url).pathname
    );

    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `${scriptPath} --vpc-id ${subnetVpcId} --subnet-name ${subnetName} --cidr-block ${subnetCidrBlock} --region ${subnetRegion}`,
      { cwd: scriptDir }
    );

    // Handle completion of the script execution
    provision.on("close", async (code) => {
      console.log(`Script execution completed with code ${code}`);
        if (code === 0) {
            // Script executed successfully, store data in the database
            try {
                const subnetData = await CREATESUBNETDATABASE({
                    subnetVpcId,
                    subnetName,
                    subnetCidrBlock,
                    subnetRegion,
                });

                const response = await CREATESUBNETDATABASE(subnetData);

                res.status(StatusCodes.CREATED).json({
                    message: SERVER_MESSAGES.SUCCESS,
                    data: response,
                });
            } catch (error) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: SERVER_MESSAGES.ERROR,
                });
            }
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: SUBNET_MESSAGES.ERROR,
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

export { createSUBNET as CREATESUBNET};
