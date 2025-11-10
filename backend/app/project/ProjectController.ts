import { ProjectManager } from "./ProjectManager"
import { Request, Response } from 'express'
import { ErrorCodes, ProjectConstants } from "../../constants"
import { UserInterface, AssignProject, AssignProjectRequest } from "../../types"
import { Validators } from "../../helpers"
import path from "path"

export class ProjectController {

    static async createProject( req: Request, res: Response ) {
        try {
            console.log( "I AM HERE IN CREATE PROJ CONTROLLER", req.file?.path )
            const filePath = req.file ? req.file.path : ''
            const user = await ProjectManager.createProject( ( req as any ).user as UserInterface, req.body, filePath )


            res.json(
                {
                    success: true,
                    data: user
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_TO_CREATE_PROJECT
            } )
        }
    }

    static async deleteProject( req: Request, res: Response ) {
        try {
            const parsedId = await Validators.parseInteger( req.params.id, -1 )
            const project = await ProjectManager.deleteProject( ( req as any ).user as UserInterface, parsedId )

            res.json(
                {
                    success: true,
                    data: project
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_TO_DELETE_PROJECT
            } )
        }
    }

    static async getProjects( req: Request, res: Response ) {
        try {
            const projects = await ProjectManager.getProjects( ( req as any ).user as UserInterface )

            res.json(
                {
                    success: true,
                    data: projects
                }
            );

        } catch ( err: any ) {
            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_TO_GET_ASSIGNED_PROJECTS
            } )
        }
    }

    static async getProjectById( req: Request, res: Response ) {
        try {
            const parsedId = await Validators.parseInteger( req.params.id, -1 )

            const project = await ProjectManager.getProjectById( ( req as any ).user as UserInterface, parsedId )

            res.json(
                {
                    success: true,
                    data: project
                }
            );
        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_TO_GET_PROJECT
            } )
        }
    }

    static async updateProject( req: Request, res: Response ) {
        try {
            const filePath = req.file ? req.file.path : ''
            console.log("FILE PATH IN CONTROLLER", filePath)
            const parsedId = await Validators.parseInteger( req.params.id, -1 )
            const project = await ProjectManager.updateProject( ( req as any ).user as UserInterface, parsedId, req.body, filePath )

            res.json(
                {
                    success: true,
                    data: project
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_TO_UPDATE_PROJECT
            } )
        }
    }

    static async assignToProject( req: Request, res: Response ) {
        try {

            const projectId = await Validators.parseInteger( req.params.id, -1 )

            const response = await ProjectManager.assignToProject( ( req as any ).user as UserInterface, projectId, req.body as AssignProjectRequest )

            res.json(
                {
                    success: true,
                    data: response
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_TO_ASSIGN_USER_TO_PROJECT
            } )
        }
    }

    static async unassignFromProject( req: Request, res: Response ) {
        try {
            const projectId = await Validators.parseInteger( req.params.id, -1 )
            const userId = await Validators.parseInteger( req.params.userId, -1 )
            
            const user = await ProjectManager.unassignFromProject( ( req as any ).user as UserInterface, projectId, userId )

            res.json(
                {
                    success: true,
                    data: user
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_TO_UNASSIGN_USER_FROM_PROJECT
            } )
        }
    }

}