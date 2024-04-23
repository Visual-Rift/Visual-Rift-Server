import mongoose from "mongoose";
import moment from "moment-timezone";

const ec2ConfigurationSchema = new mongoose.Schema({
  ec2_name: {
    type: String,
    required: true,
  },
  public_ip: {
    type: String,
    required: true,
  },
  githubUrl: {
    type: String,
    required: true,
  },
  instance_type: {
    type: String,
    required: true,
  },
  ami: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
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

const ec2ConfigurationModel = mongoose.model("ec2", ec2ConfigurationSchema);

export { ec2ConfigurationModel as EC2CONFIGURATIONMODEL };
