/* eslint-disable prettier/prettier */
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientService } from 'src/client/client.service';
import { Project } from 'src/schemas/project.schema';
import { Client } from 'src/schemas/client.schema';
import { mapProjectEntityToDto } from './mappers/project-mapper';
import { ProjectDto } from './dtos/projectDto';
export interface IProjectService {
  getAllProject(): Promise<ProjectDto[]>;
  createProject(createProjectDto: ProjectDto): Promise<ProjectDto>;
  deletProject(projectId: string): Promise<ProjectDto>;
  updateProject(projectId: string, updateProjectDto: ProjectDto): Promise<ProjectDto>;
  getSpecificProject(projectId: string): Promise<ProjectDto>;
  getProjectsByClient(clientId: string): Promise<ProjectDto[]>;
  addConsultantsToProject(projectId: string, consultantIds: string[]): Promise<ProjectDto>;
  deleteConsultantFromProject(projectId: string, consultantId: string): Promise<ProjectDto>;
  deleteProjectsByClientId(clientId: string): void;
  getProjectsByConsultantId(consultantId: string): Promise<ProjectDto[]>;
}
@Injectable()
export class ProjectService implements IProjectService {

  constructor(@InjectModel('Project') private readonly projectModel: Model<Project>,
    @Inject(forwardRef(() => ClientService)) private readonly clientService: ClientService) { }

  async getAllProject(): Promise<ProjectDto[]> {
    const projects = await this.projectModel.find();
    if (projects.length == 0) {
      throw new NotFoundException('No project found.');
    }
    return projects.map((project) => (mapProjectEntityToDto(project)))
  }
  async getSpecificProject(projectId: string): Promise<ProjectDto> {
    let fetchedProject;
    try {
      fetchedProject = await this.projectModel.findById(projectId).populate('consultants');
    } catch (error) {
      throw new NotFoundException('Could not found project.');
    }

    if (!fetchedProject) {
      throw new NotFoundException('Could not found project.');
    }
    return mapProjectEntityToDto(fetchedProject);
  }
  public async createProject(createProjectDto: ProjectDto): Promise<ProjectDto> {

    try {
      const client = await this.clientService.getSpecificClient(createProjectDto.clientId)
      if (!client) {
        throw new Error('Client not found');
      }
      const newProject = new this.projectModel({
        title: createProjectDto.title,
        description: createProjectDto.description,
        status: createProjectDto.status,
        startDate: createProjectDto.startDate,
        technology: createProjectDto.technology,
        endDate: createProjectDto.endDate,
        details: createProjectDto.details,
        clientId: createProjectDto.clientId

      });
      const generatedProject = await newProject.save();
      return mapProjectEntityToDto(generatedProject);
    } catch (error) {
      throw new BadRequestException('something went wrong' + error); // to create global error handling.. for resuability
    }
  }

  public async deletProject(projectId: string): Promise<ProjectDto> {
    const deletedProject = await this.projectModel.findByIdAndDelete(projectId);

    if (!deletedProject)
      throw new NotFoundException(`Can't find by ${projectId}`);
    return mapProjectEntityToDto(deletedProject);
  }
  async updateProject(projectId: string, updateProjectDto: ProjectDto): Promise<ProjectDto> {
    const existingProject = await this.projectModel.findByIdAndUpdate(projectId, updateProjectDto, { new: true });

    if (!existingProject) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return mapProjectEntityToDto(existingProject);
  }

  async addConsultantsToProject(projectId: string, consultantIds: string[]): Promise<ProjectDto> {
    const project = await this.projectModel.findById(projectId);

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    project.consultants.push(...consultantIds);
    const updatedProject = await this.projectModel.findByIdAndUpdate(
      projectId,
      project,
      { new: true }
    ).populate('consultants');

    return mapProjectEntityToDto(updatedProject);
  }

  async deleteConsultantFromProject(projectId: string, consultantId: string): Promise<ProjectDto> {
    const project = await this.projectModel.findById(projectId);

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    project.consultants = project.consultants.filter(id => id != consultantId);
    const updatedProject = await this.projectModel.findByIdAndUpdate(
      projectId,
      project,
      { new: true }
    ).populate('consultants');

    return mapProjectEntityToDto(updatedProject);
  }
  async getProjectsByClient(clientId: string): Promise<ProjectDto[]> {
    const projects: Project[] = await this.projectModel.find({ clientId });
    const projectsDto: ProjectDto[] = projects.map(p => mapProjectEntityToDto(p));

    return projectsDto;
  }

  deleteProjectsByClientId(clientId: string): void {
    this.projectModel.deleteMany({ clientId });
  }

  async getProjectsByConsultantId(consultantId: string): Promise<ProjectDto[]> {
    try {
      const projects = await this.projectModel.find({ consultants: consultantId });
      return projects.map((project) => (mapProjectEntityToDto(project)));
    } catch (error) {
      throw new Error('Failed to get projects by consultant ID');
    }
  }

}