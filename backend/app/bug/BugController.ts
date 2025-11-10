import { BugManager } from "./BugManager"
import { Request, Response } from 'express'
import { ErrorCodes, BugConstants } from "../../constants"
import { UserInterface } from "../../types"
import { Validators } from "../../helpers"
import path from "path"

export class BugController {

    static async createBug( req: Request, res: Response ) {
        try {
            const projectId = await Validators.parseInteger( req.params.projectId, -1 )
            const filePath = req.file ? req.file.path : ''

            console.log( filePath )
            const bug = await BugManager.createBug( ( req as any ).user as UserInterface, req.body, projectId, filePath )

            res.json(
                {
                    success: true,
                    data: bug
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : BugConstants.MESSAGES.FAILED_TO_CREATE_BUG
            } )
        }
    }

    static async getBugs( req: Request, res: Response ) {
        try {
            const bug = await BugManager.getBugs( ( req as any ).user as UserInterface )

            res.json(
                {
                    success: true,
                    data: bug
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : BugConstants.MESSAGES.FAILED_TO_GET_CREATED_BUGS
            } )
        }
    }

    static async getBugById( req: Request, res: Response ) {
        try {
            const bugId = await Validators.parseInteger( req.params.id, -1 )
            const bug = await BugManager.getBugById( ( req as any ).user as UserInterface, bugId )

            res.json(
                {
                    success: true,
                    data: bug
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : BugConstants.MESSAGES.FAILED_TO_GET_BUG
            } )
        }
    }

    static async getProjectBugs( req: Request, res: Response ) {
        try {
            const projectId = await Validators.parseInteger( req.params.projectId, -1 )
            const bug = await BugManager.getProjectBugs( ( req as any ).user as UserInterface, projectId )

            res.json(
                {
                    success: true,
                    data: bug
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : BugConstants.MESSAGES.FAILED_TO_GET_PROJECT_BUGS
            } )
        }
    }

    static async updateBug( req: Request, res: Response ) {
        try {
            const bugId = await Validators.parseInteger( req.params.id, -1 )
            const filePath = req.file ? req.file.path : ''

            const bug = await BugManager.updateBug( ( req as any ).user as UserInterface, bugId, req.body, filePath )

            res.json(
                {
                    success: true,
                    data: bug
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : BugConstants.MESSAGES.FAILED_TO_UPDATE_BUG
            } )
        }
    }

    static async updateBugStatus( req: Request, res: Response ) {
        try {
            const bugId = await Validators.parseInteger( req.params.id, -1 )
            const bug = await BugManager.updateBugStatus( ( req as any ).user as UserInterface, bugId, req.body )

            res.json(
                {
                    success: true,
                    data: bug
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : BugConstants.MESSAGES.FAILED_TO_UPDATE_BUG_STATUS
            } )
        }
    }


    static async deleteBug( req: Request, res: Response ) {
        try {
            const bugId = await Validators.parseInteger( req.params.id, -1 )
            const bug = await BugManager.deleteBug( ( req as any ).user as UserInterface, bugId )

            res.json(
                {
                    success: true,
                    data: bug
                }
            );

        } catch ( err: any ) {
            console.log( "." );

            return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
                success: false,
                message: err.reportError ? err.message : BugConstants.MESSAGES.FAILED_TO_DELETE_PROJECT_BUG
            } )
        }
    }

}
