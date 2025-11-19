const serverFilter = require('./server/contentFilter.js');

const tests = ['f@ck', 'sh!t', 'b!tch', 'n!gger'];
tests.forEach(t => console.log(t, '->', serverFilter.censorText(t)));
