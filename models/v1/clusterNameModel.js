import mongoose from "mongoose";
import moment from "moment-timezone";

const clusterNameSchema = new mongoose.Schema({
  clusterName: {
    type: String,
    required: true,
  },
  nodeType: {
    type: String,
    required: true,
  },
  minNodes: {
    type: String,
    required: true,
  },
  maxNodes: {
    type: String,
    required: true,
  },
  region: {
    type: String,
  },
  applicationPort: {
    type: Number,
  },
  githubUrl: {
    type: String,
    required: true,
    },
  created_at: {
    type: Date,
    default: () => moment().tz("Asia/Kolkata").toDate(),
    required: true,
  },
  updated_at: {
    type: Date,
    default: () => moment().tz("Asia/Kolkata").toDate(),
    required: false,
  },
});

const clusterNameModel = mongoose.model("cluster", clusterNameSchema);

export { clusterNameModel as CLUSTERNAMEMODEL };
