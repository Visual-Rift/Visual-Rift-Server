import mongoose from "mongoose";

const igScriptSchema = new mongoose.Schema(
  {
    igVpcId: {
      type: String,
      required: true,
    },
    igName: {
      type: String,
      required: true,
    },
    igRegion: {
        type: String,
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

const igScriptModel = mongoose.model("igScript", igScriptSchema);

export { igScriptModel as IGSCRIPTMODEL };