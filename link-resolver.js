const linkResolver = function (doc) {
  if (doc.type === 'homepage') {
    return '/';
  }
  if (doc.type === 'product') {
    return '/product/' + doc.uid;
  }
  return '/';
};

module.exports = linkResolver;
