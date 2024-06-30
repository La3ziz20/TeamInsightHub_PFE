import { Project } from "src/schemas/project.schema";
import { ProjectDto } from "../dtos/projectDto";


export function mapProjectEntityToDto(project: Project): ProjectDto {
    return {
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        technology: project.technology,
        details: project.details,
        clientId: project.clientId,
        consultants: project.consultants ? project.consultants : []
    }
}