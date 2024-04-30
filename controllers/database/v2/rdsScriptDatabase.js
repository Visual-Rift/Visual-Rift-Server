import { RDSSCRIPTMODEL } from "../../../models/v2/rdsScriptModel.js";
import { RDS_MESSAGES } from "../../../utils/messages/messages.js";

const createRDSDB = async (data) => {
  try {
    const result = await RDSSCRIPTMODEL(data).save();
    if (result !== null) {
      console.log(RDS_MESSAGES.RDS_INSTANCE_CREATED, {
        instanceId: result._id,
      });
      return result;
    } else {
      console.log(RDS_MESSAGES.ERROR_CREATING_RDS_INSTANCE, (data, error));
      return false;
    }
  } catch (error) {
    console.log(RDS_MESSAGES.ERROR_CREATING_RDS_INSTANCE, (data, error));
    return false;
  }
};

export { createRDSDB as CREATERDSDATABASE };
