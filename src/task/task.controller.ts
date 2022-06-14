import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.schema';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createProduct(@Res() response, @Body() task: Task) {
    const newTask = await this.taskService.create(task);
    return response.status(HttpStatus.CREATED).json({ newTask });
  }

  @Get()
  async getTasks(): Promise<Task[]> {
    return await this.taskService.getTasks();
  }
}
