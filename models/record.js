const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recordSchema = new Schema({
  recordName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "ExpenseUsers",
    index:true
  },
  categoryId:{
    type:Schema.Types.ObjectId,
    ref:'ExpenseCategory',
    index:true
  }
});

module.exports = mongoose.model("ExpenseRecord", recordSchema);