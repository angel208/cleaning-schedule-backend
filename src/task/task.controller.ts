import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Res,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.schema';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @HttpCode(200)
  async getTasks(): Promise<Task[]> {
    return await this.taskService.getAll();
  }

  @Get('/:id')
  @HttpCode(200)
  async findById(@Param('id') id) {
    const task = await this.taskService.getById(id);

    if (!task)
      throw new HttpException(
        'Task Not Found in our registry',
        HttpStatus.NOT_FOUND,
      );

    return task;
  }

  @Post()
  @HttpCode(201)
  async createTask(@Body() task: Task) {
    const existingTask = await this.taskService.getByName(task.name);

    if (existingTask)
      throw new HttpException('Duplicated Task', HttpStatus.FORBIDDEN);

    const newTask = await this.taskService.create(task);
    return newTask;
  }

  @Put('/:id')
  @HttpCode(201)
  async update(@Param('id') id, @Body() task: Task) {
    const existingTask = await this.taskService.getById(id);

    if (!existingTask)
      throw new HttpException(
        'Task Not Found in our registry',
        HttpStatus.NOT_FOUND,
      );

    const updatedTask = await this.taskService.update(id, task);
    return updatedTask;
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id') id) {
    const existingTask = await this.taskService.getById(id);

    if (!existingTask)
      throw new HttpException(
        'Task Not Found in our registry',
        HttpStatus.NOT_FOUND,
      );

    await this.taskService.delete(id);
    return null;
  }
}
