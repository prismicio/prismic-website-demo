const express = require('express');
const router = express.Router();

/* GET homepage. */
router.get('/', (req, res, next) => {
  res.render('homepage', { title: 'Prismic Website Demo' });
});

module.exports = router;
