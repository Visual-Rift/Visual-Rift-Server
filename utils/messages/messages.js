const DB_MESSAGES = {
  DATABASE_CONNECTED: "Database connected ✅ ",
  DATABASE_CONNECTION_ERROR: "Database connection error ❌ ",
  DATABASE_DISCONNECTED: "Database disconnected ✅ ",
  DATABASE_DISCONNECTION_ERROR: "Database disconnection error ❌ ",
};

const SERVER_MESSAGES = {
  SERVER_CONNECTED: "Server connected ✅ ",
  SERVER_CONNECTION_ERROR: "Server connection error ❌ ",
  SERVER_DISCONNECTED: "Server disconnected ✅ ",
  SERVER_DISCONNECTION_ERROR: "Server disconnection error ❌ ",
  AUTHORIZED_ACCESS: "Authorized access ✅ ",
  UNAUTHORIZED_ACCESS: "Unauthorized access ❌ ",
  INTERNAL_SERVER_ERROR: "Internal Server Error ❌ ",
};

const USER_MESSAGES = {
  USER_DOES_NOT_EXIST: "User Does Not Exist ❌ ",
  USER_ALREADY_EXISTS: "User Already Exists ❌ ",
  USER_LOGGED_IN: "User Logged In ✅ ",
  USER_LOGGED_OUT: "User Logged Out ✅ ",
  USER_NOT_AUTHORIZED: "User Not Authorized ❌ ",
  USER_CREATED: "User Created ✅ ",
  USER_NOT_CREATED: "User Not Created ❌ ",
  USER_READ: "User Read ✅ ",
  USER_NOT_READ: "User Not Read ❌ ",
  USER_FOUND: "User Found ✅ ",
  USER_NOT_FOUND: "User Not Found ❌ ",
  USER_UPDATED: "User Updated ✅ ",
  USER_NOT_UPDATED: "User Not Updated ❌ ",
  USER_DELETED: "User Deleted ✅ ",
  USER_NOT_DELETED: "User Not Deleted ❌ ",
  ERROR_CREATING_USER: "Error Creating User ❌ ",
  ERROR_READING_USER: "Error Reading User ❌ ",
  ERROR_UPDATING_USER: "Error Updating User ❌ ",
  ERROR_DELETING_USER: "Error Deleting User ❌ ",
};
const EC2_MESSAGES = {
  EC2_INSTANCE_FOUND: "EC2 Instance FOUND ✅",
  EC2_INSTANCE_UPDATED: "EC2 Instance Updated ✅",
  EC2_INSTANCE_NOT_UPDATED: "EC2 Instance Not Updated ❌",
  EC2_INSTANCE_NOT_FOUND: "EC2 Instance Not Found ❌ ",
  EC2_INSTANCE_ALREADY_EXISTS: "EC2 Instance Already Exists ❌ ",
  EC2_INSTANCE_CREATED: "EC2 Instance Created ✅ ",
  EC2_INSTANCE_NOT_CREATED: "EC2 Instance Not Created ❌ ",
  EC2_INSTANCE_STARTED: "EC2 Instance Started ✅ ",
  EC2_INSTANCE_STOPPED: "EC2 Instance Stopped ✅ ",
  EC2_INSTANCE_TERMINATED: "EC2 Instance Terminated ✅ ",
  EC2_INSTANCE_NOT_TERMINATED: "EC2 Instance Not Terminated ❌ ",
  ERROR_CREATING_EC2_INSTANCE: "Error Creating EC2 Instance ❌ ",
  ERROR_STARTING_EC2_INSTANCE: "Error Starting EC2 Instance ❌ ",
  ERROR_STOPPING_EC2_INSTANCE: "Error Stopping EC2 Instance ❌ ",
  ERROR_TERMINATING_EC2_INSTANCE: "Error Terminating EC2 Instance ❌ ",
  ERROR_READING_EC2_INSTANCE: "Error Reading EC2 Instance ❌",
  ERROR_UPDATING_INSTANCE: "Error Updating EC2 Instance ❌",
};

const SCRIPT_MESSAGES = {
  SCRIPT_EXECUTED: "Script Executed ✅ ",
  SCRIPT_NOT_EXECUTED: "Script Not Executed ❌ ",
  ERROR_EXECUTING_SCRIPT: "Error Executing Script ❌ ",
};

const CLUSTER_MESSAGES = {
  CLUSTER_NAME_FOUND: "Cluster Name Found ✅ ",
  CLUSTER_NAME_NOT_FOUND: "Cluster Name Not Found ❌ ",
  CLUSTER_NAME_ALREADY_EXISTS: "Cluster Name Already Exists ❌ ",
  CLUSTER_NAME_CREATED: "Cluster Name Created ✅ ",
  CLUSTER_NAME_NOT_CREATED: "Cluster Name Not Created ❌ ",
  CLUSTER_NAME_UPDATED: "Cluster Name Updated ✅ ",
  CLUSTER_NAME_NOT_UPDATED: "Cluster Name Not Updated ❌ ",
  CLUSTER_NAME_TERMINATED: "Cluster Name Terminated ✅ ",
  CLUSTER_NAME_NOT_TERMINATED: "Cluster Name Not Terminated ❌ ",
  ERROR_CREATING_CLUSTER_NAME: "Error Creating Cluster Name ❌ ",
  ERROR_READING_CLUSTER_NAME: "Error Reading Cluster Name ❌ ",
  ERROR_UPDATING_CLUSTER: "Error Updating Cluster Name ❌ ",
  ERROR_TERMINATING_CLUSTER: "Error Terminating Cluster Name ❌ ",
};

const MERN_MESSAGES = {
  MERN_INSTANCE_FOUND: "MERN Instance Found ✅ ",
  MERN_INSTANCE_NOT_FOUND: "MERN Instance Not Found ❌ ",
  MERN_INSTANCE_ALREADY_EXISTS: "MERN Instance Already Exists ❌ ",
  MERN_INSTANCE_CREATED: "MERN Instance Created ✅ ",
  MERN_INSTANCE_NOT_CREATED: "MERN Instance Not Created ❌ ",
  MERN_INSTANCE_UPDATED: "MERN Instance Updated ✅ ",
  MERN_INSTANCE_NOT_UPDATED: "MERN Instance Not Updated ❌ ",
  MERN_INSTANCE_TERMINATED: "MERN Instance Terminated ✅ ",
  MERN_INSTANCE_NOT_TERMINATED: "MERN Instance Not Terminated ❌ ",
  ERROR_CREATING_MERN_INSTANCE: "Error Creating MERN Instance ❌ ",
  ERROR_READING_MERN_INSTANCE: "Error Reading MERN Instance ❌ ",
  ERROR_UPDATING_MERN_INSTANCE: "Error Updating MERN Instance ❌ ",
  ERROR_TERMINATING_MERN_INSTANCE: "Error Terminating MERN Instance ❌ ",
};

export {
  DB_MESSAGES,
  SERVER_MESSAGES,
  USER_MESSAGES,
  EC2_MESSAGES,
  SCRIPT_MESSAGES,
  CLUSTER_MESSAGES,
  MERN_MESSAGES,
};
