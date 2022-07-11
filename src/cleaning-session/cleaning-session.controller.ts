import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { Task } from 'src/task/task.schema';
import { CleaningSessionService } from './cleaning-session.service';
import { TaskService } from '../task/task.service';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Cleaning Session Optimizer')
@Controller('cleaning-session')
export class CleaningSessionController {
  constructor(
    private readonly cleaningSessionService: CleaningSessionService,
    private readonly taskService: TaskService,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOkResponse({
    description: 'The optimized list was successfully retrieved.',
    type: Task,
    isArray: true,
  })
  @ApiQuery({
    name: 'availableTime',
    description:
      'Duration of the cleaning session in minutes, so the optimizer can determine how many and which tasks to return. If null, All tasks are retrieved in order of recommended execution',
    required: false,
  })
  async getTasks(@Query('availableTime') availableTime: number): Promise<Task[]> {
    const taskList = await this.taskService.getAll();
    return this.cleaningSessionService.calculate(taskList, availableTime);
  }
}
