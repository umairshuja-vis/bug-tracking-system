
import { Request, Response } from 'express'
import { ErrorCodes, UserConstants } from "../../constants"
import { AuthManager } from "./AuthManager"
import { Validators } from "../../helpers"

export class AuthController {

  static async signup (req: Request, res: Response) {

    try {

      const user = await AuthManager.signup(req.body);

      res.json({
        success: true,
        data: user
      });

    } catch (err) {

      console.log(`signup:: Request to sign up user failed. data:: `, req.body, err);

      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : UserConstants.MESSAGES.SIGN_UP_FAILED
      });

    }

  }

  static async login (req: Request, res: Response) {

    try {

      const user = await AuthManager.login(req.body);

      res.json({
        success: true,
        data: user
      });

    } catch (err) {

      console.log(`login:: Request to login user failed. data:: `, req.body, err);

      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : UserConstants.MESSAGES.LOGIN_FAILED
      });

    }

  }

  static async refreshToken (req: Request, res: Response) {

    try {

      const data = await AuthManager.refreshToken((req as any).user, req.body);

      res.json({
        success: true,
        data
      });

    } catch (err) {

      console.log(`refreshToken:: Request to refresh token failed. userId:: ${(req as any).user.id} user:: ${(req as any).user.email} data:: `, req.body, err);

      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : UserConstants.MESSAGES.REFRESH_TOKEN_FAILED
      });

    }

  }

}

