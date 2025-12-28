/**
 * Admin Authentication Routes
 *
 * Responsibilities:
 * - Handle admin login requests
 * - Delegate authentication logic to adminController
 *
 * Notes:
 * - This route should be protected with rate limiting in production
 * - Token/session handling is expected to be managed inside the controller
 *
 * Route:
 * POST /login
 * Body:
 * - email
 * - password
 */

import express from 'express';
import * as adminController from '../controllers/admincontroller.js';

const router = express.Router();

router.post('/login', adminController.login);

export default router;

