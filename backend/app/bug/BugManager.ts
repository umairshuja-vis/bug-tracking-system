import { BugHandler, ProjectHandler, UserHandler } from "../../handlers"
import { BugUtil } from "../../utilities"
import { ErrorCodes, BugConstants } from "../../constants"
import { UserInterface } from "../../types"
import { BugInterface, BugRequest, BugStatus } from "../../types"
import {
    Exception,
    config,
    Validators
} from "../../helpers";


export class BugManager {

    static async createBug( user: UserInterface, data: BugRequest, projectId: number, filePath ) {

        const validateBody = BugUtil.checkCreateBody( data )
        const bug = await BugHandler.findBugByTitle( data.title );
        const isQA = Validators.isQA( user.user_type )
        const isAssignedToProject = await ProjectHandler.isUserAssigned( projectId, user.id )
        const bug_assignee = data.bug_assignee
        console.log( "HI USER:", bug_assignee )
        const isAssigneeInProject = await ProjectHandler.isUserAssigned( projectId, bug_assignee )
        const isBugAssigneeDev = await UserHandler.isUserDev( bug_assignee )

        console.log( "hi", isAssigneeInProject, isBugAssigneeDev )

        if ( !isQA || !isAssignedToProject || !validateBody ) {

            throw new Exception( BugConstants.MESSAGES.FAILED_TO_CREATE_BUG, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        if ( bug ) {
            throw new Exception( BugConstants.MESSAGES.BUG_TITLE_ALREADY_EXISTS, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        if ( !isAssigneeInProject || !isBugAssigneeDev ) {

            throw new Exception( BugConstants.MESSAGES.BUG_ASSIGNEE_NOT_IN_PROJECT_OR_IS_NOT_DEV, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        if ( !filePath ) {
            data.screenshot = ''
        }
        else {
            data.screenshot = filePath;
        }

        const createBug: Partial<BugInterface> = {
            title: data.title,
            description: data.description,
            screenshot: data.screenshot,
            bug_creator: user.id,
            type: data.type,
            status: 'new',
            bug_assignee: data.bug_assignee,
            project_id: projectId,
            deadline: data.deadline
        }

        const createdBug = await BugHandler.createBug( createBug );

        const getBug = await BugHandler.getBugById( createdBug.id );
        return getBug;

    }

    static async getBugs( user: UserInterface ) {
        const isQA = Validators.isQA( user.user_type )
        const isDeveloper = Validators.isDeveloper( user.user_type )
        const isManager = Validators.isManager( user.user_type )

        if ( isQA ) {
            const bugs = await BugHandler.getCreatedBugs( user.id )
            return bugs.map( bug => bug.toJSON() )
        } else if ( isDeveloper ) {
            const bugs = await BugHandler.getAssignedBugs( user.id )
            return bugs.map( bug => bug.toJSON() )
        } else if ( isManager ) {
            const bugs = await BugHandler.getManagedBugs( user.id )
            return bugs.map( bug => bug.toJSON() )
        } else {
            throw new Exception( BugConstants.MESSAGES.FAILED_TO_GET_CREATED_BUGS, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }
    }


    static async getBugById( user: UserInterface, bugId: number ) {

        const bug = await BugHandler.getBugById( bugId )

        if ( !bug ) {
            throw new Exception( BugConstants.MESSAGES.FAILED_TO_GET_BUG, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        return bug
    }

    static async getProjectBugs( user: UserInterface, projectId: number ) {
        let isProjectManager, isAssignedToProject = false;
        if ( Validators.isManager( user.user_type ) ) {
            isProjectManager = await ProjectHandler.findProjectByIdWithManagerId( projectId, user.id )
        }
        else {
            isAssignedToProject = await ProjectHandler.isUserAssigned( projectId, user.id )
        }

        if ( !isProjectManager && !isAssignedToProject ) {
            throw new Exception( BugConstants.MESSAGES.FAILED_TO_GET_PROJECT_BUGS, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        const bugs = await BugHandler.getProjectBugs( projectId )

        return bugs.map( bug => bug.toJSON() )

    }

    static async updateBug( user: UserInterface, bugId: number, data: Partial<BugInterface>, filePath: string ) {

        const validateBody = BugUtil.checkUpdateBody( data, filePath )
        const bug = await BugHandler.findBugByIdWithCreatorId( bugId, user.id );

        if ( !bug || !Validators.isQA( user.user_type ) || !validateBody ) {

            throw new Exception( BugConstants.MESSAGES.FAILED_TO_UPDATE_BUG, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        const updateBug: Partial<BugRequest> = {}

        if ( data.title ) {
            updateBug.title = data.title
        }
        if ( data.description ) {
            updateBug.description = data.description
        }
        if ( filePath ) {
            updateBug.screenshot = filePath
        }
        if ( data.deadline ) {

            updateBug.deadline = data.deadline

        }

        await BugHandler.updateBug( updateBug, bugId );


        const updatedBug = await BugHandler.getBugById( bugId );

        return updatedBug;

    }

    static async updateBugStatus( user: UserInterface, bugId: number, data: Partial<BugInterface> ) {
        const isDeveloper = Validators.isDeveloper( user.user_type );
        const isBug = await BugHandler.isBug( bugId );
        const validateBody = BugUtil.checkUpdateStatusBody( data, isBug );
        const bug = await BugHandler.findBugByIdWithAssigneeId( bugId, user.id );

        if ( !isDeveloper || !bug || !validateBody ) {

            throw new Exception( BugConstants.MESSAGES.FAILED_TO_UPDATE_BUG_STATUS, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();
        }

        const updateBugStatus: BugStatus = data.status;
        console.log(updateBugStatus)

        await BugHandler.updateBugStatus( updateBugStatus, bugId );

        const updatedBug = await BugHandler.getBugById( bugId );

        return updatedBug;

    }

    static async deleteBug( user: UserInterface, bugId: number ) {

        console.log(bugId)

        const isQA = user.user_type == 'qa'
        const bug = await BugHandler.findBugByIdWithCreatorId( bugId, user.id );
        console.log("DOES BUG EXIST?", bug)

        if ( isQA && bug ) {
            await BugHandler.deleteBugById( bugId )
            return true
        }
        else
            throw new Exception( BugConstants.MESSAGES.FAILED_TO_DELETE_PROJECT_BUG, ErrorCodes.BAD_REQUEST, { reportError: true } ).toJson();

    }


}



