import { Validators, db } from "../helpers"
import { ProjectInterface, UserInterface, AssignProjectRequest } from "../types"

const Project = db.Project;
const User = db.User;
const ProjectAssignment = db.ProjectAssignment;

export class ProjectHandler {

    static async findProjectByName( projectName: string ) {
        return Project.findOne( { where: { name: projectName } } )
    }

    static async createProject( { name, description, logo, manager_id }: Partial<ProjectInterface> ) {
        const project = Project.build( { name, description, logo, manager_id } )
        return project.save();
    }

    static async findProjectByIdWithManagerId( project_id: number, manager_id: number ) {
        return Project.findOne( { where: { id: project_id, manager_id: manager_id } } )
    }

    static async deleteProjectById( project_id: number ) {
        const result = Project.destroy( { where: { id: project_id } } )

        return result
    }

    static async getManagedProjects( manager_id: number ) {
        const projects = await Project.findAll( {
            where: { manager_id: manager_id }, order: [['createdAt', 'ASC']]
        } )
        return projects;
    }

    static async getAssignedProjects( user_id: number ) {
        const assignments = await ProjectAssignment.findAll( {
            where: { user_id: user_id },
            attributes: ['project_id'],
        } )
        const projectIds = assignments.map( assignment => assignment.project_id )
        return await Project.findAll( {
            where: { id: projectIds },
            order: [['createdAt', 'ASC']]
        } )
    }

    static async getProjectById( project_id: number ) {
        const project = await Project.findOne( {
            where: { id: project_id },
            include: [{
                model: User, as: 'assigned_team', through: { attributes: ['type', 'createdAt'] }, attributes: ['id', 'name', 'email', 'user_type']
            }]
        } )
        return project;
    }

    static async updateProject( updateData: Partial<ProjectInterface>, project_id: number ) {
        return Project.update( updateData, { where: { id: project_id } } )
    }

    static async assignToProject( projectId: number, assignments: any ) {
        const assignmentsData = assignments.map( ( assignment: any ) => ( { project_id: projectId, user_id: assignment.userId, type: assignment.type } ) );
        return ProjectAssignment.bulkCreate( assignmentsData );
    }

    static async isUserAssigned( project_id: number, user_id: number ) {
        return ProjectAssignment.findOne( { where: { project_id: project_id, user_id: user_id } } )
    }

    static async unassignUser( project_id: number, user_id: number ) {
        return ProjectAssignment.destroy( { where: { project_id: project_id, user_id: user_id } } )
    }


}



