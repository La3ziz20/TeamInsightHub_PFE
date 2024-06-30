/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpException, HttpStatus, Post, Delete, Param, NotFoundException, Put } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDto } from './dtos/projectDto';

@Controller("api/projects")
export class ProjectController {
  constructor(private readonly projectServices: ProjectService) { }
  @Get()
  async getAllProject(): Promise<ProjectDto[]> {
    return await this.projectServices.getAllProject();
  }
  @Post()
  async create(@Body() createProjectDto: ProjectDto): Promise<ProjectDto> {
    try {
      const createdProject = await this.projectServices.createProject(createProjectDto);
      return createdProject;
    }
    catch (error) {
      throw new HttpException('An error occurred while creating the Project.' + error, HttpStatus.BAD_REQUEST);
    }

  }
  @Delete('/:id')
  async deletProject(@Param('id') projectId: string): Promise<ProjectDto> {
    const deletedProject = await this.projectServices.deletProject(projectId);
    return deletedProject;
  }
  @Put(':id')
  async updateProject(@Param('id') projectId: string, @Body() updateProjectDto: ProjectDto): Promise<ProjectDto> {
    const updatedProject = await this.projectServices.updateProject(projectId, updateProjectDto);

    if (!updatedProject) {
      throw new NotFoundException(`Client with ID ${projectId} not found`);
    }
    return updatedProject;
  }
  @Get('/:id')
  async getSpecificProject(@Param('id') projectId: string): Promise<ProjectDto> {
    return await this.projectServices.getSpecificProject(projectId);

  }
  @Get('byClient/:clientId')
  async getProjectsByClient(@Param('clientId') clientId: string): Promise<ProjectDto[]> {
    return await this.projectServices.getProjectsByClient(clientId);
  }
  @Put('editConsultants/:projectId')
  async addConsultantsToProject(@Param('projectId') projectId: string, @Body() consultants: { consultantIds: string[] }): Promise<ProjectDto> {
    try {
      const updatedProject = await this.projectServices.addConsultantsToProject(projectId, consultants.consultantIds);
      return updatedProject;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      // Gérer d'autres types d'erreurs si nécessaire
      throw error;
    }
  }
  @Delete('/deleteConsultant/:projectId/:consultantId')
  async deleteConsultantFromProject(@Param('projectId') projectId: string, @Param('consultantId') consultantId: string): Promise<ProjectDto> {
    try {
      const updatedProject = await this.projectServices.deleteConsultantFromProject(projectId, consultantId);
      return updatedProject;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('byConsultantId/:consultantId')
  async getProjectsByConsultant(@Param('consultantId') consultantId: string): Promise<ProjectDto[]> {
    return await this.projectServices.getProjectsByConsultantId(consultantId);
  }

}