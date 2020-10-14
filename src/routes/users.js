const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/', async (req, res) => {
  const query = User.query();

  if (req.query.id) {
    query.findById(req.query.id);
    res.json(await query);
    return;
  }

  if (req.query.name) {
    query.modify('searchByName', req.query.name);
    res.json(await query);
    return;
  }

  res.json(await query);
});

router.post('/', async (req, res) => {
  const user = await User.query().insert(req.body);
  res.json(user);
});

router.delete('/', async (req, res) => {
  if (!req.query.id) {
    res.status(400).json({ status: 400 });
  }

  const user = await User.query().findById(req.query.id);

  if (!user) {
    res.status(400).json({ status: 400 });
  }

  await User.query().deleteById(req.query.id);

  res.json({ status: 200 });
});

router.put('/', async (req, res) => {
  if (!req.query.id) {
    res.status(400).json({ status: 400 });
  }

  const user = await User.query().findById(req.query.id);

  if (!user) {
    res.status(400).json({ status: 400 });
  }

  const patchedUser = await User.query().patchAndFetchById(req.query.id, req.body);
  res.json(patchedUser);
});

module.exports = router;
