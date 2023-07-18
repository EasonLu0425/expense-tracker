const bcrypt = require("bcryptjs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const Record = require("../record");
const User = require("../users");
const Category = require("../category");
const db = require("../../config/mongoose");

const SEED_USER = {
  name: "test",
  email: "qwe@qwe.com",
  password: "1234",
};
const CATEGORY = [
  {
    categoryName: "家居物業",
    img: '<i class="fa-solid fa-house fa-lg"></i>',
  },
  {
    categoryName: "交通出行",
    img: '<i class="fa-solid fa-van-shuttle fa-lg"></i>',
  },
  {
    categoryName: "休閒娛樂",
    img: '<i class="fa-solid fa-face-grin-beam fa-lg"></i>',
  },
  {
    categoryName: "餐飲食品",
    img: '<i class="fa-solid fa-utensils fa-lg"></i>',
  },
  {
    categoryName: "其他",
    img: '<i class="fa-solid fa-pen fa-lg"></i>',
  },
];

db.once("open", async () => {
  try {
    await Promise.all(
      CATEGORY.map(async (el) => {
        await Category.create({
          categoryName: el.categoryName,
          img: el.img,
        });
      })
    );

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(SEED_USER.password, salt);
    const user = await User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash,
    });

    const userId = user._id.toString();

    let setCategory = await Category.findOne({
      categoryName: "家居物業",
    }).lean();
    let setCategoryId = setCategory._id.toString();
    await Promise.all(
      Array.from({ length: 2 }, async (_, i) => {
        await Record.create({
          recordName: `居家-${i}`,
          date: Date.now(),
          amount: `${i + 1}00`,
          userId,
          categoryId: setCategoryId,
        });
      })
    );

    setCategory = await Category.findOne({ categoryName: "餐飲食品" }).lean();
    setCategoryId = setCategory._id.toString();
    await Promise.all(
      Array.from({ length: 2 }, async (_, i) => {
        await Record.create({
          recordName: `餐飲-${i}`,
          date: Date.now(),
          amount: `${i + 1}00`,
          userId,
          categoryId: setCategoryId,
        });
      })
    );

    console.log("done");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
