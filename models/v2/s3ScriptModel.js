import mongoose from "mongoose";

const s3ScriptSchema = new mongoose.Schema(
  {
    s3BucketName: {
      type: String,
      required: true,
    },
    s3Region: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const s3ScriptModel = mongoose.model("s3Script", s3ScriptSchema);

export { s3ScriptModel as S3SCRIPTMODEL };