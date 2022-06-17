import { Injectable } from '@nestjs/common';
import { Task } from 'src/task/task.schema';
import { TaskService } from '../task/task.service';

@Injectable()
export class CleaningSessionService {
  constructor(private readonly taskService: TaskService) {}

  async calculate(): Promise<Task[]> {
    const calculatedTaskInSession = await this.taskService.getAll();
    //calculate the tasks to be returned here
    //
    //
    return calculatedTaskInSession;
  }
}
