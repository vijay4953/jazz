/*
 *Copyright 2016-2017 T Mobile, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); You may not use
 * this file except in compliance with the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or
 * implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { browser, element, by, protractor, $ } from 'protractor';
import { Jazz } from '../page-objects/jazzservices.po';
import { CONFIGURATIONS } from '../../src/config/configuration';
import { Timeouts, Browser } from 'selenium-webdriver';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG, SSL_OP_TLS_BLOCK_PADDING_BUG } from 'constants';
import { Common } from '../common/commontest';

const twok = 2000;
const fivek = 5000;
const tenk = 10000;
const fifteenk = 15000;
const twentyk = 20000;
const thirtyk = 30000;
const sixtyk = 60000;

const timeOutHigh = 180000;
const emailId = CONFIGURATIONS.optional.general.e2e.EMAIL_ID;
const config = CONFIGURATIONS.optional.general.e2e;

describe('Overview', () => {
  let jazzServices_po: Jazz;
  let commonUtils: Common;
  let flag = 1;
  let found = 1;
  const EC = protractor.ExpectedConditions;
  let winhandle;
  let servicename;

  beforeAll(() => {
    jazzServices_po = new Jazz();
    commonUtils = new Common();
  });
  beforeEach(() => {
    if(flag == 0){
      pending();
    }
    if(found == 0)
         {
          commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), tenk);
          jazzServices_po.getServiceHomePage().click();
         }
  } ); 
  afterAll(() => {
    jazzServices_po = new Jazz();
    commonUtils = new Common();
    browser.driver.sleep(fivek);
    jazzServices_po.logoutIcon().click();
    jazzServices_po.logout().click();
  });
  

  function createservice(servicename) {
    jazzServices_po.getServiceName().sendKeys(servicename);
    jazzServices_po.getNameSpace().sendKeys('jazztest');
    jazzServices_po.getServiceDescription().sendKeys('Testing');
  }

  function serviceapprover() {
    browser.driver.sleep(fivek);
    jazzServices_po.getSubmit().click();
    commonUtils.fluentwaittry(jazzServices_po.getDone(), tenk);
    jazzServices_po.getDone().click();
    commonUtils.waitForSpinnerLogin();
  }

  it('Create API Service', function () {
      browser.driver.sleep(fivek);
      browser.wait(EC.visibilityOf(jazzServices_po.getCreateService()), timeOutHigh);
      browser.wait(EC.elementToBeClickable(jazzServices_po.getCreateService()), timeOutHigh);
      //To create Service-API
      jazzServices_po.getCreateService().click();
      var min = 111111111;
      var max = 999999999;
      var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      servicename = 'servicename' + randomNum;
      createservice(servicename);
      serviceapprover();
      browser.driver.sleep(fifteenk);
      //Assert-Verifying the created service,Type and Status of the API
      expect(jazzServices_po.getService(servicename).getText()).toEqual(servicename);
      commonUtils.fluentwaittry(jazzServices_po.getAPIType(servicename), tenk);
      expect(jazzServices_po.getAPIType(servicename).getText()).toEqual('api');
      expect(jazzServices_po.getAPIStatus(servicename).getText()).toEqual('creation started');
      browser.wait(function () {
        browser.sleep(sixtyk);
        return jazzServices_po.serviceStatus(servicename).isDisplayed()
          .then(
            function (text) {
              flag=1;
              return text;
            },
            function (error) {
              browser.refresh();
              flag=0;
              return false;
            });
        }, 240 * 1000);
        
       jazzServices_po.serviceStatus(servicename).getText().then(function(value){
        if ( value === 'active'){
          flag = 0;
          expect(jazzServices_po.serviceStatus(servicename).getText()).toEqual('creation started');
        }
       });
       
  });

  it('Verify API Service and Navigation', () => {
      browser.driver.sleep(twok);
      commonUtils.fluentwaittry(jazzServices_po.getService(servicename), fivek);
      browser.wait(EC.elementToBeClickable(jazzServices_po.getService(servicename)), timeOutHigh);
      //To Navigate to the particular service and verifying the Page
      jazzServices_po.getService(servicename).click();
      commonUtils.fluentwaittry(jazzServices_po.getOverviewStatus(), fivek);
      expect(jazzServices_po.getOverviewStatus().getText()).toEqual('OVERVIEW');
      commonUtils.fluentwaittry(jazzServices_po.getServiceNameHeader(), fivek);
      browser.wait(EC.visibilityOf(jazzServices_po.getServiceNameHeader()), timeOutHigh);
      //To get the corresponding environment[Prod]
      commonUtils.elementPresent(jazzServices_po.getProdName(), fivek);
      jazzServices_po.getProdName().click();
      commonUtils.waitForSpinnerDisappear();
      commonUtils.elementPresent(jazzServices_po.getDeploymentStatus(), fivek);
      commonUtils.elementPresent(jazzServices_po.getProdHeader(), fivek);
      //Verifying the browser id at the Deployment Tab
      expect(jazzServices_po.getDeploymentStatus().getText()).toEqual('DEPLOYMENTS');
      browser.driver.switchTo().activeElement();
  });

  it('Verify METRICS Navigation for API', () => {
    browser.sleep(twok);
    jazzServices_po.getTestAPI().click().then(null, function(err){
      console.log("the error occurred is : "+ err.name);
      expect(jazzServices_po.getTestAPI().getText()).toEqual('Failed Test API');
      browser.sleep(fivek);
    }); 
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.driver.sleep(tenk);
        commonUtils.fluentwaittry(jazzServices_po.getAPIGET(), fifteenk);
        jazzServices_po.getAPIGET().click().then(null,function(err){
          console.log("Swagger Page is Failed to upload : "+ err.name);
        });    
        browser.sleep(twok);
        jazzServices_po.getTryOut().click().then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getStringA().sendKeys('Testing').then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getStringB().sendKeys('Jazz').then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getExecute().click().then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getAPIGET().click().then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getAPIPOST().click().then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getTryOut().click().then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getExecute().click().then(null, function(err){
          console.log(err.name);
          if (jazzServices_po.SwaggerFailed()){
            expect(jazzServices_po.SwaggerFailed().getText()).toEqual('Failed test');
          }else if (jazzServices_po.getAPIGET()){
            expect(jazzServices_po.getAPIGET().getText()).toEqual('GETT');
          }else {
            browser.sleep(twentyk);
            browser.close();
          }
        });
        browser.sleep(fivek);
        browser.close();

    });
      browser.switchTo().window(handles[0]).then(function () {
        browser.sleep(fivek);
        commonUtils.elementPresent(jazzServices_po.getMetrices(), fivek);
        jazzServices_po.getMetrices().click();
       commonUtils.waitForMetricsSpinner();
      });
    });
});

  it('Verify API Deployments', () => {
      commonUtils.verifyDelpoyment();
  });

  it('Verify API Asset', () => {
      commonUtils.verifyAsset();

  });

  it('Verify API Logs', () => {
      commonUtils.verifyLogs();

  });

  it('Verify METRICS COUNT for API', () => {
      browser.driver.sleep(twok);
      commonUtils.fluentwaittry(jazzServices_po.getMetrices(), tenk);
      jazzServices_po.getMetrices().click();
      commonUtils.waitForMetricsSpinner();
      commonUtils.refreshbutton(jazzServices_po.getMetricesCount(), thirtyk);
      // if(value == true){
      //   found = 1;
      // }
      // else{
      //   found = 0;
      //}
      // jazzServices_po.getMetricesCount().isDisplayed().then(null, function(err){
      //     browser.sleep(twentyk);
      //     commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), fivek);
      //     jazzServices_po.getServiceHomePage().click();
      //     throw new Error("Failed Metrics Count");
      //   });

      expect(jazzServices_po.getMetricesCount().getText()).toEqual('1');
      browser.driver.switchTo().activeElement();
      browser.refresh();
      browser.sleep(twok);
      commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), fivek);
      jazzServices_po.getServiceHomePage().click();
  });

  it('Identifying Environment and Navigation for API', () => {
      browser.driver.sleep(twok);
      commonUtils.fluentwaittry(jazzServices_po.getService(servicename), fivek);
      browser.wait(EC.elementToBeClickable(jazzServices_po.getService(servicename)), timeOutHigh);
      //To Navigate to the particular service and verifying the Page
      jazzServices_po.getService(servicename).click();
      expect(jazzServices_po.getRepo().getText()).toEqual('Repository');
      browser.wait(EC.visibilityOf(jazzServices_po.getRepository()), timeOutHigh);
      jazzServices_po.getRepository().click();
      browser.sleep(fivek);

  });

  it('Create the Test Branch for API', () => {
      browser.getAllWindowHandles().then(function (handles) {
        browser.sleep(twok);
        var min = 11;
        var max = 99;
        var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        var test = 'TEST' + randomNum;
        browser.switchTo().window(handles[1]).then(function () {
          browser.sleep(twok);
          
          var some_name = browser.getTitle().then(function (webpagetitle) {
            if (webpagetitle === 'Sign in · GitLab') {
              expect(webpagetitle).toEqual('Sign in · GitLab');
              jazzServices_po.gitUsername().sendKeys(config.SCM_USERNAME).then(null, function(err){
                console.log(err.name); 
              });
              jazzServices_po.gitPassword().sendKeys(config.SCM_PASSWORD).then(null, function(err){
                console.log(err.name); 
              });
              jazzServices_po.gitLogin().click().then(null, function(err){
                console.log(err.name); 
              });
              jazzServices_po.drpGitBranchType().click().then(null, function(err){
                console.log(err.name); 
              });
              jazzServices_po.selectGitBranchType().click().then(null, function(err){
                console.log(err.name); 
              });
              jazzServices_po.gitBranchName().sendKeys(test).then(null, function(err){
                console.log(err.name); 
              });
              jazzServices_po.btnGitCreateBranch().click().then(null, function(err){
                console.log(err.name); 
              });
              jazzServices_po.getGitLogoutIcon().click().then(null, function(err){
                console.log(err.name); 
              });
              jazzServices_po.getGitLogout().click().then(null, function(err){
                console.log(err.name); 
                browser.sleep(twentyk);
                browser.close();
              });
              //jazzServices_po.getGitLogout().click();
              browser.close();
            }
            else {
              expect(webpagetitle).not.toEqual('Sign in · GitLab');
              jazzServices_po.bitUsername().sendKeys(config.SCM_USERNAME);
              jazzServices_po.bitPassword().sendKeys(config.SCM_PASSWORD);
              jazzServices_po.bitLogin().click();
              browser.wait(EC.visibilityOf(jazzServices_po.createBranch()), timeOutHigh);
              jazzServices_po.createBranch().click();
              jazzServices_po.drp_BranchType().click();
              jazzServices_po.select_BranchType().click();
              browser.sleep(twok);
              jazzServices_po.branchName().sendKeys(test);
              browser.wait(EC.elementToBeClickable(jazzServices_po.btn_CreateBranch()), timeOutHigh);
              jazzServices_po.btn_CreateBranch().click();
              browser.sleep(tenk);
              browser.navigate().refresh();
              browser.sleep(twok);
              jazzServices_po.getBitLogoutIcon().click();
              jazzServices_po.getBitLogout().click();
              browser.close();
            }
          });
        });
        browser.switchTo().window(handles[0]).then(function () {
          browser.sleep(twok);
          commonUtils.waitforservice(jazzServices_po.activeTestBranch(), fifteenk);
          jazzServices_po.activeTestBranch().click().
            then(null, function (err) {
            console.log("the error occurred is : " + err.name);
            });
          commonUtils.waitForSpinnerDisappear();
          browser.sleep(fivek);
        });
      });
  });

  it('Verify METRICS Navigation for API Test Branch', () => {
      commonUtils.fluentwaittry(jazzServices_po.getTestAPI(), fifteenk);
      expect(jazzServices_po.getTestAPI().getText()).toEqual('TEST API');
      browser.wait(EC.elementToBeClickable(jazzServices_po.getTestAPI()), timeOutHigh);
      jazzServices_po.getTestAPI().click();
      browser.getAllWindowHandles().then(function (handles) {
        browser.switchTo().window(handles[1]).then(function () {
          browser.driver.sleep(tenk);
        commonUtils.fluentwaittry(jazzServices_po.getAPIGET(), fifteenk);
        jazzServices_po.getAPIGET().click().then(null,function(err){
          console.log("Swagger Page is Failed to upload : "+ err.name);
        });    
        browser.sleep(twok);
        jazzServices_po.getTryOut().click().then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getStringA().sendKeys('Testing').then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getStringB().sendKeys('Jazz').then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getExecute().click().then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getAPIGET().click().then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getAPIPOST().click().then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getTryOut().click().then(null, function(err){
          console.log(err.name);
        });
        browser.sleep(twok);
        jazzServices_po.getExecute().click().then(null, function(err){
          console.log(err.name);
          if (jazzServices_po.SwaggerFailed()){
            expect(jazzServices_po.SwaggerFailed().getText()).toEqual('Failed test');
          }else if (jazzServices_po.getAPIGET()){
            expect(jazzServices_po.getAPIGET().getText()).toEqual('GETT');
          }else {
            browser.sleep(twentyk);
            browser.close();
          }
        });
          browser.sleep(fivek);
          browser.close();
      });
        browser.switchTo().window(handles[0]).then(function () {
          browser.sleep(twok);
          commonUtils.refreshbutton(jazzServices_po.getMetrices(), fivek);
          jazzServices_po.getMetrices().click();
          commonUtils.waitForMetricsSpinner();
          commonUtils.refreshbutton(jazzServices_po.getXXError(), tenk);
          jazzServices_po.getXXError().click();
          commonUtils.refreshbutton(jazzServices_po.getXXErrorFive(), tenk);
          jazzServices_po.getXXErrorFive().click();
          browser.wait(EC.visibilityOf(jazzServices_po.getCacheHitCount()), timeOutHigh);
          jazzServices_po.getCacheHitCount().click();
          browser.wait(EC.visibilityOf(jazzServices_po.getCacheMissCount()), timeOutHigh);
          jazzServices_po.getCacheMissCount().click();
          browser.wait(EC.visibilityOf(jazzServices_po.getCount()), timeOutHigh);
          jazzServices_po.getCount().click();
          browser.wait(EC.visibilityOf(jazzServices_po.getIntegrationLatency()), timeOutHigh);
          jazzServices_po.getIntegrationLatency().click();
          browser.wait(EC.visibilityOf(jazzServices_po.getLatency()), timeOutHigh);
          jazzServices_po.getLatency().click();
        });
      });
  });
  it('Verify API Deployments for Test Branch', () => {
      commonUtils.verifyDelpoyment();
  });

  it('Verify API Asset for Test Branch', () => {
      commonUtils.verifyAsset();
  });

  it('Verify API Logs for Test Branch', () => {
      commonUtils.verifyLogs();
  });

  it('Verify METRICS COUNT for API for Test Branch', () => {
    browser.driver.sleep(twok);
    commonUtils.fluentwaittry(jazzServices_po.getMetrices(), fifteenk);
    jazzServices_po.getMetrices().click();
    commonUtils.waitForMetricsSpinner();
    commonUtils.refreshbutton(jazzServices_po.getMetricesCount(), thirtyk);
    // jazzServices_po.getMetricesCount().isDisplayed().then(null, function(err){
    //   console.log(err.name);
    //   expect(jazzServices_po.getAPIType(servicename).getText()).toEqual('Metrics count is Failed');
    // });
    expect(jazzServices_po.getMetricesCount().getText()).toEqual('1');
    browser.refresh();
    browser.sleep(twok);
    commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), fivek);
    jazzServices_po.getServiceHomePage().click();
  });

});

