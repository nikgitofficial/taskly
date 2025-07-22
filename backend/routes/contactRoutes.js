import express from 'express';
import { createContactMessage, getAllContactMessages  } from '../controllers/contact/contactController.js';

const router = express.Router();


router.post('/', createContactMessage);
router.get("/contact-messages", getAllContactMessages);

export default router;
