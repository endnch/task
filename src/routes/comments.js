const express = require('express');
const router = express.Router();

const Comment = require('../models/Comment');
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  const page = parseInt(req.query.p) || 0;
  const query = Comment.query().page(page, 10);

  if (req.query.id) {
    query.findById(req.query.id);
    res.json(await query);
    return;
  }

  if (req.query.postId) {
    query.where('postId', req.query.postId);
    res.json(await query);
    return;
  }

  if (req.query.body) {
    query.where('body', 'like', `%${req.query.body}%`);
    res.json(await query);
    return;
  }

  res.json(await query);
});

router.post('/', async (req, res) => {
  if (!req.query.postId) {
    res.status(400).json({ status: 400 });
  }

  const post = await Post.query().findById(req.query.postId);

  if (!post) {
    res.status(400).json({ status: 400 });
  }

  const comment = await Post.relatedQuery('comments')
    .for(parseInt(req.query.postId))
    .insert(req.body);

  res.json(comment);
});

router.delete('/', async (req, res) => {
  if (!req.query.id) {
    res.status(400).json({ status: 400 });
  }

  const comment = await Comment.query().findById(req.query.id);

  if (!comment) {
    res.status(400).json({ status: 400 });
  }

  await Comment.query().deleteById(req.query.id);

  res.json({ status: 200 });
});

router.put('/', async (req, res) => {
  if (!req.query.id) {
    res.status(400).json({ status: 400 });
  }

  const comment = await Comment.query().findById(req.query.id);

  if (!comment) {
    res.status(400).json({ status: 400 });
  }

  const patchedComment = await Comment.query().patchAndFetchById(req.query.id, req.body);
  res.json(patchedComment);
});

module.exports = router;
