const express = require('express');
const prismicJS = require('prismic-javascript');

const linkResolver = require('../link-resolver');

const router = express.Router();

/* GET homepage. */
router.get('/', function (req, res, next) {
  const graphQuery = `{
    homepage {
      ...homepageFields
      body {
        ...on featured_items {
          non-repeat {
            ...non-repeatFields
          }
          repeat {
            ...repeatFields
            link_to_product {
              product_image
              product
            }
          }
        }
        ...on cta_banner {
          non-repeat {
            ...non-repeatFields
          }
          repeat {
            ...repeatFields
          }
        }
        ...on big_bullet_item {
          non-repeat {
            ...non-repeatFields
          }
          repeat {
            ...repeatFields
          }
        }
        ...on separator {
          non-repeat {
            ...non-repeatFields
          }
          repeat {
            ...repeatFields
          }
        }
        ...on text_block {
          non-repeat {
            ...non-repeatFields
          }
          repeat {
            ...repeatFields
          }
        }
      }
    }
  }`;

  req.prismic.api.getSingle('homepage', { graphQuery })
    .then((document) => {
      res.render('homepage', { document });
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
      res.render('products', { productsDocument, productDocuments });
    })
    .catch((error) => {
      next(`Error when retrieving documents from Prismic. ${error.message}`);
    });
});

/* GET product. */
router.get('/products/:uid', function (req, res, next) {
  const graphQuery = `{
    product {
      ...productFields
      related_products {
        ...related_productsFields
        product1 {
          product_image
          product
        }
      }
    }
  }`;

  req.prismic.api.getByUID('product', req.params.uid, { graphQuery })
    .then((document) => {
      if (document) {
        res.render('product', { document });
      }
      res.render('page-404');
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
      res.render('blog-home', { blogHomeDocument, blogPostDocuments });
    })
    .catch((error) => {
      next(`Error when retrieving documents from Prismic. ${error.message}`);
    });
});

/* GET blog post. */
router.get('/blog/:uid', function (req, res, next) {
  const graphQuery = `{
    blog_post {
      ...blog_postFields
      author {
        name
        bio
        picture
      }
    }
  }`;

  req.prismic.api.getByUID('blog_post', req.params.uid, { graphQuery })
    .then((document) => {
      if (document) {
        res.render('blog-post', { document });
      }
      res.render('page-404');
    })
    .catch((error) => {
      next(`Error when retrieving "blog_post" document from Prismic. ${error.message}`);
    });
});

/* GET landing page. */
router.get('/pages/:uid', function (req, res, next) {
  req.prismic.api.getByUID('landing_page', req.params.uid)
    .then((document) => {
      if (document) {
        res.render('landing-page', { document });
      }
      res.render('page-404');
    })
    .catch((error) => {
      next(`Error when retrieving "landing_page" document from Prismic. ${error.message}`);
    });
});

/* In-Website Preview by Prismic. */
router.get('/preview', function (req, res) {
  req.prismic.api.previewSession(req.query.token, linkResolver, '/')
    .then((url) => {
      res.redirect(302, url);
    });
});

router.get('*', function (req, res) {
  res.status(404).render('page-404');
});

module.exports = router;
