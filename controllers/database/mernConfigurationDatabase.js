import { MERNCONFIGURATIONMODEL } from "../../models/mernConfigurationModel.js";
import { MERN_MESSAGES } from "../../utils/messages/messages.js";

// DATABASE OPERATIONS
const createMERNDB = async (data) => {
  try {
    const result = await MERNCONFIGURATIONMODEL(data).save();
    if (result !== null) {
      console.log(MERN_MESSAGES.MERN_INSTANCE_CREATED, {
        mernId: result._id,
      });
      return result;
    } else {
      console.log(MERN_MESSAGES.ERROR_CREATING_MERN_INSTANCE, (data, error));
      return false;
    }
  } catch (error) {
    console.log(MERN_MESSAGES.ERROR_CREATING_MERN_INSTANCE, (data, error));
    return false;
  }
};

const readMERNDB = async (query, fields) => {
  try {
    const result = await MERNCONFIGURATIONMODEL.find(query).select(fields);
    if (result.length > 0) {
      console.log(MERN_MESSAGES.MERN_INSTANCE_FOUND);
      return result;
    } else {
      console.log(MERN_MESSAGES.MERN_INSTANCE_NOT_FOUND);
      return false;
    }
  } catch (error) {
    console.log(MERN_MESSAGES.ERROR_READING_MERN_INSTANCE, {
      query,
      error,
    });
    return false;
  }
};

const updateMERNDB = async (data) => {
  try {
    const result = await MERNCONFIGURATIONMODEL.findOneAndUpdate(data, {
      new: true,
    });
    if (result) {
      console.log(MERN_MESSAGES.MERN_INSTANCE_UPDATED, { instanceId: result });
      return result;
    } else {
      console.log(MERN_MESSAGES.MERN_INSTANCE_NOT_UPDATED, {
        instanceId: result,
      });
      return false;
    }
  } catch (error) {
    console.log(MERN_MESSAGES.ERROR_UPDATING_INSTANCE, (data, error));
    return false;
  }
};

const deleteMERNDB = async (query) => {
  try {
    const result = await MERNCONFIGURATIONMODEL.findOneAndDelete(query);

    if (result) {
      console.log(MERN_MESSAGES.MERN_INSTANCE_TERMINATED, {
        instanceId: result._id,
      });
      return result;
    } else {
      console.log(MERN_MESSAGES.MERN_INSTANCE_NOT_TERMINATED, {
        instanceId: result._id,
      });
      return false;
    }
  } catch (error) {
    console.log(MERN_MESSAGES.ERROR_TERMINATING_MERN_INSTANCE, (query, error));
    return false;
  }
};

export {
  createMERNDB as CREATEMERNDB,
  readMERNDB as READMERNDB,
  updateMERNDB as updateMERNDB,
  deleteMERNDB as DELETEMERNDB,
  
};
