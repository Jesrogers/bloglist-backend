const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog'); //the Model (instance) of a Blog schema. Allows for interaction with the DB
const User = require('../models/user');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate( 'user', { username: 1, name: 1 } );
    response.json(blogs);
  }
  catch (err) {
    next(err);
  }
});
  
blogsRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id;

  try {
    const blog = await Blog.findById(id).populate('user', { username: 1, name: 1 } );
    if (blog) {
      response.json(blog.toJSON());
    } else {
      response.status(404).end();
    }
  }
  catch (err) {
    next(err);
  }
});

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.post('/', async (request, response, next) => {
 
  try {
    const body = request.body;
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
  
  
  
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog.toJSON());
  }
  catch (err) {
    next(err);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;