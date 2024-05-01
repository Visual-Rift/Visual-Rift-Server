import { StatusCodes } from "http-status-codes";
import { SERVER_MESSAGES, EC2_MESSAGES } from "../utils/messages/messages.js";
import { exec } from "child_process";
import axios from "axios"; // Import Axios for making HTTP requests

// CONSTANTS
const fields = {
  _v: 0,
  createdAt: 0,
  updatedAt: 0,
};

import path from "path";

const quickDeploy = async (req, res) => {
  try {
    const { githubUrl } = req.body;

    console.log("Received request to deploy from GitHub URL:", githubUrl);

    const scriptPath = path.resolve(
      new URL("../scripts/v1/quickDeploy/deploy.sh", import.meta.url).pathname
    );
    const scriptDir = path.dirname(scriptPath);

    const provision = exec(
      `"${scriptPath}" "${githubUrl}"`,
      // executes script in the script directory
      { cwd: scriptDir }
    );

    let output = ""; // Variable to store script output

    // Capture stdout and stderr and log them
    provision.stdout.on("data", async (data) => {
      console.log(`stdout: ${data}`);
      output += data; // Append stdout data to output

      // Send each log line to the API endpoint
      try {
        await axios.post('http://localhost:3000/api/v1/messages', {
          message: data.toString() // Convert data to string and send as message
        });
      } catch (error) {
        console.error('Error sending log message:', error);
      }
    });

    provision.stderr.on("data", async (data) => {
      console.error(`stderr: ${data}`);
      output += data; // Append stderr data to output

      // Send each stderr error line to the API endpoint
      try {
        await axios.post('http://localhost:3000/api/v1/messages', {
          message: data.toString(), // Convert data to string and send as message
          isError: true // Flag to indicate that this message is an error
        });
      } catch (error) {
        console.error('Error sending error message:', error);
      }
    });

    // Handle script completion
    provision.on("close", (code) => {
      console.log(`Script execution completed with code ${code}`);
      if (code === 0) {
        // If script executed successfully, extract the last line from the output
        const lines = output.trim().split("\n");
        const lastLine = lines[lines.length - 1];

        // Send the last line of output as the response
        res.status(StatusCodes.OK).json({ output: lastLine });
      } else {
        // If script execution failed, send appropriate error response
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Script execution failed" });
      }
    });
  } catch (error) {
    console.error("Error executing script:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error executing script" });
  }
};

export { quickDeploy };
