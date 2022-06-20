import { Injectable } from '@nestjs/common';
import { Task } from 'src/task/task.schema';

@Injectable()
export class CleaningSessionService {
  public calculate(taskList: Task[], availableTime: number): Task[] {
    //calculate the tasks to be returned here
    //
    //
    const sortedList = taskList.sort(
      (a, b) => this.calculateScore(a) - this.calculateScore(b),
    );

    let limitedSortedList = sortedList;

    if (availableTime != undefined) {
      limitedSortedList = this.getLimitedArray(
        limitedSortedList,
        availableTime,
      );
    }

    return limitedSortedList;
  }

  private calculateScore(task: Task): number {
    const S = task.priority;
    return S;
  }

  private getLimitedArray(tasks: Task[], availableTime: number): Task[] {
    const limitedArray: Task[] = [];
    let listDuration = 0;

    for (const task of tasks) {
      if (listDuration < availableTime) {
        if (task.duration_deep <= availableTime - listDuration) {
          limitedArray.push(task);
          listDuration = listDuration + task.duration_deep;
        }
      }
    }

    return limitedArray;
  }
}
