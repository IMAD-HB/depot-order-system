import express from 'express';
import {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .put(updateOrder)
  .delete(deleteOrder);

export default router;
