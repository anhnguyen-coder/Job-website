export interface JobCreateForm {
  title: string;
  description: string;
  categoryIds: string[];
  location: string;
  budget: number;
  tasks: TaskInputForm[];
  dateStart: string;
  dateEnd: string;
}

export interface TaskInputForm {
  title: string;
  description: string;
}
