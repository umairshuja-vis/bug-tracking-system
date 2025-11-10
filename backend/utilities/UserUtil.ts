//import { Validators, Exception } from "../helpers"
//import { ErrorCodes, UserConstants, } from "../constants"
import { UserInterface } from "../types"


export class UserUtil {

  static transformUserData( user: Partial<UserInterface> ) {

    if ( !user ) {

      return user;

    }

    delete user.refresh_token;
    delete user.password;

    return user;

  }

  static updateUserData( user: Partial<UserInterface> ) {

    if ( !user ) {
      return user;
    }

    delete user.password;
    return user;

  }



  static createReturnData( user: Partial<UserInterface> ) {

    const data: { user?: Partial<UserInterface> } = {};
    data.user = user;

    return data;

  }

}

