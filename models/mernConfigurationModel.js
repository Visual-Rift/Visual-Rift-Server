import mongoose from "mongoose";
import moment from "moment-timezone";

const mernConfigurationSchema = new mongoose.Schema({
  frontendGithubUrl: {
    type: String,
    required: true,
  },
  frontendInstanceType: {
    type: String,
    required: true,
  },
  frontendAmi: {
    type: String,
    required: true,
  },
  frontendPort: {
    type: Number,
    required: true,
  },
  frontendEc2Name: {
    type: String,
    required: true,
  },
  backendGithubUrl: {
    type: String,
    required: true,
  },
  backendInstanceType: {
    type: String,
    required: true,
  },
  backendAmi: {
    type: String,
    required: true,
  },
  backendPort: {
    type: Number,
    required: true,
  },
  backendEc2Name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: () => moment().tz("Asia/Kolkata").toDate(),
    required: true,
  },
  updated_at: {
    type: Date,
    default: () => moment().tz("Asia/Kolkata").toDate(),
    required: false,
  },
});

const mernConfigurationModel = mongoose.model("mern", mernConfigurationSchema);

export { mernConfigurationModel as MERNCONFIGURATIONMODEL };
