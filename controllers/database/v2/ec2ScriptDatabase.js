import { EC2SCRIPTMODEL } from "../../../models/v2/ec2ScriptModel.js";
import { EC2_MESSAGES } from "../../../utils/messages/messages.js";

const createEC2DB = async (data) => {
  try {
    const result = await EC2SCRIPTMODEL(data).save();
    if (result !== null) {
      console.log(EC2_MESSAGES.EC2_INSTANCE_CREATED, {
        instanceId: result._id,
      });
      return result;
    } else {
      console.log(EC2_MESSAGES.ERROR_CREATING_EC2_INSTANCE, (data, error));
      return false;
    }
  } catch (error) {
    console.log(EC2_MESSAGES.ERROR_CREATING_EC2_INSTANCE, (data, error));
    return false;
  }
};

export { createEC2DB as CREATEEC2DATABASE };
