export class TaskDTO {
  _id: string;
  name: string;
  priority: number;
  frequency_deep: number;
  frequency_light: number;
  duration_deep: number;
  duration_light: number;
  last_executed_deep: Date;
  last_executed_light: Date;
}
