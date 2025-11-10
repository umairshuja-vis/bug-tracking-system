import { UserInterface } from "../types"
import { BugConstants } from "../constants"
import { BugRequest, BugStatus, BugInterface } from "../types"
import { Validators, Exception } from "../helpers"
import { ErrorCodes } from "../constants"

export class BugUtil {

    static checkCreateBody( data: BugRequest ) {

        if ( !data || ( !data.title ) || ( !data.description ) || ( !data.type ) || ( !data.deadline ) || ( !data.bug_assignee ) ) {

            console.log( "Invalid body for create, missing required fields like title, description, bug type, deadline and assignee" )
            throw new Exception( BugConstants.MESSAGES.INVALID_DATA_TO_CREATE_BUG, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

        }

        return true
    }

    static checkUpdateBody( data: Partial<BugRequest>, filePath?: string ): boolean {

        if ( !data || typeof data !== 'object' ) {

            console.log( "Invalid body for update, missing at least one field like title, description, or screenshot. deadline or bug_assignee" )
            throw new Exception( BugConstants.MESSAGES.INVALID_DATA_TO_UPDATE_BUG, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

        }

        const { title, description, screenshot, deadline } = data;
        const hasMinOneField = title || description || screenshot || deadline || filePath;

        if ( !hasMinOneField ) {

            console.log( "Invalid body for update, at least one field is required" )
            throw new Exception( BugConstants.MESSAGES.INVALID_DATA_TO_UPDATE_BUG, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

        }

        if ( title === '' || description === '' || (screenshot === '' && !filePath) || deadline == null ) {

            console.log( "Invalid body for update, fields cannot be empty strings", data );

            throw new Exception( BugConstants.MESSAGES.INVALID_DATA_TO_UPDATE_BUG, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

        }

        return true
    }

    static checkUpdateStatusBody( data: Partial<BugInterface>, isBug: boolean ): boolean {

        if ( !data || typeof data !== 'object' ) {

            console.log( "Invalid body for update, missing status" )
            throw new Exception( BugConstants.MESSAGES.INVALID_DATA_TO_UPDATE_BUG_STATUS, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

        }

        const { status } = data;

        if ( isBug && status == 'completed' ) {

            console.log( "Invalid status update, bug cannot have this status" )
            throw new Exception( BugConstants.MESSAGES.INVALID_STATUS_TYPE, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

        }

        return true;

    }


}


