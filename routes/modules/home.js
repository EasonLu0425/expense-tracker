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
    let total = 0
    for (const record of records) {
      const category = await Category.findOne({_id: record.categoryId,}).lean();
      record.img = category.img;
      record.categoryName = category.categoryName
      record.date = moment(record.date).format('YYYY/MM/DD')
      total += record.amount
    }
    res.render("index", { records, allCategories, total });
  } catch (err) {console.log(err)}
});

router.post('/sort', async (req, res) => {
  try{
    const userId = req.user._id;
    const keyword = req.body.filter.toString()
    if (keyword === 'all') {
      return res.redirect('/')
    }
    const allCategories = await Category.find().lean();
    const filteredCategory = await Category.find({categoryName:keyword}).lean();
    const filteredCategoryName = filteredCategory[0].categoryName
    let records = await Record.find({ userId, categoryId:filteredCategory }).lean().sort({ date: "asc" });
    let total = 0
    for (const record of records) {
      const category = await Category.findOne({
        _id: record.categoryId,
      }).lean();
      record.img = category.img;
      record.categoryName = category.categoryName;
      record.date = moment(record.date).format("YYYY/MM/DD");
      total += record.amount
    }
    res.render("index", { records, allCategories, filteredCategoryName, total });

  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
