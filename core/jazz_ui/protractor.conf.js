// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
const JasmineConsoleReporter = require('jasmine-console-reporter');
var JSONReporter = require('jasmine-json-test-reporter');
const reporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 1,       // (0|false)|(1|true)|2|3
    verbosity: 4,        // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    activity: false,     // boolean or string ("dots"|"star"|"flip"|"bouncingBar"|...)
    emoji: true,
    beep: true
});

exports.config = {
  allScriptsTimeout: 11000000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      // Get rid of --ignore-certificate yellow warning
      args: ['--headless', '--disable-gpu', '--no-sandbox', '--test-type=browser', '--disable-dev-shm-usage'],
      // Set download path and avoid prompting for download even though     --disable-dev-shm-usage
      // this is already the default on Chrome but for completeness
      prefs: {
          'download': {
              'prompt_for_download': false,
              'directory_upgrade': true,
              'default_directory': process.cwd()+ '/e2e/downloads/'
          }
      }
    }
  },

  directConnect: false,
  baseUrl: 'http://localhost:4200/',
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 6000000,
    print: function() {}
  },
 

  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({savePath: 'target/screenshots'}));
    jasmine.getEnv().addReporter(new JSONReporter({
      file: 'jasmine-test-results.json',
      beautify: true,
      indentationLevel: 4 
    }));
    browser.manage().timeouts().implicitlyWait(600000);
    browser.manage().window().setSize(1600, 1000);
    browser.manage().window().maximize();
    browser.waitForAngularEnabled(false);
    browser.ignoreSynchronization = true;
  }
      
};
