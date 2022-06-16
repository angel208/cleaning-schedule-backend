import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task, TaskSchema } from './task.schema';

import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { TaskDTOStub, TaskDTOStubUpdated } from '../../test/stubs/task.stub';
import { HttpException } from '@nestjs/common';

//source https://betterprogramming.pub/testing-controllers-in-nestjs-and-mongo-with-jest-63e1b208503c
describe('CatsController Methods', () => {
  let taskController: TaskController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let taskModel: Model<Task>;

  //   DB AND CONTROLLER INIT
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    taskModel = mongoConnection.model(Task.name, TaskSchema);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        { provide: getModelToken(Task.name), useValue: taskModel },
      ],
    }).compile();
    taskController = app.get<TaskController>(TaskController);
  });

  //TESTING
  describe('Post Task', () => {
    it('should return the saved object', async () => {
      const createdTask = await taskController.createTask(TaskDTOStub());
      expect(createdTask.name).toBe(TaskDTOStub().name);
    });
    it('should return (Bad Request - 400) exception', async () => {
      //create first element in DB
      await new taskModel(TaskDTOStub()).save();
      //create duplicate
      await expect(taskController.createTask(TaskDTOStub())).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('Get All Tasks', () => {
    it('should return the objects inside the DB', async () => {
      await new taskModel(TaskDTOStub()).save();
      const fetchedTasks = await taskController.getTasks();
      expect(fetchedTasks[0].name).toBe(TaskDTOStub().name);
    });
    it('should return empty', async () => {
      expect(await taskController.getTasks()).toEqual([]);
    });
  });

  describe('Get Task By Id', () => {
    it('should return the object', async () => {
      const savedTask = await new taskModel(TaskDTOStub()).save();
      const fetchedTask = await taskController.findById(savedTask._id);
      expect(fetchedTask.name).toBe(TaskDTOStub().name);
    });
    it('should return Not Found 404', async () => {
      await expect(taskController.findById(TaskDTOStub()._id)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('Update Task', () => {
    it('should return the updated object', async () => {
      await new taskModel(TaskDTOStub()).save();
      const updatedTask = await taskController.update(
        TaskDTOStub()._id,
        TaskDTOStubUpdated(),
      );
      expect(updatedTask.name).toBe(TaskDTOStubUpdated().name);
    });
    it('should return Not Found 404', async () => {
      await expect(
        taskController.update(TaskDTOStub()._id, TaskDTOStubUpdated()),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('Delete Task', () => {
    it('should delete object', async () => {
      await new taskModel(TaskDTOStub()).save();
      await taskController.delete(TaskDTOStub()._id);
      await expect(taskController.findById(TaskDTOStub()._id)).rejects.toThrow(
        HttpException,
      );
    });
    it('should return null', async () => {
      await new taskModel(TaskDTOStub()).save();
      const deletedTask = await taskController.delete(TaskDTOStub()._id);
      expect(deletedTask).toBeNull();
    });
    it('should return Not Found 404', async () => {
      await expect(taskController.delete(TaskDTOStub()._id)).rejects.toThrow(
        HttpException,
      );
    });
  });

  //   CLEANUP
  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });
});
