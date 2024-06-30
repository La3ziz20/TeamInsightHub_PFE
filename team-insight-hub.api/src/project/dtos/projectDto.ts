export interface ProjectDto {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: Date;
  endDate: Date;
  technology: string;
  details: string;
  clientId: string;
  consultants?: string[];
}
