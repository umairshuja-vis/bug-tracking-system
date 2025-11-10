import { Validators, db } from "../helpers"
const User = db.User;

export class UserHandler {

  static findUserByEmail( email: string ) {
    return User.findOne( { where: { email } } )
  }

  static async isUserDev(user_id: number)
  {
    return User.findOne( { where: { id: user_id, user_type: 'developer' } } )
  }

  static findUserByAccessToken( token: string ) {
    return User.findOne( { where: { access_token: token } } )
  }

  static createUser( { email, name, password, user_type, phone }: { email: string, name: string, password: string, user_type: string, phone?: string } ) {
    console.log( name, 'sdfasd' )
    const user = User.build( { email, name, password, user_type, phone } )

    return user.save();

  }

  static setAccessToken( userId, accessToken, refreshToken ) {
    return User.update(
      {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      {
        where: {
          id: userId,
        },
        returning: '*'
      },
    );
  }

  static getAuthenticateUser( userId, email = " ", authToken ) {
    return User.findOne( {
      where: {
        email,
        id: Validators.parseInteger( userId, -1 ),
        access_token: authToken,
      }
    } )
  }

  static getUsersByType( userType: string ) {
    return User.findAll( { where: { user_type: userType },
      attributes: ['id', 'name', 'user_type']
     } )

  }

}

