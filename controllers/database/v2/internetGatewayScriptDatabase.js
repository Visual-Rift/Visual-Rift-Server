import { IGSCRIPTMODEL } from "../../../models/v2/internetGatewayScriptModel.js";
import { IG_MESSAGES } from "../../../utils/messages/messages.js";

const createIGDB = async (data) => {
  try {
    const result = await IGSCRIPTMODEL(data).save();
    if (result !== null) {
      console.log(IG_MESSAGES.IG_CREATED, {
        instanceId: result._id,
      });
      return result;
    } else {
      console.log(IG_MESSAGES.ERROR_CREATING_IG, (data, error));
      return false;
    }
  } catch (error) {
    console.log(IG_MESSAGES.ERROR_CREATING_IG, (data, error));
    return false;
  }
};

export { createIGDB as CREATEIGDATABASE };