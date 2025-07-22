import express from 'express';
import { getAllContactMessages } from '../controllers/contact/contactController.js';
const router = express.Router();

// Admin gets all contact messages
router.get("/contact-messages", getAllContactMessages);

export default router;
