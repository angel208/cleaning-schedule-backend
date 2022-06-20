import { TaskDTO } from '../DTO/task.dto';

//BUILDER
export class TaskBuilder {
  private readonly _task: TaskDTO;

  constructor() {
    this._task = {
      _id: '5eb78994dbb89024f04a2507',
      name: 'Kitchen',
      priority: 3,
      frequency_deep: 7,
      frequency_light: 7,
      duration_deep: 20,
      duration_light: 20,
      last_executed_deep: new Date('1995-12-17'),
      last_executed_light: new Date('1995-12-17'),
    };
  }

  name(name: string): TaskBuilder {
    this._task.name = name;
    return this;
  }

  priority(priority: number): TaskBuilder {
    this._task.priority = priority;
    return this;
  }

  frequency_deep(frequency_deep: number): TaskBuilder {
    this._task.frequency_deep = frequency_deep;
    return this;
  }

  frequency_light(frequency_light: number): TaskBuilder {
    this._task.frequency_light = frequency_light;
    return this;
  }

  duration_deep(duration_deep: number): TaskBuilder {
    this._task.duration_deep = duration_deep;
    return this;
  }

  duration_light(duration_light: number): TaskBuilder {
    this._task.duration_light = duration_light;
    return this;
  }

  last_executed_deep(last_executed_deep: string): TaskBuilder {
    const date = new Date(last_executed_deep);
    this._task.last_executed_deep = date;
    return this;
  }

  last_executed_light(last_executed_light: string): TaskBuilder {
    const date = new Date(last_executed_light);
    this._task.last_executed_light = date;
    return this;
  }

  expiredBy(days: number): TaskBuilder {
    const date1 = new Date(
      new Date(
        new Date().setDate(
          this._task.last_executed_deep.getDate() -
            (this._task.frequency_deep + days),
        ),
      ),
    );

    const date2 = new Date(
      new Date(
        new Date().setDate(
          this._task.last_executed_light.getDate() -
            (this._task.frequency_deep + days),
        ),
      ),
    );

    this._task.last_executed_deep = date1;
    this._task.last_executed_light = date2;

    return this;
  }

  build(): TaskDTO {
    return this._task;
  }
}