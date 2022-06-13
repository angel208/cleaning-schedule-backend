import { Injectable } from '@nestjs/common';
import { Task } from './task.model';


@Injectable()
export class TaskService {
  getTasks(): Task[] {

    let taskList : Task[];
    taskList = [ new Task(1,"kitchen", 3, new Date().getDate().toString()  ) ]

    return taskList;
  }
}
