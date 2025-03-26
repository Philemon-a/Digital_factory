const taskController = require('../controllers/taskController');
const httpMocks = require('node-mocks-http');
const Task = require('../models/task.models');

jest.mock('../models/task.models');

describe('Task Controller', () => {
	let req, res;

	beforeEach(() => {
		req = httpMocks.createRequest();
		res = httpMocks.createResponse();
		res.locals = { userId: 'mockUserId' };
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getUserTasks', () => {
		it('should return user tasks', async () => {
			const mockTasks = [{ title: 'Task 1' }, { title: 'Task 2' }];
			Task.find.mockResolvedValue(mockTasks);

			await taskController.getUserTasks(req, res);

			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual(mockTasks);
			expect(Task.find).toHaveBeenCalledWith({ user: 'mockUserId' });
		});
	});

	describe('createTasks', () => {
		it('should create and return new task', async () => {
            const newTask = {
                _id: 'task123',
                title: 'Updated Task',
                user: 'mockUserId',
                save: jest.fn().mockResolvedValue(),
            };
        
            req.body = { task: 'Updated Task' };
            res.locals.userId = 'mockUserId';
        
            // Mock Task constructor and save
            Task.mockImplementation(() => newTask);
        
            await taskController.createTasks(req, res);
        
            expect(res.statusCode).toBe(201);
            expect(JSON.parse(res._getData())).toEqual({
                _id: 'task123',
                title: 'Updated Task',
                user: 'mockUserId',
            });
        });
	});

	describe('updateTasks', () => {
		it('should update a task successfully', async () => {
			req.params.id = 'task123';
			req.body = { title: 'Updated Task' };
			const mockTask = { _id: 'task123', user: 'mockUserId', title: 'Old Title', save: jest.fn().mockResolvedValue(true) };
			Task.findOne.mockResolvedValue(mockTask);

			await taskController.updateTasks(req, res);

			expect(Task.findOne).toHaveBeenCalledWith({ _id: 'task123', user: 'mockUserId' });
			expect(mockTask.title).toBe('Updated Task');
			expect(mockTask.save).toHaveBeenCalled();
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual({
                _id: 'task123',
                title: 'Updated Task',
                user: 'mockUserId'
              });
		});

		it('should return 404 if task not found', async () => {
			req.params.id = 'invalid';
			Task.findOne.mockResolvedValue(null);

			await taskController.updateTasks(req, res, () => {});

			expect(res.statusCode).toBe(404);
			expect(res._getJSONData()).toEqual({ message: 'Task not found' });
		});
	});

	describe('deleteTasks', () => {
		it('should delete a task successfully', async () => {
			req.params.id = 'task123';
			Task.findOneAndDelete.mockResolvedValue({ _id: 'task123', user: 'mockUserId' });

			await taskController.deleteTasks(req, res, () => {});

			expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: 'task123', user: 'mockUserId' });
			expect(res.statusCode).toBe(200);
			expect(res._getJSONData()).toEqual({ message: 'Task deleted successfully' });
		});

		it('should return 404 if task not found for deletion', async () => {
			req.params.id = 'notfound';
			Task.findOneAndDelete.mockResolvedValue(null);

			await taskController.deleteTasks(req, res, () => {});

			expect(res.statusCode).toBe(404);
			expect(res._getJSONData()).toEqual({ message: 'Task not found' });
		});
	});
});
