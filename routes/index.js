const express = require('express');
const router = express.Router();

/* GET homepage. */
router.get('/', function (req, res, next) {
  req.prismic.api.getSingle('homepage', { fetchLinks: ['product.product_image', 'product.product_name', 'product.sub_title'] })
    .then((document) => {
      res.render('homepage', { document });
    })
    .catch((error) => {
      next(`Error when retrieving "homepage" document from Prismic. ${error.message}`);
    });
});

module.exports = router;
