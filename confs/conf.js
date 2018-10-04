const env = require('node-env-file');
var PrettyReporter = require('protractor-pretty-html-reporter').Reporter;
var path = require('path');


env('.env');

var prettyReporter = new PrettyReporter({
    // required, there is no default
    path: path.join(__dirname, 'results'),
    screenshotOnPassed: true
});

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',

    capabilities: {
        browserName: 'chrome',
        shardTestFiles: true,
        chromeOptions: {
            prefs: {
                'profile.managed_default_content_settings.notifications': 1
            }
        },
        maxInstances: 2
    },
    specs: [
        '../tests/badAuthentication.js',
        '../tests/happyPath.js'
    ],

    // Set the Url where browser will start.
    baseUrl: process.env.URL,

    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        isVerbose: true,
        realtimeFailure: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 1200000
    },

    onPrepare: function () {
        jasmine.getEnv().addReporter(prettyReporter);
        browser.ignoreSynchronization = true
        setTimeout(function () {
            browser.driver.executeScript(function () {
                return {
                    width: window.screen.availWidth,
                    height: window.screen.availHeight
                }
            }).then(function (result) {
                browser.driver.manage().window().setSize(result.width, result.height)
            })
        })
    },

    /* if using isSharded option see below */
    beforeLaunch() {
        prettyReporter.startReporter();
    }


}
