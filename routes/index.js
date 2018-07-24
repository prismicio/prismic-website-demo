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

/* GET blog home. */
router.get('/blog', function (req, res, next) {
  const queryBlogHomeDocument = req.prismic.api.getSingle('blog_home');
  const queryBlogPostDocuments = req.prismic.api.query(prismicJS.Predicates.at('document.type', 'blog_post'), { pageSize: 10 });

  Promise.all([queryBlogHomeDocument, queryBlogPostDocuments])
    .then((values) => {
      const blogHomeDocument = values[0];
      const blogPostDocuments = values[1].results;
      const meta = {
        title: prismicDOM.RichText.asText(blogHomeDocument.data.meta_title),
        description: prismicDOM.RichText.asText(blogHomeDocument.data.meta_description)
      };

      res.render('blog-home', { blogHomeDocument, blogPostDocuments, meta });
    })
    .catch((error) => {
      next(`Error when retrieving documents from Prismic. ${error.message}`);
    });
});

/* GET blog post. */
router.get('/blog/:uid', function (req, res, next) {
  req.prismic.api.getByUID('blog_post', req.params.uid, { fetchLinks: ['author.name', 'author.bio', 'author.picture'] })
    .then((document) => {
      const meta = {
        title: prismicDOM.RichText.asText(document.data.meta_title),
        description: prismicDOM.RichText.asText(document.data.meta_description)
      };

      res.render('blog-post', { document, meta });
    })
    .catch((error) => {
      next(`Error when retrieving "blog_post" document from Prismic. ${error.message}`);
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
