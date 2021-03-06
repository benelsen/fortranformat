module.exports = function(line, format) {

  var match, times, expanded, i;

  // Expand groups: A2,3(1X,I2) => A2,1X,I2,1X,I2,1X,I2
  while ( ( match = /(\d+)\((.*?)\)/.exec(format) ) !== null ) {

    times = parseInt(match[1], 10);

    expanded = '';

    for (i = 0; i < times; i++) {
      expanded += match[2];
      if ( i !== times - 1 ) {
        expanded += ',';
      }
    }

    format = format.replace(match[0], expanded);

    if ( format.slice(-1) === ',' ) {
      format = format.slice(0, -1);
    }

  }

  // Expand repetitions: 3F6.4 => F6.4,F6.4,F6.4
  while ( ( match = /(\d+)([ADEFIX]{1}[\d\.]*)/.exec(format) ) !== null ) {

    times = parseInt(match[1], 10);

    expanded = '';

    for (i = 0; i < times; i++) {
      expanded += match[2];
      if ( i !== times - 1 ) {
        expanded += ',';
      }
    }

    format = format.replace(match[0], expanded);

    if ( format.slice(-1) === ',' ) {
      format = format.slice(0, -1);
    }

  }

  var elements = format.split(',');

  var startIndex = 0;

  var result = elements.reduce( function(m, e) {

    var match = /(\d+)?([ADEFIX]{1})((\d+){1}[.\d]*)?/.exec(e);

    var repetitions = parseInt(match[1], 10) || 1,
        type = match[2],
        width = parseInt(match[4], 10) || 1;

    var sliced = line.slice(startIndex, startIndex+width);

    startIndex += width;

    var foo = null;

    switch ( type ) {

      case 'A':
        foo = sliced;
        break;

      case 'D':
      case 'E':
      case 'F':

        if ( sliced.trim().length !== 0 ) {
          foo = parseFloat( sliced.replace(/[DF]/i, 'e') );
        }
        break;

      case 'I':

        if ( sliced.trim().length !== 0 ) {
          foo = parseInt( sliced, 10 );
        }
        break;

      case 'X':
        return m;
        break;

    }

    m.push(foo);

    return m;

  }, []);

  return result;

};
