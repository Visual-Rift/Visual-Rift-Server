import { CLUSTERNAMEMODEL } from "../../../models/v1/clusterNameModel.js";
import { CLUSTER_MESSAGES } from "../../../utils/messages/messages.js";
// DATABASE OPERATIONS
const createCLUSTERDB = async (data) => {
  try {
    const result = await CLUSTERNAMEMODEL(data).save();
    if (result !== null) {
      console.log(CLUSTER_MESSAGES.CLUSTER_NAME_CREATED, {
        clusterId: result._id,
      });
      return result;
    } else {
      console.log(CLUSTERNAMEMODEL.ERROR_CREATING_CLUSTER_NAME, (data, error));
      return false;
    }
  } catch (error) {
    console.log(CLUSTERNAMEMODEL.ERROR_CREATING_CLUSTER_NAME, (data, error));
    return false;
  }
};

const readCLUSTERDB = async (query, fields) => {
  try {
    const result = await CLUSTERNAMEMODEL.find(query).select(fields);
    if (result.length > 0) {
      console.log(CLUSTERNAMEMODEL.CLUSTER_NAME_FOUND);
      return result;
    } else {
      console.log(CLUSTERNAMEMODEL.CLUSTER_NAME_NOT_FOUND);
      return false;
    }
  } catch (error) {
    console.log(CLUSTERNAMEMODEL.ERROR_READING_CLUSTER_NAME, {
      query,
      error,
    });
    return false;
  }
};

const updateCLUSTERDB = async (data) => {
  try {
    const result = await CLUSTERNAMEMODEL.findOneAndUpdate(data, {
      new: true,
    });
    if (result) {
      console.log(CLUSTERNAMEMODEL.CLUSTER_NAME_UPDATED, { clusterId: result });
      return result;
    } else {
      console.log(CLUSTERNAMEMODEL.CLUSTER_NAME_NOT_UPDATED, {
        clusterId: result,
      });
      return false;
    }
  } catch (error) {
    console.log(CLUSTERNAMEMODEL.ERROR_UPDATING_CLUSTER, (data, error));
    return false;
  }
};

const deleteCLUSTERDB = async (query) => {
  try {
    const result = await CLUSTERNAMEMODEL.findOneAndDelete(query);

    if (result) {
      console.log(CLUSTERNAMEMODEL.CLUSTER_NAME_TERMINATED, {
        clusterId: result._id,
      });
      return result;
    } else {
      console.log(CLUSTERNAMEMODEL.CLUSTER_NAME_NOT_TERMINATED, {
        clusterId: result._id,
      });
      return false;
    }
  } catch (error) {
    console.log(
      CLUSTERNAMEMODEL.ERROR_TERMINATING_CLUSTER_NAME,
      (query, error)
    );
    return false;
  }
};

export {
  createCLUSTERDB as CREATECLUSTERDB,
  deleteCLUSTERDB as DELETECLUSTERDB,
  updateCLUSTERDB as UPDATECLUSTERDB,
  readCLUSTERDB as READCLUSTERDB,
};
