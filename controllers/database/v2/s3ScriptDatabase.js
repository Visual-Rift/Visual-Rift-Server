import { S3SCRIPTMODEL } from "../../../models/v2/s3ScriptModel.js";
import { S3_MESSAGES } from "../../../utils/messages/messages.js";

const createS3DB = async (data) => {
  try {
    const result = await S3SCRIPTMODEL(data).save();
    if (result !== null) {
      console.log(S3_MESSAGES.S3_BUCKET_CREATED, {
        instanceId: result._id,
      });
      return result;
    } else {
      console.log(S3_MESSAGES.ERROR_CREATING_S3_BUCKET, (data, error));
      return false;
    }
  } catch (error) {
    console.log(S3_MESSAGES.ERROR_CREATING_S3_BUCKET, (data, error));
    return false;
  }
};

export { createS3DB as CREATES3DATABASE };