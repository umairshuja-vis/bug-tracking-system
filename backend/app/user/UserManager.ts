import { UserUtil } from "../../utilities"
import { UserHandler } from "../../handlers"
import { UserConstants } from "../../constants"
import { Exception, Validators } from "../../helpers"
import { ErrorCodes } from "../../constants"

export class UserManager {
  static async getUser( user: any ) {

    user = UserUtil.transformUserData( user.toJSON() );

    console.log( `getUser:: User's data successfully fetched. userId::${user.id} user:: ${user.email}` );

    return user;
  }

  static async getQAs() {
    const users = await UserHandler.getUsersByType( 'qa' )

    if ( !users || users.length === 0 ) {
      throw new Exception( UserConstants.MESSAGES.FAILED_TO_FETCH_USERS, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
    }

    const transformedUsers = users.map( ( user: any ) => UserUtil.transformUserData( user.toJSON() ) )
    return transformedUsers;
  }

  static async getDevelopers() {
    const users = await UserHandler.getUsersByType( 'developer' )
    // console.log(users);

    if ( !users || users.length === 0 ) {
      throw new Exception( UserConstants.MESSAGES.FAILED_TO_FETCH_USERS, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
    }
    const transformedUsers = users.map( ( user: any ) => UserUtil.transformUserData( user.toJSON() ) )
    return transformedUsers;
  }

  static async getManagers() {
    const users = await UserHandler.getUsersByType( 'manager' )

    if ( !users || users.length === 0 ) {
      throw new Exception( UserConstants.MESSAGES.FAILED_TO_FETCH_USERS, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
    }
    const transformedUsers = users.map( ( user: any ) => UserUtil.transformUserData( user.toJSON() ) )

    return transformedUsers;
  }
}