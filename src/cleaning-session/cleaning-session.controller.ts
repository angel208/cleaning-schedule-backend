import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { Task } from 'src/task/task.schema';
import { CleaningSessionService } from './cleaning-session.service';
import { TaskService } from '../task/task.service';

@Controller('cleaning-session')
export class CleaningSessionController {
  constructor(
    private readonly cleaningSessionService: CleaningSessionService,
    private readonly taskService: TaskService,
  ) {}

  @Get()
  @HttpCode(200)
  async getTasks(@Query('availableTime') availableTime: number): Promise<Task[]> {
    const taskList = await this.taskService.getAll();
    return this.cleaningSessionService.calculate(taskList, availableTime);
  }
}
