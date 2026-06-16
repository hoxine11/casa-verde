import express from "express";
import {
  createOption,
  getOptionsByProduct
} from "../controllers/productOption.controller.js";

const router = express.Router();

router.post("/", createOption);
router.get("/:productId", getOptionsByProduct);

export default router;