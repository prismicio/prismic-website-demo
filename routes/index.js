const express = require('express');
const router = express.Router();

/* GET homepage. */
router.get('/', function (req, res, next) {
  req.prismic.api.getSingle('homepage')
    .then((document) => {
      res.render('homepage', { document });
    })
    .catch((error) => {
      next(`Error when retrieving "homepage" document from Prismic. ${error.message}`);
    });
});

module.exports = router;
