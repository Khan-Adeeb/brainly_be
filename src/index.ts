import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { UserModel } from "./database";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { email, password } = req.body;
  await UserModel.create({
    email: email,
    password: password
  });
  res.json({
    msg: "signed up sucessfully",
  });
});

async function main() {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log("database connected");

    app.listen(process.env.PORT, () => {
      console.log(`app listening to port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("database connection error", error);
  }
}

main();