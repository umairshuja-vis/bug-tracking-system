import { Validators, db } from "../helpers"
import { BugInterface, BugStatus, UserInterface } from "../types"

const Bug = db.Bug;
const User = db.User;
const Project = db.Project;

export class BugHandler {

    static async findBugByTitle( bugTitle: string ) {
        return Bug.findOne( { where: { title: bugTitle } } )
    }

    static async createBug( { title, description, screenshot, bug_creator, type, status, bug_assignee, project_id, deadline }: Partial<BugInterface> ) {
        const bug = Bug.build( { title, description, screenshot, bug_creator, type, status, bug_assignee, project_id, deadline } )
        return bug.save();
    }

    static async findBugByIdWithCreatorId( bug_id: number, bug_creator: number ) {
        return Bug.findOne( { where: { id: bug_id, bug_creator: bug_creator } } )
    }

    static async findBugByIdWithAssigneeId( bug_id: number, bug_assignee: number ) {
        return Bug.findOne( { where: { id: bug_id, bug_assignee: bug_assignee } } )
    }


    static async getCreatedBugs( bug_creator: number ) {
        const bugs = await Bug.findAll( {
            where: { bug_creator: bug_creator }, include: [{
                model: User, as: 'assignee', attributes: { exclude: ['password', 'access_token', 'refresh_token', 'user_type', 'phone'] }
            }]
        } )
        return bugs;
    }

    static async getAssignedBugs( bug_assignee: number ) {
        const bugs = await Bug.findAll( {
            where: { bug_assignee: bug_assignee }, include: [{
                model: User, as: 'assignee', attributes: { exclude: ['password', 'access_token', 'refresh_token', 'user_type', 'phone'] }


            }]
        } )
        return bugs;
    }

    static async getProjectBugs( projectId: number ) {
        const ProjectBugs = await Bug.findAll( {
            where: { project_id: projectId }, include: [{
                model: User, as: 'assignee', attributes: { exclude: ['password', 'access_token', 'refresh_token', 'user_type', 'phone'] }
            }],
            order: [['createdAt', 'ASC']]

        } )
        // console.log( "PROJECT BUGS: ", ProjectBugs )
        return ProjectBugs;
    }

    static async getManagedBugs( manager_id: number ) {
        const bugs = await Bug.findAll( {
            include: [{
                model: Project,
                as: 'project',
                where: { manager_id: manager_id },
                attributes: []
            },
            {
                model: User, as: 'assignee', attributes: { exclude: ['password', 'access_token', 'refresh_token', 'user_type', 'phone'] }
            }]
        } )
        return bugs;
    }

    static async getBugById( bug_id: number ) {
        const bug = await Bug.findOne( {
            where: { id: bug_id },
            include: [{
                model: User, as: 'assignee', attributes: ['id', 'name', 'email', 'user_type']
            }]
        } )
        return bug;
    }

    static async deleteBugById( bugId: number ) {
        const result = await Bug.destroy( { where: { id: bugId } } )
        console.log( "RESULT, ", result )

        return result
    }

    static async updateBug( updateData: Partial<BugInterface>, bug_id: number ) {
        return Bug.update( updateData, { where: { id: bug_id } } )
    }

    static async updateBugStatus( status: BugStatus, bug_id: number ) {
        return Bug.update( { status: status }, { where: { id: bug_id } } )
    }

    static async isBug( bug_id: number ) {
        return Bug.findOne( { where: { id: bug_id, type: 'bug' } } )
    }


}



