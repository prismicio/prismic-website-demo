const express = require('express');
const prismicJS = require('prismic-javascript');
const prismicDOM = require('prismic-dom');
const Cookies = require('cookies');

const linkResolver = require('../link-resolver');

const router = express.Router();
const productFetchLinks = [
  'product.product_image',
  'product.product_name',
  'product.sub_title'
];

/* GET homepage. */
router.get('/', function (req, res, next) {
  req.prismic.api.getSingle('homepage', { fetchLinks: productFetchLinks })
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

/* GET products. */
router.get('/products', function (req, res, next) {
  const queryProductsDocument = req.prismic.api.getSingle('products');
  const queryProductDocuments = req.prismic.api.query(prismicJS.Predicates.at('document.type', 'product'), { pageSize: 24 });

  Promise.all([queryProductsDocument, queryProductDocuments])
    .then((values) => {
      const productsDocument = values[0];
      const productDocuments = values[1].results;
      const meta = {
        title: prismicDOM.RichText.asText(productsDocument.data.meta_title),
        description: prismicDOM.RichText.asText(productsDocument.data.meta_description)
      };

      res.render('products', { productsDocument, productDocuments, meta });
    })
    .catch((error) => {
      next(`Error when retrieving documents from Prismic. ${error.message}`);
    });
});

/* GET product. */
router.get('/products/:uid', function (req, res, next) {
  req.prismic.api.getByUID('product', req.params.uid, { fetchLinks: productFetchLinks })
    .then((document) => {
      const meta = {
        title: prismicDOM.RichText.asText(document.data.meta_title),
        description: prismicDOM.RichText.asText(document.data.meta_description)
      };

      res.render('product', { document, meta });
    })
    .catch((error) => {
      next(`Error when retrieving "product" document from Prismic. ${error.message}`);
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
