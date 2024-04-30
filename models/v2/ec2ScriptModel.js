import mongoose from "mongoose";

const ec2ScriptSchema = new mongoose.Schema(
  {
    ec2Name: {
      type: String,
      required: true,
    },
    ec2InstanceType: {
      type: String,
      required: true,
    },
    ec2KeyPair: {
      type: String,
      required: true,
    },
    ec2SecurityGroup: {
      type: String,
      required: true,
    },
    ec2Region: {
      type: String,
      required: true,
    },
    ec2AmiId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ec2ScriptModel = mongoose.model("ec2Script", ec2ScriptSchema);

export { ec2ScriptModel as EC2SCRIPTMODEL };
