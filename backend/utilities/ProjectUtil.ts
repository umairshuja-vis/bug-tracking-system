import { UserInterface, AssignProject, AssignProjectRequest } from "../types"
import { ProjectConstants } from "../constants"
import { ProjectRequest } from "../types"
import { Validators, Exception } from "../helpers"
import { ErrorCodes } from "../constants"
import { ProjectHandler } from "../handlers"

export class ProjectUtil {

  static checkCreateBody( data: ProjectRequest ) {//in future i will add ProjectRequest here in data type

    if ( !data || ( !data.name ) || ( !data.description ) ) {

      console.log( "Invalid body for create, missing required fields like name, description" )
      throw new Exception( ProjectConstants.MESSAGES.INVALID_DATA_TO_CREATE_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

    return true
  }

  static checkUpdateBody( data: Partial<ProjectRequest>, filePath?: string ): boolean {

    if ( !data || typeof data !== 'object' ) {

      console.log( "Invalid body for update, missing at least one field like name, description, or logo" )
      throw new Exception( ProjectConstants.MESSAGES.INVALID_DATA_TO_UPDATE_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

    const { name, description, logo } = data;
    const hasAtLeastOneField = name || description || logo !== undefined || filePath;

    if ( !hasAtLeastOneField ) {

      console.log( "Invalid body for update, at least one field (name, description, or logo) is required" )
      throw new Exception( ProjectConstants.MESSAGES.INVALID_DATA_TO_UPDATE_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

    if ( name === '' || description === '' || (logo === '' && !filePath) ) {

      console.log( "Invalid body for update, fields cannot be empty strings", data );

      throw new Exception( ProjectConstants.MESSAGES.INVALID_DATA_TO_UPDATE_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

    return true
  }

  static checkAssignBody( data: AssignProjectRequest ): boolean {
    const assignments = Array.isArray( data ) ? data : [data];

    if ( assignments.length === 0 ) {
      throw new Exception( ProjectConstants.MESSAGES.INVALID_DATA_TO_ASSIGN_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
    }

    const areValid = assignments.every( ( assignment: AssignProject ) => {
      return assignment && typeof assignment.user_id !== 'undefined' && typeof assignment.type !== 'undefined';
    } );

    if ( !areValid ) {
      throw new Exception( ProjectConstants.MESSAGES.INVALID_DATA_TO_ASSIGN_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
    }

    return true;
  }

  static async duplicateCheck( assignments, projectId: number ) {
    const filterAssignments = [];
    const existing_users = [];
    for ( const assignment of assignments ) {
      const existing = await ProjectHandler.isUserAssigned( projectId, assignment.userId );
      if ( existing ) {
        existing_users.push( assignment.userId );
      } else {
        filterAssignments.push( assignment );
      }
    }

    return { filterAssignments, existing_users };

  }


}


