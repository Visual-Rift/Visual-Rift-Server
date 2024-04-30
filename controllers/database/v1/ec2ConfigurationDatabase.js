import { EC2CONFIGURATIONMODEL } from "../../../models/v1/ec2ConfigurationModel.js";
import { EC2_MESSAGES } from "../../../utils/messages/messages.js";
// DATABASE OPERATIONS
const createEC2DB = async (data) => {
  try {
    const result = await EC2CONFIGURATIONMODEL(data).save();
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

const readEC2DB = async (query, fields) => {
  try {
    const result = await EC2CONFIGURATIONMODEL.find(query).select(fields);
    if (result.length > 0) {
      console.log(EC2_MESSAGES.EC2_INSTANCE_FOUND);
      return result;
    } else {
      console.log(EC2_MESSAGES.EC2_INSTANCE_NOT_FOUND);
      return false;
    }
  } catch (error) {
    console.log(EC2_MESSAGES.ERROR_READING_EC2_INSTANCE, {
      query,
      error,
    });
    return false;
  }
};

const updateEC2DB = async (data) => {
  try {
    const result = await EC2CONFIGURATIONMODEL.findOneAndUpdate(data, {
      new: true,
    });
    if (result) {
      console.log(EC2_MESSAGES.EC2_INSTANCE_UPDATED, { instanceId: result });
      return result;
    } else {
      console.log(EC2_MESSAGES.EC2_INSTANCE_NOT_UPDATED, {
        instanceId: result,
      });
      return false;
    }
  } catch (error) {
    console.log(EC2_MESSAGES.ERROR_UPDATING_INSTANCE, (data, error));
    return false;
  }
};

const deleteEC2DB = async (query) => {
  try {
    const result = await EC2CONFIGURATIONMODEL.findOneAndDelete(query);

    if (result) {
      console.log(EC2_MESSAGES.EC2_INSTANCE_TERMINATED, {
        instanceId: result._id,
      });
      return result;
    } else {
      console.log(EC2_MESSAGES.EC2_INSTANCE_NOT_TERMINATED, {
        instanceId: result._id,
      });
      return false;
    }
  } catch (error) {
    console.log(EC2_MESSAGES.ERROR_TERMINATING_EC2_INSTANCE, (query, error));
    return false;
  }
};

export {
  createEC2DB as CREATEEC2DB,
  deleteEC2DB as DELETEEC2DB,
  updateEC2DB as UPDATEEC2DB,
  readEC2DB as READEC2DB,
};
