const express = require("express");
const router = express.Router();
const Record = require("../../models/record");
const Category = require("../../models/category");
const moment = require('moment');
const handlebars = require("handlebars");


handlebars.registerHelper('filter', (selection, category, options) => {
  
   if (selection === category) {
    return options.fn(this)
   } else {
     return options.inverse(this);
   }
})


router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    let records = await Record.find({ userId }).lean().sort({ _id: "asc" });
    const allCategories = await Category.find().lean()
    for (const record of records) {
      const category = await Category.findOne({_id: record.categoryId,}).lean();
      record.img = category.img;
      record.categoryName = category.categoryName
      record.date = moment(record.date).format('YYYY/MM/DD')
    }
    res.render("index", { records, allCategories });
  } catch (err) {console.log(err)}
});

module.exports = router;
