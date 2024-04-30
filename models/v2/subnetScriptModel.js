import mongoose from "mongoose";

const subnetScriptSchema = new mongoose.Schema(
  {
    subnetVpcId: {
      type: String,
      required: true,
    },
    subnetName: {
      type: String,
      required: true,
    },
    subnetCidrBlock: {
      type: String,
      required: true,
    },
    subnetRegion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const subnetScriptModel = mongoose.model("subnetScript", subnetScriptSchema);

export { subnetScriptModel as SUBNETSCRIPTMODEL };
