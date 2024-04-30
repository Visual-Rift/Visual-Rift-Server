import { ECRSCRIPTMODEL } from "../../../models/v2/ecrScriptModel.js";
import { ECR_MESSAGES } from "../../../utils/messages/messages.js";

const createECRDB = async (data) => {
  try {
    const result = await ECRSCRIPTMODEL(data).save();
    if (result !== null) {
      console.log(ECR_MESSAGES.ECR_INSTANCE_CREATED, {
        instanceId: result._id,
      });
      return result;
    } else {
      console.log(ECR_MESSAGES.ERROR_CREATING_ECR_INSTANCE, (data, error));
      return false;
    }
  } catch (error) {
    console.log(ECR_MESSAGES.ERROR_CREATING_ECR_INSTANCE, (data, error));
    return false;
  }
};

export { createECRDB as CREATEECRDATABASE };
