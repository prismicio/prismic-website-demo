const express = require('express');
const prismicJS = require('prismic-javascript');
const prismicDOM = require('prismic-dom');
const Cookies = require('cookies');

const linkResolver = require('../link-resolver');

const router = express.Router();

/* GET homepage. */
router.get('/', function (req, res, next) {
  req.prismic.api.getSingle('homepage', { fetchLinks: ['product.product_image', 'product.product_name', 'product.sub_title'] })
    .then((document) => {
      const meta = {
        title: prismicDOM.RichText.asText(document.data.meta_title),
        description: prismicDOM.RichText.asText(document.data.meta_description)
      };
      res.render('homepage', { document, meta });
    })
    .catch((error) => {
      next(`Error when retrieving "homepage" document from Prismic. ${error.message}`);
    });
});

/* In-Website Preview by Prismic. */
router.get('/preview', function (req, res) {
  req.prismic.api.previewSession(req.query.token, linkResolver, '/')
    .then((url) => {
      const cookies = new Cookies(req, res);

      cookies.set(prismicJS.previewCookie, req.query.token, { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false });
      res.redirect(302, url);
    });
});

module.exports = router;
