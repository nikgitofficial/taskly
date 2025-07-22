import express from 'express';
import { createContactMessage, getAllContactMessages, deleteContactMessage } from '../controllers/contact/contactController.js';
import { getContactMessageCount } from "../controllers/contact/contactController.js";

const router = express.Router();


router.post('/', createContactMessage);
router.get("/contact-messages", getAllContactMessages);
router.get("/message-count", getContactMessageCount);
router.delete('/delete/:id', deleteContactMessage);


export default router;
