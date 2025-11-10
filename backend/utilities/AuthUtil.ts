
import { Validators, Exception, bcrypt } from "../helpers"
import { ErrorCodes, UserConstants, } from "../constants"
import  {UserInterface, Login, Signup, RefreshToken } from "../types"


export class AuthUtil {

  static validateUser( user: Partial<UserInterface> ) {

    if ( !user ) {

      console.log( `validateUser:: User does not exist. user:: `, user );

      throw new Exception( UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.UNAUTHORIZED, { reportError: true } ).toJson();

    }

  }

  static async createHashedPassword( password: string ) {

    password = await bcrypt.hash( password, 10 );

    return password;

  }

  static validateUserForSignUp( user: Partial<UserInterface> ) {

    if ( user ) {

      console.log( `validateUserForSignUp:: User already exist against this email. user:: `, user );

      throw new Exception( UserConstants.MESSAGES.USER_ALREADY_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

  }

  static validateUserToAuthenticate( user: Partial<UserInterface> ) {

    if ( !user ) {

      console.log( `validateUserToAuthenticate:: User does not exist. user:: `, user );

      throw new Exception( UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

  }

  static validateRefreshToken( user: Partial<UserInterface>, decoded: any ) {

    if ( !decoded || ( !decoded.email ) ) {

      console.log( `validateRefreshToken:: Refresh token has expired. userId:: ${user.id}, user:: ${user.email} decoded:: `, decoded );

      throw new Exception( UserConstants.MESSAGES.REFRESH_TOKEN_HAS_EXPIRED, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

    if ( ( user.email !== decoded.email ) ) {

      console.log( `validateRefreshToken:: Invalid refresh token. userId:: ${user.id}, user:: ${user.email} decoded:: `, decoded );

      throw new Exception( UserConstants.MESSAGES.INVALID_REFRESH_TOKEN, ErrorCodes.UNAUTHORIZED, { reportError: true } ).toJson();

    }

  }

  static validateUserToForgetPassword( user: Partial<UserInterface> ) {

    if ( !user ) {

      console.log( `validateUserToForgetPassword:: User does not exist. user:: `, user );

      throw new Exception( UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

  }

  static validateSignUpRequest( data: Partial<Signup> ) {

    if ( !data || ( !data.email ) ) {

      console.log( `validateSignUpRequest:: Invalid data to sign up user. data:: `, data );

      throw new Exception( UserConstants.MESSAGES.INVALID_DATA_TO_SIGNUP_USER, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

    if ( data.email && !Validators.isValidateEmail( data.email ) ) {

      console.log( `validateSignUpRequest:: Email is not valid. data:: `, data );

      throw new Exception( UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

    if ( !Validators.isValidStr( data.password || '' ) ) {

      console.log( `validateSignUpRequest:: Password is not valid. data:: `, data );

      throw new Exception( UserConstants.MESSAGES.INVALID_PASSWORD, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

  }

  static validateRefreshTokenRequest( data: Partial<RefreshToken> ) {

    if ( !data ) {

      console.log( `validateRefreshTokenRequest:: Invalid data to refresh token. data:: `, data );

      throw new Exception( UserConstants.MESSAGES.INVALID_DATA_TO_REFRESH_TOKEN, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

    if ( !Validators.isValidStr( data.refresh_token || '' ) ) {

      console.log( `validateRefreshTokenRequest:: Refresh token is not valid. data:: `, data );

      throw new Exception( UserConstants.MESSAGES.INVALID_REFRESH_TOKEN, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

  }

    static validateLoginRequest( data: Partial<Login> ) {

    if ( !data || ( !data.email ) ) {

      console.log( `validateLoginRequest:: Invalid data to login user. data:: `, data );

      throw new Exception( UserConstants.MESSAGES.INVALID_DATA_TO_LOGIN, ErrorCodes.UNAUTHORIZED, { reportError: true } ).toJson();

    }

    if ( data.email && !Validators.isValidateEmail( data.email ) ) {

      console.log( `validateLoginRequest:: Invalid email to login user. data:: `, data );

      throw new Exception( UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.UNAUTHORIZED, { reportError: true } ).toJson();

    }

    if ( !Validators.isValidStr( data.password || '' ) ) {

      console.log( `validateLoginRequest:: Invalid password to login user. data:: `, data );

      throw new Exception( UserConstants.MESSAGES.INVALID_PASSWORD, ErrorCodes.UNAUTHORIZED, { reportError: true } ).toJson();

    }

  }


  static formatResponse( users: Partial<UserInterface[]> ) {

    const data: { users?: Partial<UserInterface[]> } = {};

    data.users = users;

    return data;

  }

}

