import express from "express";
import {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", getOrders);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;