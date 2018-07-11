import "../scss/main.scss";

$(document).ready(function () {
  const $header = $('#header');

  $('#header-burger').on('click', function () {
    $header.toggleClass('header--is-nav-opened');
  });
});
