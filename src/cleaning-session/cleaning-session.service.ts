import { Injectable } from '@nestjs/common';
import { Task } from 'src/task/task.schema';

@Injectable()
export class CleaningSessionService {
  public calculate(taskList: Task[], availableTime: number): Task[] {
    //calculate the tasks to be returned here
    //
    //
    const sortedList = taskList.sort((a, b) => {
      return this.calculateScore(a) <= this.calculateScore(b) ? 1 : -1;
    });

    let limitedSortedList = sortedList;

    if (availableTime != undefined) {
      limitedSortedList = this.getLimitedArray(
        limitedSortedList,
        availableTime,
      );
    }

    //limitedSortedList.forEach((e) => (e.frequency_light = this.calculateScore(e)));
    console.log(limitedSortedList);
    return limitedSortedList;
  }

  private calculateScore(task: Task): number {
    const currentDate = this.getCurrentDate();
    console.log('*********');
    console.log({ currentDate });
    const lastExecuted = task.last_executed_deep;
    console.log({ lastExecuted });
    const daysAfterLastExecution = this.dateDiffInDays(
      currentDate,
      lastExecuted,
    );
    console.log({ daysAfterLastExecution });
    const taskFrequency = task.frequency_deep;
    console.log({ taskFrequency });
    const daysExpired = (taskFrequency - daysAfterLastExecution) * -1;
    console.log({ daysExpired });
    const expiredFrequencyDelta = daysExpired / taskFrequency;
    console.log({ expiredFrequencyDelta });
    const expiredFrequencyDeltaCurved = this.calculateDeltaCurved(
      expiredFrequencyDelta,
    );
    console.log({ expiredFrequencyDeltaCurved });

    // eslint-disable-next-line prettier/prettier
    const S = 0.7 * ((5 - task.priority) + ((5 - task.priority) * 0.4)) + 0.3 * expiredFrequencyDeltaCurved;
    console.log({ S });
    return S;
  }

  private getCurrentDate() {
    //return new Date();
    return new Date('1995-12-17T22:18:03.374Z');
  }

  private calculateDeltaCurved(x: number) {
    if (x < 0) {
      return x ** 3;
    } else {
      return x ** 2;
    }
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

  // a and b are javascript Date objects
  //https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
  private dateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
  }
}
