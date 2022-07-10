import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { Task } from './task.schema';

describe('Task Controller UT', () => {
  describe('Mark Task as done', () => {
    it('validate DTO', async () => {
      const target: ValidationPipe = new ValidationPipe({ transform: true, whitelist: true });
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: Task,
        data: '',
      };
      await target.transform(<Task>{}, metadata).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'name should not be empty',
          'priority should not be empty',
          'priority must be an integer number',
          'frequency_deep should not be empty',
          'frequency_deep must be an integer number',
          'duration_deep should not be empty',
          'duration_deep must be an integer number',
        ]);
      });
    });
  });
});
