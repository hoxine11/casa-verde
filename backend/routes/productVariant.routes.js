import express from "express";
import {
  createVariant,
  getVariantsByProduct
} from "../controllers/productVariant.controller.js";

const router = express.Router();

router.post("/", createVariant);
router.get("/:productId", getVariantsByProduct);

export default router;