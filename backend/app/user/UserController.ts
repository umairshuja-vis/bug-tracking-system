import { UserManager } from "./UserManager"
import { Request, Response } from 'express'
import { ErrorCodes, UserConstants } from "../../constants"
import { Validators } from "../../helpers"


export class UserController {

  static async getUser( req: Request, res: Response ) {

    try {

      const user = await UserManager.getUser( (req as any).user );

      return res.json( {
        success: true,
        data: user
      } );

    } catch ( err: any ) {

      console.log( `getUser:: Request to fetch user failed. userId:: ${(req as any).user?.id} user:: ${(req as any).user?.email} params:: ${JSON.stringify( req.params )}`, err );

      return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
        success: false,
        message: err.reportError ? err.message : UserConstants.MESSAGES.FETCHING_USER_FAILED
      } );

    }

  }

  static async getQAs( _req: Request, res: Response ) {
    try {

      const users = await UserManager.getQAs();

      return res.json( {
        success: true,
        data: users
      } );

    } catch ( err: any ) {

      console.log( `getQAs:: Request to fetch QA users failed.`, err );

      return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
        success: false,
        message: err.reportError ? err.message : UserConstants.MESSAGES.FETCHING_USERS_FAILED
      } );

    }
  }

  static async getManagers( _req: Request, res: Response ) {
    try {

      const users = await UserManager.getManagers();

      return res.json( {
        success: true,
        data: users
      } );

    } catch ( err: any ) {

      console.log( `getManagers:: Request to fetch Manager users failed.`, err );

      return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
        success: false,
        message: err.reportError ? err.message : UserConstants.MESSAGES.FETCHING_USERS_FAILED
      } );

    }
  }

  static async getDevelopers( _req: Request, res: Response ) {
    try {

      const users = await UserManager.getDevelopers();

      return res.json( {
        success: true,
        data: users
      } );

    } catch ( err: any ) {

      console.log( `getDevelopers:: Request to fetch Developer users failed.`, err );

      return res.status( Validators.validateCode( err.code, ErrorCodes.INTERNAL_SERVER_ERROR ) || ErrorCodes.INTERNAL_SERVER_ERROR ).json( {
        success: false,
        message: err.reportError ? err.message : UserConstants.MESSAGES.FETCHING_USERS_FAILED
      } );

    }
  }

}

