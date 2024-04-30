import mongoose from "mongoose";

const rdsScriptSchema = new mongoose.Schema(
  {
    rdsName: {
      type: String,
      required: true,
    },
    rdsClass: {
      type: String,
      required: true,
    },
    rdsEngineName: {
      type: String,
      required: true,
    },
    rdsEngineVersion: {
      type: String,
      required: true,
    },
    rdsUsername: {
      type: String,
      required: true,
    },
    rdsPassword: {
      type: String,
      required: true,
    },
    rdsRegion: {
      type: String,
      required: true,
    },
    rdsAllocatedStorage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const rdsScriptModel = mongoose.model("rdsScript", rdsScriptSchema);

export { rdsScriptModel as RDSSCRIPTMODEL };
