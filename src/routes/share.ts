import { Router } from "express";
const shareRouter = Router();
import { Request, Response } from "express";
import { auth } from "../middleware/auth";
import { LinkModel } from "../database/db";
import { random } from "../utils/random";
import * as dotenv from "dotenv";
dotenv.config();

shareRouter.post("/mindShare", auth, async (req: Request, res: Response) => {
  const share = req.body.share;
  const userId = req.userId!;

  if (share) {
    try {
      const LinkalreadyExists = await LinkModel.findOne({ userId });

      if (LinkalreadyExists) {
        const hashlink = LinkalreadyExists.hash;
        return res
          .status(200)
          .json({ msg: "link already created", link: hashlink });
      }

      const hash = random(10);

      await LinkModel.create({
        hash,
        userId,
      });

      res
        .status(200)
        .json({
          "Here is your Sharable Link": `${process.env.BASEURL}/share/mind/${hash}`,
        });
    } catch (error) {
      res.status(411).json({ msg: "Unexpected Problem Occured" });
    }
  } else {
    try {
      const removeLink = await LinkModel.deleteOne({ userId });
      if (removeLink.deletedCount === 0) {
        return res.status(404).json({
          msg: "Link not found ",
        });
      }
      res.status(200).json({
        msg: "Link Deleted!",
      });
    } catch (error) {
        res.json({msg: "Unexpected error while deleting link"})
    }
  }
});

shareRouter.get("/mind/:ShareLink", (req: Request, res: Response) => {});

shareRouter.post("/contentShare", auth, (req: Request, res: Response) => {
  const share = req.params.share;
  const contentId = req.body;
});

shareRouter.get("/content/:ShareLink", (req: Request, res: Response) => {});

export default shareRouter;
