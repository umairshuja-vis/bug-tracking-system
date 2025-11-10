import config from "config"
import jwt from 'jsonwebtoken';

export class Token {

  static getLoginToken( user: any ) {

    let loginToken = jwt.sign( {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    }, (config as any).secretKey, {
      expiresIn: (config as any).timeouts.login
    } );

    return loginToken;

  }

  static getRefreshToken( user: any ) {

    let refreshToken = jwt.sign( {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    }, (config as any).secretKey, {
      expiresIn: (config as any).timeouts.refreshToken
    } );

    return refreshToken;

  }

  static verifyToken( token: string, secretKey: string ) {

    try {

      const decoded = jwt.verify( token, secretKey );

      return decoded || false;

    } catch ( err ) {

      console.log( `verifyToken:: Could not verify the token. token:: ${token} secretKey:: ${secretKey}`, err );

      return false;

    }

  }

}

