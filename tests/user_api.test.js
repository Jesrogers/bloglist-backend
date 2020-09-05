const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const { usersInDb } = require('./test_helper');
const bcrypt = require('bcrypt');

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      try {
        await User.deleteMany({})
  
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
      } catch (err) {
        console.log(err);
      }

    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await usersInDb();

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
    
    afterAll(() => {
        mongoose.connection.close()
      });
  });

