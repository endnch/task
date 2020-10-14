const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');

router.get('/', async (req, res) => {
  const query = Post.query();

  if (req.query.id) {
    query.findById(req.query.id);
    res.json(await query);
    return;
  }

  if (req.query.userId) {
    query.where('userId', req.query.userId);
    res.json(await query);
    return;
  }

  if (req.query.about) {
    query.where('about', 'like', `%${req.query.about}%`);
    res.json(await query);
    return;
  }

  res.json(await query);
});

router.post('/', async (req, res) => {
  if (!req.query.userId) {
    res.status(400).json({ status: 400 });
  }

  const user = await User.query().findById(req.query.userId);

  if (!user) {
    res.status(400).json({ status: 400 });
  }

  const post = await User.relatedQuery('posts')
    .for(parseInt(req.query.userId))
    .insert(req.body);

  res.json(post);
});

router.delete('/', async (req, res) => {
  if (!req.query.id) {
    res.status(400).json({ status: 400 });
  }

  const post = await Post.query().findById(req.query.id);

  if (!post) {
    res.status(400).json({ status: 400 });
  }

  await Post.query().deleteById(req.query.id);

  res.json({ status: 200 });
});

router.put('/', async (req, res) => {
  if (!req.query.id) {
    res.status(400).json({ status: 400 });
  }

  const post = await Post.query().findById(req.query.id);

  if (!post) {
    res.status(400).json({ status: 400 });
  }

  const patchedPost = await Post.query().patchAndFetchById(req.query.id, req.body);
  res.json(patchedPost);
});

module.exports = router;
