import { ProjectsRepository } from '../../repositories/ProjectsRepository';
import { SimplifiedProject } from '../../entities/SimplifiedProject';
import { Project } from '../../entities/Project';
import { RegisterProjectUsecase } from '../project/RegisterProjectUsecase';
import { ComparisonPagesRepository } from '../../repositories/ComparisonPagesRepository';
import { OpenSourceProjectsAPI } from '../../external/OpenSourceProjectsAPI';

export class CreateComparisonPageUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private openSourceProjectsAPI: OpenSourceProjectsAPI,
    private registerProjectUsecase: RegisterProjectUsecase,
    private comparisonPagesRepository: ComparisonPagesRepository,
  ) {}

  async execute(projectIds: string[]) {
    const comparisonPagesWithSameProjects = await this.comparisonPagesRepository.search(projectIds, true);
    if (comparisonPagesWithSameProjects.length > 0) {
      throw new Error('Comparison Page already exists');
    }
    const projectsFromRepository = await this.getCurrentProjects(projectIds);
    const projectsCreated = await this.registerNewProjects(projectsFromRepository);
    const projects = projectsFromRepository.map((item) => {
      if (item.project) {
        return item.project;
      }
      return projectsCreated.find((project) => project.id === item.fullName) as Project;
    });
    const slug = await this.generateSlugToComparisonProjects(projects);
    await this.comparisonPagesRepository.create({
      slug,
      qtdUserVisits: 0,
      projectIds: projects.map((project) => project.id),
    });
  }

  private async getCurrentProjects(projectFullNames: string[]) {
    return await Promise.all(
      projectFullNames.map(async (fullName) => ({
        fullName,
        project: await this.projectsRepository.findById(fullName),
      })),
    );
  }

  private async registerNewProjects(
    projectsFromRepository: { fullName: string; project: Project | null }[],
  ): Promise<Project[]> {
    const projectsToCreate = await Promise.all(
      projectsFromRepository
        .filter((item) => item.project === null)
        .map(async ({ fullName }) => ({
          fullName,
          simplifiedProject: await this.openSourceProjectsAPI.findSimplifiedByFullname(fullName),
        })),
    );
    const projectsToCreateFound = projectsToCreate
      .filter((item) => item.simplifiedProject !== null)
      .map((item) => ({ id: item.fullName, simplifiedProject: item.simplifiedProject as SimplifiedProject }));
    if (projectsToCreateFound.length < projectsToCreate.length) {
      throw new Error('Project not found');
    }
    const projectsCreated = await Promise.all(
      projectsToCreateFound.map(
        async ({ simplifiedProject }) => await this.registerProjectUsecase.execute(simplifiedProject),
      ),
    );
    return projectsCreated;
  }

  private async generateSlugToComparisonProjects(projects: Project[]): Promise<string> {
    let fullNameIndex = -1;
    const newSlug = () =>
      projects.reduce(
        (acc, project, index) =>
          `${acc}${acc ? '-' : ''}${index <= fullNameIndex ? `${project.owner}-` : ''}${project.name}`,
        '',
      );
    let foundSlug: boolean;
    let slug: string;
    do {
      slug = newSlug();
      foundSlug = !!(await this.comparisonPagesRepository.findBySlug(slug));
      if (!foundSlug) {
        return slug;
      }
      fullNameIndex++;
    } while (fullNameIndex < projects.length);
    throw new Error('Fail on generate slug to comparison project');
  }
}
