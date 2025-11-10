import { UserHandler } from "../../handlers"
import { AuthUtil, UserUtil } from "../../utilities"
import { ErrorCodes, UserConstants } from "../../constants"
import {
  Exception,
  Token,
  bcrypt,
  config,
  Validators
} from "../../helpers";


export class AuthManager {

  static async signup( data: any ) {

    // console.log( `signup:: Request to signup user. data:: `, data );

    AuthUtil.validateSignUpRequest( data );

    let user: any = await UserHandler.findUserByEmail( data.email );

    AuthUtil.validateUserForSignUp( user );

    data.password = await AuthUtil.createHashedPassword( data.password );

    user = await UserHandler.createUser( data );

    user = await AuthManager.setAccessToken( user );

    return user;


  }

  static async login( data: any ) {

    // console.log( `login:: Request to login user. data:: `, data );

    AuthUtil.validateLoginRequest(data);

    let user: any = await UserHandler.findUserByEmail( data.email );

    AuthUtil.validateUserToAuthenticate( user );

    const passwordMatched: boolean = await bcrypt.compare( data.password, user.password );

    if ( !passwordMatched ) {

      // console.log( `login:: Password does not match. users:: ${JSON.stringify( user )} data:: `, data );

      throw new Exception( UserConstants.MESSAGES.PASSWORD_DOES_NOT_MATCH, ErrorCodes.UNAUTHORIZED, { reportError: true } ).toJson();

    }

    user = await AuthManager.setAccessToken( user )

    // console.log( `login:: User successfully login. data:: `, data );

    return user;
  }

  static async refreshToken( user: any, data: any ) {

    console.log( `refreshToken:: Request to refresh token. userId:: ${user.id} user:: ${user.email} data:: `, data );

    AuthUtil.validateRefreshTokenRequest( data );

    const decoded = Token.verifyToken( data.refresh_token, config.get('secretKey') );

    AuthUtil.validateRefreshToken( user, decoded );

    user = await AuthManager.setAccessToken( user );

    console.log( `refreshToken:: Token successfully refreshed. userId:: ${user.id}, user:: ${user.email} data:: `, data );

    return user;

  }

  static async setAccessToken( user: any ) {

    // console.log( `setAccessToken:: Setting access token of user. user:: `, user );

    const accessToken = Token.getLoginToken( user );

    const refreshToken = Token.getRefreshToken( user );

    const [_, [updatedUser]] = await UserHandler.setAccessToken( user.id, accessToken, refreshToken );

    user = UserUtil.updateUserData( updatedUser.toJSON() );

    // console.log( `setAccessToken:: access token of user successfully set. user:: `, user );

    return user;

  }

}

