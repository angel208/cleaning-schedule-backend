import { TaskDTO } from '../DTO/task.dto';

export const TaskDTOStub = (): TaskDTO => {
  return {
    _id: '5eb78994dbb89024f04a2507',
    name: 'Kitchen',
    priority: 12,
    frequency_deep: 14,
    frequency_light: 7,
    duration_deep: 10,
    duration_light: 30,
    last_executed_deep: new Date('1995-12-17'),
    last_executed_light: new Date('1995-12-17'),
  };
};

export const TaskDTOStubUpdated = (): TaskDTO => {
  return {
    _id: '5eb78994dbb89024f04a2507',
    name: 'Sink',
    priority: 12,
    frequency_deep: 14,
    frequency_light: 7,
    duration_deep: 10,
    duration_light: 30,
    last_executed_deep: new Date('1995-12-17'),
    last_executed_light: new Date('1995-12-17'),
  };
};
