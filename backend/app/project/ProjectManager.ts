import { ProjectHandler } from "../../handlers"
import { ProjectUtil } from "../../utilities"
import { ErrorCodes, ProjectConstants } from "../../constants"
import { UserInterface } from "../../types"
import { ProjectInterface, ProjectRequest, ProjectResponse, AssignProjectRequest, AssignProject } from "../../types"
import {
    Exception,
    config,
    Validators
} from "../../helpers";


export class ProjectManager {

    static async createProject( user: UserInterface, data: ProjectRequest, filePath: string ) {

        console.log( "I AM HERE IN CREATE PROJ CONTROLLER", filePath )

        const validateBody = ProjectUtil.checkCreateBody( data )
        const project = await ProjectHandler.findProjectByName( data.name );

        if ( project ) {

            throw new Exception( ProjectConstants.MESSAGES.PROJECT_TITLE_EXISTS, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        if ( !( user.user_type === 'manager' ) || !validateBody ) {

            console.log( "HERE IN EXCEPTION RIGHT BEFORE CRASH", validateBody, project )
            throw new Exception( ProjectConstants.MESSAGES.FAILED_TO_CREATE_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        if ( !filePath ) {
            data.logo = ''
        }
        else {
            data.logo = filePath;

        }
        const createProject: Partial<ProjectInterface> = {
            name: data.name,
            description: data.description,
            logo: data.logo,
            manager_id: user.id
        }

        const createdProject = await ProjectHandler.createProject( createProject );

        const getProject = await ProjectHandler.getProjectById( createdProject.id );
        return getProject;

    }

    static async deleteProject( user: UserInterface, projectId: number ) {

        const isManager = user.user_type == 'manager'
        const project = await ProjectHandler.findProjectByIdWithManagerId( projectId, user.id );


        if ( isManager && project ) {
            await ProjectHandler.deleteProjectById( projectId )
            return true
        }
        else
            throw new Exception( ProjectConstants.MESSAGES.FAILED_TO_DELETE_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }

    static async getProjects( user: UserInterface ) {
        const isManager = Validators.isManager( user.user_type )

        if ( isManager ) {
            const projects = await ProjectHandler.getManagedProjects( user.id )
            return projects.map( project => project.toJSON() )
        } else {
            const projects = await ProjectHandler.getAssignedProjects( user.id )
            if ( !projects ) {
                throw new Exception( ProjectConstants.MESSAGES.FAILED_TO_GET_ASSIGNED_PROJECTS, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
            }
            return projects.map( project => project.toJSON() )
        }
    }

    static async getProjectById( user: UserInterface, projectId: number ) {
        const project = await ProjectHandler.getProjectById( projectId )

        if ( !project ) {
            throw new Exception( ProjectConstants.MESSAGES.FAILED_TO_GET_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        const data = project.toJSON();
        if ( data.assigned_team ) {
            data.assigned_team = data.assigned_team.map( user => ( { id: user.id, name: user.name, user_type: user.user_type } ) );
        }

        return data
    }

    static async updateProject( user: UserInterface, projectId: number, data: Partial<ProjectInterface>, filePath: string ) {
        const validateBody = ProjectUtil.checkUpdateBody( data, filePath )
        const project = await ProjectHandler.findProjectByIdWithManagerId( projectId, user.id );
        console.log( "HI", project, validateBody )
        if ( !project || user.user_type !== 'manager' ) {

            throw new Exception( ProjectConstants.MESSAGES.FAILED_TO_UPDATE_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        const updateProject: Partial<ProjectInterface> = {}

        if ( data.name ) {
            updateProject.name = data.name
        }
        if ( data.description ) {
            updateProject.description = data.description
        }
        if ( filePath ) {
            updateProject.logo = filePath
        }

        await ProjectHandler.updateProject( updateProject, projectId );

        const updatedProject = await ProjectHandler.getProjectById( projectId );
        return updatedProject;

    }

    static async assignToProject( user: UserInterface, projectId: number, data: AssignProjectRequest ) {

        const validateBody = ProjectUtil.checkAssignBody( data )
        const project = await ProjectHandler.findProjectByIdWithManagerId( projectId, user.id );

        if ( !project || user.user_type !== 'manager' || !validateBody ) {

            throw new Exception( ProjectConstants.MESSAGES.FAILED_TO_ASSIGN_USER_TO_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }
        console.log( "Hi its there,", user.user_type, "test", validateBody )

        const assignmentArray = Array.isArray( data ) ? data : [data];

        const assignments = assignmentArray.map( ( assignment: AssignProject ) => {
            return {
                userId: assignment.user_id,
                type: assignment.type,
            };
        } );

        const { filterAssignments, existing_users } = await ProjectUtil.duplicateCheck( assignments, projectId )


        if ( filterAssignments.length > 0 ) {
            await ProjectHandler.assignToProject( projectId, filterAssignments );
        }

        return {
            message: `${filterAssignments.length} users assigned to project, ${existing_users.length} users were already assigned`
        };
    }

    static async unassignFromProject( user: UserInterface, projectId: number, userId: number ) {
        const project = await ProjectHandler.findProjectByIdWithManagerId( projectId, user.id );
        const isUserInProject = await ProjectHandler.isUserAssigned( projectId, userId )

        if ( !project || user.user_type !== 'manager' || !isUserInProject ) {
            throw new Exception( ProjectConstants.MESSAGES.FAILED_TO_UNASSIGN_FROM_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        await ProjectHandler.unassignUser( projectId, userId )

        return { message: 'User removed from project' };

    }

}



