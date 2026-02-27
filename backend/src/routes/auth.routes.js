import express from 'express'
import { login, register ,isAuthenticated,logout} from '../controllers/auth.controller.js';

const router=express.Router();
router.post("/login",login)
router.post("/register",register)
router.get("/is-auth",isAuthenticated)
router.post("/logout",logout)
export default router;