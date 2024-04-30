import mongoose from "mongoose";

const vpcScriptSchema = new mongoose.Schema(
  {
    vpcName: {
      type: String,
      required: true,
    },
    vpcCIDRBlock: {
        type: String,
        required: true,
      },
    vpcRegion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const vpcScriptModel = mongoose.model("vpcScript", vpcScriptSchema);

export { vpcScriptModel as VPCSCRIPTMODEL };