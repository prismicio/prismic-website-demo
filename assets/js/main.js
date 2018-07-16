import "../scss/main.scss";

import $ from 'jquery';

$(document).ready(function () {
  const $header = $('#header');

  $('#header-burger').on('click', function () {
    $header.toggleClass('header--is-nav-opened');
  });
});
