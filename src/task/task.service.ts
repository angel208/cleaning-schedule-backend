import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(task: Task): Promise<Task> {
    const createdTask = new this.taskModel(task);
    return await createdTask.save();
  }

  async getAll(): Promise<Task[]> {
    console.log(await this.taskModel.find().exec());
    return await this.taskModel.find().exec();
  }

  async getById(id): Promise<Task> {
    return this.taskModel.findById(id).exec();
  }

  async getByName(name): Promise<Task> {
    return this.taskModel.findOne({ name: name }).exec();
  }

  async update(id, task: Task): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(id, task, { new: true });
  }

  async delete(id): Promise<any> {
    return await this.taskModel.findByIdAndRemove(id);
  }
}
