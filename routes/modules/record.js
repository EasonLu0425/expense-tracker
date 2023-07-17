const express = require("express");
const router = express.Router();
const Record = require("../../models/record");
const Category = require("../../models/category");
const handlebars = require("handlebars");

handlebars.registerHelper("eq", function (a, b, options) {
  if (a.toString() === b.toString()) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const { recordName, amount, date, category } = req.body;
    const errors = [];
    if (!recordName || !amount || !date || !category) {
      errors.push({ message: "每一項都是必填喔!" });
    }
    const categoryId = await Category.findOne({
      categoryName: category,
    }).lean();
    await Record.create({
      userId,
      recordName,
      amount,
      date,
      categoryId,
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const _id = req.params.id;
    const userId = req.user._id;
    return await Record.findOne({ _id, userId })
      .lean()
      .then(async (record) => {
        let { recordName, amount, date, categoryId } = record;
        date = date.toISOString().slice(0, 10);
        categoryId = await Category.findOne({ _id: categoryId })
          .lean()
          .then((category) => {
            return category.categoryName;
          });
        console.log(typeof categoryId);
        res.render("edit", { record, recordName, amount, date, categoryId });
      });
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.user._id;
    const _id = req.params.id;
    const { recordName, amount, date, category } = req.body;
    const categoryId = await Category.findOne({
      categoryName: category,
    }).lean();
    await Record.findOne({ _id, userId }).then((record) => {
      record.recordName = recordName;
      record.amount = amount;
      record.date = date;
      record.categoryId = categoryId;
      return record.save();
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user._id;
    const _id = req.params.id;
    const record = await Record.findOne({ _id, userId }).lean()
    if (!record) {
       return res.status(404).json({ error: "Record not found" });
    }
    await Record.deleteOne({ _id, userId });
    return res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
