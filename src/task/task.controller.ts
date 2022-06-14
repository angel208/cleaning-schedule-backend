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
    return { task };
  }

  @Post()
  @HttpCode(201)
  async createProduct(@Body() task: Task) {
    const newTask = await this.taskService.create(task);
    return newTask;
  }

  @Put('/:id')
  @HttpCode(201)
  async update(@Param('id') id, @Body() task: Task) {
    const updatedTask = await this.taskService.update(id, task);
    return { updatedTask };
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id') id) {
    const deletedTask = await this.taskService.delete(id);
    return null;
  }
}
