import { TaskBuilder } from './builders/task.builder';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { HttpException } from '@nestjs/common';

describe('Task Controller UT', () => {
  let taskController: TaskController;
  let spyService: TaskService;
  let taskStub;
  let updatedTaskStub;

  beforeAll(async () => {
    taskStub = new TaskBuilder().build();
    updatedTaskStub = new TaskBuilder().name('updated').build();

    const ApiServiceProvider = {
      provide: TaskService,
      useFactory: () => ({
        create: jest.fn(() => taskStub),
        getAll: jest.fn(() => [taskStub]),
        getByName: jest.fn(() => null),
        getById: jest.fn(() => taskStub),
        update: jest.fn(() => updatedTaskStub),
        delete: jest.fn(() => taskStub),
        markAsDone: jest.fn(() => taskStub),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService, ApiServiceProvider],
    }).compile();

    taskController = app.get<TaskController>(TaskController);
    spyService = app.get<TaskService>(TaskService);
  });

  describe('Post Task', () => {
    it('should return the saved object', async () => {
      const createdTask = await taskController.createTask(taskStub);
      expect(createdTask.name).toBe(taskStub.name);
    });

    it('should return (Bad Request - 400) exception if name already exists', async () => {
      jest.spyOn(spyService, 'getByName').mockImplementationOnce(async () => taskStub);
      await expect(taskController.createTask(taskStub)).rejects.toThrow(HttpException);
    });
  });

  describe('Get All Tasks', () => {
    it('should return the objects inside the DB', async () => {
      const fetchedTasks = await taskController.getTasks();
      expect(fetchedTasks[0].name).toBe(taskStub.name);
    });
    it('should return empty', async () => {
      jest.spyOn(spyService, 'getAll').mockImplementationOnce(async () => []);
      expect(await taskController.getTasks()).toEqual([]);
    });
  });

  describe('Get Task By Id', () => {
    it('should return the object', async () => {
      const fetchedTask = await taskController.findById(taskStub._id);
      expect(fetchedTask.name).toBe(taskStub.name);
    });
    it('should return Not Found 404', async () => {
      jest.spyOn(spyService, 'getById').mockImplementationOnce(async () => null);
      await expect(taskController.findById(taskStub._id)).rejects.toThrow(HttpException);
    });
  });

  describe('Update Task', () => {
    it('should return the updated object', async () => {
      const updatedTask = await taskController.update(taskStub._id, updatedTaskStub);
      expect(updatedTask.name).toBe(updatedTaskStub.name);
    });
    it('should return Not Found 404', async () => {
      jest.spyOn(spyService, 'getById').mockImplementationOnce(async () => null);
      await expect(taskController.update(taskStub._id, updatedTaskStub)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('Delete Task', () => {
    it('should delete object', async () => {
      await taskController.delete(taskStub._id);
      jest.spyOn(spyService, 'getById').mockImplementationOnce(async () => null);
      await expect(taskController.findById(taskStub._id)).rejects.toThrow(HttpException);
    });
    it('should return null', async () => {
      const deletedTask = await taskController.delete(taskStub._id);
      expect(deletedTask).toBeNull();
    });
    it('should return Not Found 404', async () => {
      jest.spyOn(spyService, 'getById').mockImplementationOnce(async () => null);
      await expect(taskController.delete(taskStub._id)).rejects.toThrow(HttpException);
    });
  });

  describe('Mark Task as done', () => {
    it('should return null', async () => {
      const finishedTask = await taskController.markAsDone(taskStub._id);
      expect(finishedTask).toBeNull();
    });
    it('should return Not Found 404', async () => {
      jest.spyOn(spyService, 'getById').mockImplementationOnce(async () => null);
      await expect(taskController.markAsDone(taskStub._id)).rejects.toThrow(HttpException);
    });
  });
});
