const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      // type: String,
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      index: true
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Todo",todoSchema);