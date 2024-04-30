import { SUBNETSCRIPTMODEL } from "../../../models/v2/subnetScriptModel.js";
import { SUBNET_MESSAGES } from "../../../utils/messages/messages.js";

const createSUBNETDB = async (data) => {
  try {
    const result = await SUBNETSCRIPTMODEL(data).save();
    if (result !== null) {
      console.log(SUBNET_MESSAGES.SUBNET_INSTANCE_CREATED, {
        instanceId: result._id,
      });
      return result;
    } else {
      console.log(SUBNET_MESSAGES.ERROR_CREATING_SUBNET_INSTANCE, (data, error));
      return false;
    }
  } catch (error) {
    console.log(SUBNET_MESSAGES.ERROR_CREATING_SUBNET_INSTANCE, (data, error));
    return false;
  }
};

export { createSUBNETDB as CREATESUBNETDATABASE };
