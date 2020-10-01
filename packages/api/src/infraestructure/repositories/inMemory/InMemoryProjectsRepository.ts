import { Project } from '../../../entities/Project';
import { ProjectsRepository } from '../../../repositories/ProjectsRepository';

let projectsList: Project[] = [];

export class InMemoryProjectsRepository implements ProjectsRepository {
  async create(project: Project): Promise<void> {
    const projectFound = await this.findById(project.id);
    if (projectFound) {
      throw new Error('Project already exists');
    }
    projectsList = [...projectsList, project];
  }

  async update(project: Project): Promise<void> {
    const projectFound = await this.findById(project.id);
    if (!projectFound) {
      throw new Error('Project not found');
    }
    projectsList = projectsList.map((currentProject) => {
      if (currentProject === projectFound) {
        return project;
      }
      return currentProject;
    });
  }

  findById = async (id: string): Promise<Project | null> => projectsList.find((project) => project.id === id) || null;
}
