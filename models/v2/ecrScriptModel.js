import mongoose from "mongoose";

const ecrScriptSchema = new mongoose.Schema(
  {
    ecrRepoName: {
      type: String,
      required: true,
    },
    ecrRegion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ecrScriptModel = mongoose.model("ecrScript", ecrScriptSchema);

export { ecrScriptModel as ECRSCRIPTMODEL };