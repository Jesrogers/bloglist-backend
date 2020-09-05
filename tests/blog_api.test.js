const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const { blogsInDb } = require('./test_helper');
const blogData = require('./dummyData/blogData_DB');

beforeEach(async () => {
    await Blog.deleteMany({});

    for (let blog of blogData) {
      let blogObject = new Blog(blog)
      await blogObject.save();
    }

    // const blogObjects = blogData.map(blog => new Blog(blog));
    // const blogPromises = blogObjects.map(blogObject => blogObject.save());
    // await Promise.all(blogPromises);
  })

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}); 

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs');
  
    expect(response.body).toHaveLength(blogData.length);
  });
  
  test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs');
    const contents = response.body.map(blog => blog.author)
  
    expect(contents).toContain('Fred');
  });

test('adding a new blog entry increases length of notes returned, and verifies it exists', async () => {
  const newBlog = {
    title: 'This is a test blog entry',
    author: 'Jesse',
    url: 'test.com',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const updatedBlogs = await api.get('/api/blogs');

    const titles = updatedBlogs.body.map(blog => blog.title);

    expect(updatedBlogs.length === blogData.length + 1);
    expect(titles).toContain('This is a test blog entry');
});

test('adding a blog without a title will throw an error', async () => {
  const newBlog = {
    author: 'Jesse',
    url: 'test.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogs = await blogsInDb();

  expect(blogs).toHaveLength(2);
  
});

test('adding a blog without likes will have it default to 0', async () => {
  const newBlog = {
    title: 'Test title',
    author: 'Jesse',
    url: 'test.com'
  };

  const response = await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0);

});

afterAll(() => {
  mongoose.connection.close()
});