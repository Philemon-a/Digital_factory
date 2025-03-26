const request = require('supertest'); // Make sure supertest is installed
const express = require('express');
const session = require('express-session');
const userController = require('../controllers/userController');
const User = require('../models/user.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/user.models');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: false
}));
app.post('/signup', userController.signUp);
app.post('/signin', userController.signIn);
app.post('/signout', userController.signOut);

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockResolvedValue({ _id: 'mockUserId' });
      jwt.sign.mockReturnValue('mockToken');

      const response = await request(app)
        .post('/signup')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(User.findOne).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('should return error if user already exists', async () => {
      User.findOne.mockResolvedValue({ username: 'testuser' });

      const response = await request(app)
        .post('/signup')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('signIn', () => {
    it('should log in a user successfully', async () => {
      const mockUser = { email: 'test@example.com', password: 'hashedPassword', _id: 'userId', save: jest.fn() };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      const response = await request(app)
        .post('/signin')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged in successfully');
    });

    it('should return error for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/signin')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should sign out a user successfully by destroying session', async () => {
      const agent = request.agent(app); // Create session-aware request
      const response = await agent.post('/signout');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User signed out successfully');
    });
  });
});
