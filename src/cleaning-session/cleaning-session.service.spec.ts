import { CleaningSessionService } from './cleaning-session.service';
import { TaskBuilder } from '../../test/builders/task.builder';

describe('CleaningSessionService', () => {
  let cleaningSessionService: CleaningSessionService;

  beforeEach(async () => {
    cleaningSessionService = new CleaningSessionService();
  });

  describe('Cleaning Session', () => {
    it('2 - given two identical tasks with different priorities, should sort by Priority', () => {
      const t1 = new TaskBuilder().priority(2).build();
      const t2 = new TaskBuilder().priority(5).build();
      const t3 = new TaskBuilder().priority(1).build();
      const input = [t1, t2, t3];
      const result = [t3, t1, t2];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, undefined)).toEqual(result);
    });

    it('7 - given tasks with the same priority, should return the greater amount of tasks', () => {
      const t1 = new TaskBuilder().duration_deep(60).build();
      const t2 = new TaskBuilder().duration_deep(40).build();
      const t3 = new TaskBuilder().duration_deep(20).build();
      const input = [t1, t2, t3];
      const result = [t2, t3];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, 60)).toEqual(result);
    });

    it('1 - two tasks with lower priority should come before a higher priority one, given that there is not enough time.', () => {
      const t1 = new TaskBuilder().priority(2).duration_deep(20).build();
      const t2 = new TaskBuilder().priority(1).duration_deep(60).build();
      const t3 = new TaskBuilder().priority(2).duration_deep(10).build();

      const input = [t1, t2, t3];
      const result = [t1, t3];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, 30)).toEqual(result);
    });

    it('6 - a higher priority task should come before two tasks with lower priority, given that there is enough time.', () => {
      const t1 = new TaskBuilder().priority(2).duration_deep(30).build();
      const t2 = new TaskBuilder().priority(1).duration_deep(60).build();
      const t3 = new TaskBuilder().priority(2).duration_deep(30).build();

      const input = [t1, t2, t3];
      const result = [t2];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, 60)).toEqual(result);
    });

    it('3 - given tasks with the same priority and frequency, should prioritize ones with more days without being executed.', () => {
      const t1 = new TaskBuilder().expiredBy(7).build();
      const t2 = new TaskBuilder().expiredBy(14).build();
      const t3 = new TaskBuilder().expiredBy(21).build();

      const input = [t1, t2, t3];
      const result = [t3, t2, t1];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, undefined)).toEqual(result);
    });

    it('3b - given tasks with the same priority, should prioritize ones with more relative time without being executed.', () => {
      const t1 = new TaskBuilder().frequency_deep(14).expiredBy(14).build();
      const t2 = new TaskBuilder().frequency_deep(14).expiredBy(7).build();
      const t3 = new TaskBuilder().frequency_deep(14).expiredBy(21).build();
      const t4 = new TaskBuilder().frequency_deep(7).expiredBy(21).build();

      const input = [t1, t2, t3, t4];
      const result = [t4, t3, t1, t2];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, undefined)).toEqual(result);
    });

    it('10 - given that there is not enough available time, it should return only a subset of tasks.', () => {
      const t1 = new TaskBuilder().duration_deep(30).build();
      const t2 = new TaskBuilder().duration_deep(30).build();
      const t3 = new TaskBuilder().duration_deep(30).build();
      const t4 = new TaskBuilder().duration_deep(30).build();

      const input = [t1, t2, t3, t4];
      const result = [t1, t2];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, 60)).toEqual(result);
    });

    it('4 - two task with less time expired are better than one with more time expired.', () => {
      const t1 = new TaskBuilder().frequency_deep(14).expiredBy(14).build();
      const t2 = new TaskBuilder().frequency_deep(14).expiredBy(7).build();
      const t3 = new TaskBuilder().frequency_deep(14).expiredBy(21).build();

      const input = [t1, t2, t3];
      const result = [t1, t3];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, 60)).toEqual(result);
    });

    it('12 - a task closer to expire should have priority over one that has just been executed.', () => {
      const t1 = new TaskBuilder().frequency_deep(20).expiredBy(-6).build();
      const t2 = new TaskBuilder().frequency_deep(20).expiredBy(-5).build();

      const input = [t1, t2];
      const result = [t2, t1];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, 60)).toEqual(result);
    });

    it('9 - given that tere is not enough time for any task, return default task.', () => {
      const t1 = new TaskBuilder().duration_deep(60).build();
      const t2 = new TaskBuilder().duration_deep(60).build();

      const defaultTask = new TaskBuilder().name('tiddy up').build();

      const input = [t1, t2];
      const result = [defaultTask];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, 10)).toEqual(result);
    });

    it('11 - a task that has been executed too recently, should not appear (25%).', () => {
      const t1 = new TaskBuilder().frequency_deep(7).expiredBy(0).build();
      const t2 = new TaskBuilder().frequency_deep(7).expiredBy(7).build();

      const input = [t1, t2];
      const result = [t2];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, 60)).toEqual(result);
    });

    it('11 + 9 - a task that has been executed too recently, should not appear (25%), instead return deafult task.', () => {
      const t1 = new TaskBuilder().frequency_deep(7).expiredBy(0).build();
      const t2 = new TaskBuilder().frequency_deep(7).expiredBy(1).build();

      const defaultTask = new TaskBuilder().name('tiddy up').build();

      const input = [t1, t2];
      const result = [defaultTask];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, 60)).toEqual(result);
    });

    it('5a - Priority > Last Executed. Close execution date for all tasks.', () => {
      const t1 = new TaskBuilder()
        .priority(2)
        .frequency_deep(7)
        .expiredBy(2)
        .build();
      const t2 = new TaskBuilder()
        .priority(1)
        .frequency_deep(7)
        .expiredBy(1)
        .build();
      const t3 = new TaskBuilder()
        .priority(3)
        .frequency_deep(7)
        .expiredBy(3)
        .build();

      const input = [t1, t2, t3];
      const result = [t2, t1, t3];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, undefined)).toEqual(result);
    });

    it('5b - Priority < Last Executed IF there is a task expired by a long time (same frequency).', () => {
      const t1 = new TaskBuilder()
        .priority(3)
        .frequency_deep(7)
        .expiredBy(0)
        .build();
      const t2 = new TaskBuilder()
        .priority(4)
        .frequency_deep(7)
        .expiredBy(7)
        .build();
      const t3 = new TaskBuilder()
        .priority(4)
        .frequency_deep(7)
        .expiredBy(0)
        .build();
      const t4 = new TaskBuilder()
        .priority(5)
        .frequency_deep(7)
        .expiredBy(14)
        .build();

      const input = [t1, t2, t3, t4];
      const result = [t1, t2, t4, t3];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, undefined)).toEqual(result);
    });

    it('5c - Priority < Last Executed IF there is a task expired by a long time (distinct frequency).', () => {
      const t1 = new TaskBuilder()
        .priority(3)
        .frequency_deep(7)
        .expiredBy(0)
        .build();
      const t2 = new TaskBuilder()
        .priority(4)
        .frequency_deep(56)
        .expiredBy(14)
        .build();
      const t3 = new TaskBuilder()
        .priority(4)
        .frequency_deep(14)
        .expiredBy(14)
        .build();

      const input = [t1, t2, t3];
      const result = [t1, t3, t2];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, undefined)).toEqual(result);
    });

    it('5d - Priority < Last Executed IF there is a task expired by a long time (distinct frequency) - Weight more relevant.', () => {
      const t1 = new TaskBuilder()
        .priority(3)
        .frequency_deep(7)
        .expiredBy(0)
        .build();
      const t2 = new TaskBuilder()
        .priority(4)
        .frequency_deep(56)
        .expiredBy(28)
        .build();
      const t3 = new TaskBuilder()
        .priority(4)
        .frequency_deep(14)
        .expiredBy(14)
        .build();

      const input = [t1, t2, t3];
      const result = [t1, t3, t2];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, undefined)).toEqual(result);
    });

    it('6 + 3 - a higher priority task should come before two tasks with lower priority, should prioritize ones with more days without being executed. Limited time.', () => {
      const t1 = new TaskBuilder()
        .priority(2)
        .duration_deep(30)
        .frequency_deep(7)
        .expiredBy(7)
        .build();
      const t2 = new TaskBuilder()
        .priority(1)
        .duration_deep(30)
        .frequency_deep(7)
        .expiredBy(7)
        .build();
      const t3 = new TaskBuilder()
        .priority(2)
        .duration_deep(30)
        .frequency_deep(7)
        .expiredBy(14)
        .build();

      const input = [t1, t2, t3];
      const result = [t2, t3];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, 60)).toEqual(result);
    });

    it('6 + 3 + 10 - a higher priority task should come before two tasks with lower priority, should prioritize ones with more days without being executed. Unlimited Time', () => {
      const t1 = new TaskBuilder()
        .priority(2)
        .duration_deep(30)
        .frequency_deep(7)
        .expiredBy(7)
        .build();
      const t2 = new TaskBuilder()
        .priority(1)
        .duration_deep(30)
        .frequency_deep(7)
        .expiredBy(7)
        .build();
      const t3 = new TaskBuilder()
        .priority(2)
        .duration_deep(30)
        .frequency_deep(7)
        .expiredBy(14)
        .build();

      const input = [t1, t2, t3];
      const result = [t2, t3, t1];
      // eslint-disable-next-line prettier/prettier
      expect( cleaningSessionService.calculate(input, undefined)).toEqual(result);
    });
  });
});
