import { TaskDTO, TaskBuilder } from '../../src/task/builders/task.builder';

export const TaskDTOStub = (): TaskDTO => {
  return new TaskBuilder().name('Kitchen').build();
};

export const TaskDTOStubUpdated = (): TaskDTO => {
  return new TaskBuilder().name('Sink').build();
};
