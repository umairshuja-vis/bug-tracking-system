import express from "express"
import { BugController } from "../app/bug/BugController";
import { Authentication } from "../middleware";
import {upload }from "../helpers/Multer"
const BUG_ROUTES = "/bugs";

const router = express.Router();



router.post(
    `/projects/:projectId/bugs`,
    Authentication.authenticate,
    upload.single( 'screenshot' ),
    BugController.createBug//only qa
);//Create


router.get(
    `/projects/:projectId/bugs`,
    Authentication.authenticate,
    BugController.getProjectBugs
);//Read All

router.get(
    `${BUG_ROUTES}/:id`,
    Authentication.authenticate,
    BugController.getBugById//anyone in project
);//Read specific

router.patch(
    `${BUG_ROUTES}/:id`,
    Authentication.authenticate,
    upload.single( 'screenshot' ),
    BugController.updateBug//qa
);//Update 

router.patch(
    `${BUG_ROUTES}/:id/status`,
    Authentication.authenticate,
    BugController.updateBugStatus//dev
)//Update status

router.delete(
    `${BUG_ROUTES}/:id`,
    Authentication.authenticate,
    BugController.deleteBug//dev
)//Update status

router.get(
    `${BUG_ROUTES}/`,
    Authentication.authenticate,
    BugController.getBugs
);

export default router;
