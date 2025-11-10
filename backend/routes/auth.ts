import express from "express";
import { AuthController } from "../app/auth/AuthController";
import { Authentication } from "../middleware";
const USERS_ROUTES_PREFIX = "/auth";

const router = express.Router();

router.post(`${USERS_ROUTES_PREFIX}/sign-up`, AuthController.signup);

router.post(`${USERS_ROUTES_PREFIX}/login`, AuthController.login);

router.post(
  `${USERS_ROUTES_PREFIX}/refresh-token`,
  Authentication.authenticate,
  AuthController.refreshToken
);

export { router as auth };