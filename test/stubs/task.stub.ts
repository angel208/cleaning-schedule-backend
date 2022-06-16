class TaskDTO {
  readonly _id: string;
  readonly name: string;
  readonly deepFreq: number;
  readonly deepExecutionDate: string;
}

export const TaskDTOStub = (): TaskDTO => {
  return {
    _id: '5eb78994dbb89024f04a2507',
    name: 'Vinicius Santos de Pontes',
    deepFreq: 12,
    deepExecutionDate: '123',
  };
};

export const TaskDTOStubUpdated = (): TaskDTO => {
  return {
    _id: '5eb78994dbb89024f04a2507',
    name: 'Vinicius Santos de Pontes 2',
    deepFreq: 12,
    deepExecutionDate: '123',
  };
};
