#expense-tracker

## getting Start

- 請先用 git clone 下載檔案: gitclone: https://github.com/EasonLu0425/expense-tracker.git
- 使用終端機進入檔案資料夾，並且於終端機輸入: `$ npm install`
- 由於本專案有使用 mongoDB 作為資料庫，請於專案根目錄建立`.env`檔案，並且加入`MONGODB_URI= <mongoDB的connect link>`
- 建立種子資料，請於終端機輸入`npm run seed`，種子資料就會一次建立完成。
  - 本次的 record 只有建立兩種類別的資料各兩筆，這是設計好的。
  - 種子使用者設帳號為:qwe@qwe.com， 密碼:1234。 這樣方便輸入真棒。

## 產品功能

- 註冊
  - 使用者須先註冊帳號，方可進入使用紀錄支出功能。
  - 註冊時，將會判別註冊資料是否通過驗證。
- 登入
  - 使用者可透過註冊的帳號登入頁面
  - 無特別使用 facebook 或其他的登入功能，後可再新增。
- 登出
  - 登出後需再登入才能繼續使用
- 基本功能
  - 使用者僅能看到自己的紀錄
  - 可自行增加或刪除紀錄
  - 可修改任何一筆自己的紀錄
