const linkResolver = function (doc) {
  if (doc.type === 'homepage') {
    return '/';
  }
  if (doc.type === 'products') {
    return '/products';
  }
  if (doc.type === 'product') {
    return '/products/' + doc.uid;
  }
  return '/';
};

module.exports = linkResolver;
