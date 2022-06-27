import { Injectable } from '@nestjs/common';
import { Task } from 'src/task/task.schema';
import { TaskBuilder } from '../../test/builders/task.builder';

@Injectable()
export class CleaningSessionService {
  public calculate(taskList: Task[], availableTime: number): Task[] {
    taskList.forEach((t) => (t.score = this.calculateScore(t)));

    const sortedList = taskList.sort((a, b) => {
      return a.score <= b.score ? 1 : -1;
    });

    let limitedSortedList = sortedList;

    if (availableTime != undefined) {
      limitedSortedList = this.optimizeTaskList(limitedSortedList, availableTime);
    }

    console.log(limitedSortedList);

    if (limitedSortedList.length == 0) {
      const defaultTask = new TaskBuilder().defaultTask().build();
      limitedSortedList.push(defaultTask);
    }

    return limitedSortedList;
  }

  private calculateScore(task: Task): number {
    const currentDate = this.getCurrentDate();
    console.log('*********');
    console.log({ currentDate });
    const lastExecuted = task.last_executed_deep;
    console.log({ lastExecuted });
    const daysAfterLastExecution = this.dateDiffInDays(currentDate, lastExecuted);
    console.log({ daysAfterLastExecution });
    const taskFrequency = task.frequency_deep;
    console.log({ taskFrequency });
    const daysExpired = (taskFrequency - daysAfterLastExecution) * -1;
    console.log({ daysExpired });
    const expiredFrequencyDelta = daysExpired / taskFrequency;
    console.log({ expiredFrequencyDelta });
    const expiredFrequencyDeltaCurved = this.calculateDeltaCurved(expiredFrequencyDelta);
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

  public optimizeTaskList(originalTaskList, availabletime) {
    const taskListTmp = [...originalTaskList];
    taskListTmp.unshift({});

    //TODO: the dynaminc version of this function needs to be fixed.
    //ill use the standard recursive version in the meantime.
    const knapsack = (i, left_capacity) => {
      let result;

      //base condition
      if (i == 0 || left_capacity == 0) {
        result = { val: 0, list: [] };
      }
      //item exceeds available capacity
      else if (taskListTmp[i].duration_deep > left_capacity) {
        result = knapsack(i - 1, left_capacity);
      }
      //branch out
      else {
        //first path
        const donotinclude = knapsack(i - 1, left_capacity);
        //second path
        const doinclude = knapsack(i - 1, left_capacity - taskListTmp[i].duration_deep);
        //calculate a new weight based also on priority.
        //the basic idea here is that if there is a conflict between 2 lower priorities and 1 higher priority, the high priority should win.
        //but 3 or more tasks of lower priority can surpass one with a higher priority.
        doinclude.val =
          taskListTmp[i].score > 0
            ? doinclude.val +
              taskListTmp[i].score / (taskListTmp[i].priority + (taskListTmp[i].priority - 0.8))
            : doinclude.val + 0.1;
        doinclude.list.push(taskListTmp[i]);
        //compare both branches
        if (shouldInclude(doinclude, donotinclude) == true) result = doinclude;
        else result = donotinclude;
      }
      return result;
    };

    //comparator function
    const shouldInclude = (include, exclude) => {
      if (include.val == exclude.val) if (include.list.length >= exclude.list.length) return true;

      return include.val > exclude.val;
    };

    //execute knapsack algorithm
    return knapsack(taskListTmp.length - 1, availabletime).list;
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
