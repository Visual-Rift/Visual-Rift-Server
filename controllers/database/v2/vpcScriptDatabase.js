import { VPCSCRIPTMODEL } from "../../../models/v2/vpcScriptModel.js";
import { VPC_MESSAGES } from "../../../utils/messages/messages.js";

const createVPC = async (data) => {
  try {
    const result = await VPCSCRIPTMODEL(data).save();
    if (result !== null) {
      console.log(VPC_MESSAGES.VPC_BUCKET_CREATED, {
        instanceId: result._id,
      });
      return result;
    } else {
      console.log(VPC_MESSAGES.ERROR_CREATING_VPC, (data, error));
      return false;
    }
  } catch (error) {
    console.log(VPC_MESSAGES.ERROR_CREATING_VPC, (data, error));
    return false;
  }
};

export { createVPC as CREATEVPCDATABASE };