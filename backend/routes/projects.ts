import express from "express"
import { ProjectController } from "../app/project/ProjectController";
import { Authentication } from "../middleware";
import { upload } from "../helpers/Multer"
const PROJECT_ROUTES = "/projects";

const router = express.Router();

router.post(
  `${PROJECT_ROUTES}`,
  Authentication.authenticate,
  upload.single( 'logo' ),
  ProjectController.createProject
);

router.get(
  `${PROJECT_ROUTES}`,
  Authentication.authenticate,
  ProjectController.getProjects
);

router.delete(
  `${PROJECT_ROUTES}/:id`,
  Authentication.authenticate,
  ProjectController.deleteProject
);

router.get(
  `${PROJECT_ROUTES}/:id`,
  Authentication.authenticate,
  ProjectController.getProjectById
);

router.put(
  `${PROJECT_ROUTES}/:id`,
  upload.single( 'logo' ),
  Authentication.authenticate,
  ProjectController.updateProject
);

router.post(
  `${PROJECT_ROUTES}/:id/assign`,
  Authentication.authenticate,
  ProjectController.assignToProject
);

router.delete(
  `${PROJECT_ROUTES}/:id/unassign/:userId`,
  Authentication.authenticate,
  ProjectController.unassignFromProject
);

export { router as project };
