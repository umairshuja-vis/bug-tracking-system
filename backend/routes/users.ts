import express from "express"
import { UserController } from "../app/user/UserController";
import { Authentication } from "../middleware";
const USERS_ROUTES_PREFIX = "/users";

const router = express.Router();

router.get(
  `${USERS_ROUTES_PREFIX}/me`,
  Authentication.authenticate,
  UserController.getUser
);

router.get(
  `${USERS_ROUTES_PREFIX}/qas`,
  Authentication.authenticate,
  UserController.getQAs
);

router.get(
  `${USERS_ROUTES_PREFIX}/managers`,
  Authentication.authenticate,
  UserController.getManagers
);

router.get(
  `${USERS_ROUTES_PREFIX}/developers`,
  Authentication.authenticate,
  UserController.getDevelopers
);


export { router as userRoutes };
