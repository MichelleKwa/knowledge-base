
'use strict';

// Modules
var fs                             = require('fs');
var build_nested_pages             = require('../functions/build_nested_pages.js');
var get_filepath                   = require('../functions/get_filepath.js');
var get_last_modified              = require('../functions/get_last_modified.js');
var remove_image_content_directory = require('../functions/remove_image_content_directory.js');

function route_home (config, raneto) {
  return function (req, res, next) {

    // Generate Filepath
    var filepath = get_filepath({
      content  : raneto.config.content_dir,
      filename : 'index'
    });

    // Do we have an index.md file?
    // If so, use that.
    if (fs.existsSync(filepath + '.md')) {
      return next();
    }

    // Otherwise, we're generating the home page listing
    var suffix = 'edit';
    if (filepath.indexOf(suffix, filepath.length - suffix.length) !== -1) {
      filepath = filepath.slice(0, - suffix.length - 1);
    }

    var template_filepath = get_filepath({
      content  : [config.theme_dir, config.theme_name, 'templates'].join('/'),
      filename : 'home.html'
    });

    var pageList = remove_image_content_directory(config, raneto.getPages('/index'));

    return res.render('home', {
      config        : config,
      pages         : build_nested_pages(pageList),
      body_class    : 'page__home',
      meta          : config.home_meta,
      last_modified : get_last_modified(config,config.home_meta,template_filepath),
      lang          : config.lang,
      loggedIn      : false,
      username      : null
    });

  };
}

// Exports
module.exports = route_home;
