(function() {
  'use strict';

  var output = document.getElementById('output');
  var dropzone = document.getElementById('dropzone');
  var inputFile = document.getElementById('inputFile');
  var mimeTable = {
    'ttf': 'application/x-font-ttf',
    'otf': 'application/x-font-opentype',
    'woff': 'application/font-woff',
    'woff2': 'application/font-woff2',
    'eot': 'application/vnd.ms-fontobject',
    'sfnt': 'application/font-sfnt',
  };

  function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function getFiles(e) {
    e.stopPropagation();
    e.preventDefault();
    // get files wherter is dragdropped or not
    var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    var output = document.getElementById('output');
    var maxFileSize = 1024 * 1024 * 5; // 5MB

    // if more than 9 files then show a message
    if (files.length > 10) {
      if (!confirm('You try to encode ' + files.length + ' files. This process can take some time! Continue?')) {
        return;
      }
    }

    // ask to delete old files
    if (output.innerHTML !== '' && confirm('Delete old files?')) {
      output.innerHTML = '';
    }

    // iterate by files
    for (var i = 0,file; file = files[i]; i++) {
      var html = '';
      // only read if fileSize isn't do large
      if (file.size <= maxFileSize) {
        var reader = new FileReader();
        // onload write html
        reader.onload = (function(file) {
          return function onLoad(e) {
            var url = e.target.result;
            var type = file.type;
            var name = file.name;
            var ext = name.substr(name.lastIndexOf('.') + 1, name.length);
            if (!type) {
              type = mimeTable[ext] || 'application/octet-stream';
              url = url.replace('data:;base64,', 'data:' + type + ';base64,');
            }

            html = '<ul><li><h2>' + name + '</h2> (' + getBytes(file.size) + ')</li>';
            // thumbnails only for Chrome
            if(type.match('application/pdf')) {
              html += '<li><embed width="100%" height="100%" name="plugin" src="' + url + '" type="' + type + '"></li>';
            }
            if(type.match('audio/*')) {
              html += '<li><video controls name="media" src="' + url + '"></video></li>';
            }
            if(type.match('image/*')) {
              html += '<li><img src="' + url + '" alt="' + file.fileName + '"></li>';
            }
            html  += '<li><textarea>' + url + '</textarea></li></ul>';
            output.innerHTML += html;
          }
        })(file);
        // read as URL
        reader.readAsDataURL(file);
      } else {
        html = '<ul><li><h2>' + file.name + '</h2> (' + getBytes(file.size) + ')</li>';
        html += '<li>Filesize is to large!</li></ul>';
        output.innerHTML += html;
      }
    }
  }

  function getBytes(size) {
    var i, unit, size=size||0;
    for(i = 0; size>1024; i++) size = size/1024;

    switch(i) {
      case 0:
        unit = 'B';
        break;
      case 1:
        unit = 'KB';
        break;
      case 2:
        unit = 'MB';
        break;
      case 3:
        unit = 'GB';
        break;
      default:
        return size + 'B';
    }
    return size.toFixed(1) + ' ' + unit;
  }

  function dropClick(e) {
    e.preventDefault();
    alert('Drop files into the drop zone or pick a directories by clicking the button below.');
  }

  dropzone.addEventListener('dragover', onDragOver, false);
  dropzone.addEventListener('drop', getFiles, false);
  dropzone.addEventListener('click', dropClick, false);
  inputFile.addEventListener('change', getFiles, false);
})();
