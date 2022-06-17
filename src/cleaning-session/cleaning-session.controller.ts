import { Controller, Get, HttpCode } from '@nestjs/common';
import { Task } from 'src/task/task.schema';
import { CleaningSessionService } from './cleaning-session.service';

@Controller('cleaning-session')
export class CleaningSessionController {
  constructor(
    private readonly cleaningSessionService: CleaningSessionService,
  ) {}

  @Get()
  @HttpCode(200)
  getTasks(): Promise<Task[]> {
    return this.cleaningSessionService.calculate();
  }
}
