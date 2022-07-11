import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  HttpException,
  Patch,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.schema';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  OmitType,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ description: 'The list was successfully retrieved.', type: Task, isArray: true })
  async getTasks(): Promise<Task[]> {
    return await this.taskService.getAll();
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOkResponse({ description: 'The task was successfully retrieved.', type: Task })
  @ApiNotFoundResponse({ description: 'The task with the given id does not exist.' })
  async findById(@Param('id') id) {
    const task = await this.taskService.getById(id);

    if (!task) throw new HttpException('Task Not Found in our registry', HttpStatus.NOT_FOUND);

    return task;
  }

  @Post()
  @HttpCode(201)
  @ApiBody({ type: OmitType(Task, ['last_executed_deep'] as const) })
  @ApiCreatedResponse({ description: 'The task was successfully created.', type: Task })
  @ApiForbiddenResponse({ description: 'A taks with the same name already exists.' })
  async createTask(@Body() task: Task) {
    const existingTask = await this.taskService.getByName(task.name);

    if (existingTask) throw new HttpException('Duplicated Task', HttpStatus.FORBIDDEN);

    const newTask = await this.taskService.create(task);
    return newTask;
  }

  @Put('/:id')
  @HttpCode(201)
  @ApiBody({ type: OmitType(Task, ['last_executed_deep'] as const) })
  @ApiCreatedResponse({ description: 'The task was successfully updated.', type: Task })
  @ApiNotFoundResponse({ description: 'The task with the given id does not exist.' })
  async update(@Param('id') id, @Body() task: Task) {
    const existingTask = await this.taskService.getById(id);

    if (!existingTask)
      throw new HttpException('Task Not Found in our registry', HttpStatus.NOT_FOUND);

    const updatedTask = await this.taskService.update(id, task);
    return updatedTask;
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'The task was successfully deleted.' })
  @ApiNotFoundResponse({ description: 'The task with the given id does not exist.' })
  async delete(@Param('id') id) {
    const existingTask = await this.taskService.getById(id);

    if (!existingTask)
      throw new HttpException('Task Not Found in our registry', HttpStatus.NOT_FOUND);

    await this.taskService.delete(id);
    return null;
  }

  @Patch('/:id/done')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'The task was successfully set as done.' })
  @ApiNotFoundResponse({ description: 'The task with the given id does not exist.' })
  async markAsDone(@Param('id') id) {
    const existingTask = await this.taskService.getById(id);

    if (!existingTask)
      throw new HttpException('Task Not Found in our registry', HttpStatus.NOT_FOUND);

    await this.taskService.markAsDone(id);
    return null;
  }
}
