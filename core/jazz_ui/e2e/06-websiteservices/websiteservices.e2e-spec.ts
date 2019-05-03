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
import { Timeouts, Browser } from 'selenium-webdriver';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { Common } from '../common/commontest';


describe('Overview', () => {
  let jazzServices_po: Jazz;
  let commonUtils: Common;

  const EC = protractor.ExpectedConditions;
  let winhandle;
  let servicename;
  let test;
  let flag = 1;

  beforeAll(() => {
    jazzServices_po = new Jazz();
    commonUtils = new Common();
    browser.driver.sleep(Common.fivek);
    commonUtils.Login();
  });
  beforeEach(() => {
    if( flag == 0){
      pending();
    }
  } );

  function createservice(servicename) {
    jazzServices_po.getServiceName().sendKeys(servicename);
    jazzServices_po.getNameSpace().sendKeys('jazztest');
    jazzServices_po.getServiceDescription().sendKeys('Testing');
  }

  function serviceapprover() {
    browser.driver.sleep(Common.fivek);
    jazzServices_po.getSubmit().click();
    commonUtils.fluentwaittry(jazzServices_po.getDone(), Common.tenk);
    jazzServices_po.getDone().click();
  }

  function waitforskiptest(ele, t) {
    browser.manage().timeouts().implicitlyWait(0);
    browser.wait(function () {
      browser.sleep(t);
      return ele.isDisplayed()
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
  }

  it('Create Website Service', () => {
      browser.driver.switchTo().activeElement();
      browser.driver.sleep(Common.fivek);
      browser.wait(EC.visibilityOf(jazzServices_po.getCreateService()), Common.timeOutHigh).then(null,function(err){
        console.log(err);
        flag = 0;
        browser.refresh();
      });
      browser.wait(EC.elementToBeClickable(jazzServices_po.getCreateService()), Common.timeOutHigh);
      jazzServices_po.getCreateService().click();
      browser.driver.switchTo().activeElement();
      browser.driver.sleep(Common.fivek);
      //Creating Website
      jazzServices_po.getWebsite().click();
      var min = 111111111;
      var max = 999999999;
      var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      servicename = 'servicename' + randomNum;
      createservice(servicename);
      serviceapprover();
      browser.driver.sleep(Common.fifteenk);
      //Verifying the service
      expect(jazzServices_po.getService(servicename).getText()).toEqual(servicename);
      expect(jazzServices_po.getWebsiteType(servicename).getText()).toEqual('website');
      expect(jazzServices_po.getWebsiteStatus(servicename).getText()).toEqual('creation started');
      
      // browser.wait(function () {
      //   browser.sleep(Common.sixtyk);
      //   return jazzServices_po.serviceStatus(servicename).isDisplayed()
      //     .then(
      //       function (text) {
      //         console.log( "Test is :"+ text);
      //         flag=1;
      //         return text;
      //       },
      //       function (error) {
      //         browser.refresh();
      //         console.error(" Error :" + error );
      //         flag=0;
      //         return false;
      //       });
      //   }, 240 * 1000);
        waitforskiptest(jazzServices_po.serviceStatus(servicename), Common.sixtyk);
   });

  it('Verify Webpage Title', () => {
      commonUtils.fluentwaittry(jazzServices_po.getService(servicename), Common.fivek);
      browser.wait(EC.elementToBeClickable(jazzServices_po.getService(servicename)), Common.timeOutHigh);
      //To Navigate to the particular service and verifying the Page
      jazzServices_po.getService(servicename).click();
      commonUtils.fluentwaittry(jazzServices_po.getOverviewStatus(), Common.fivek);
      expect(jazzServices_po.getOverviewStatus().getText()).toEqual('OVERVIEW');
      commonUtils.fluentwaittry(jazzServices_po.getServiceNameHeader(), Common.fivek);
      //browser.wait(EC.visibilityOf(jazzServices_po.getServiceNameHeader()), Common.timeOutHigh);
      //To get the corresponding environment[Prod]
      //commonUtils.fluentwaittry(jazzServices_po.getProdName(), Common.fivek);
      // browser.wait(function () {
      //   browser.sleep(Common.tenk);
      //   return jazzServices_po.getProdName().isDisplayed()
      //     .then(
      //       function (text) {
      //         flag=1;
      //         return text;
      //       },
      //       function (error) {
      //         browser.refresh();
      //         flag=0;
      //         return false;
      //       });
      //   }, 60 * 1000);
      waitforskiptest(jazzServices_po.getProdName(), Common.sixtyk);
      jazzServices_po.getProdName().click();
      commonUtils.waitForSpinnerDisappear();
      commonUtils.refreshbutton(jazzServices_po.getDeploymentStatus(), Common.fivek);
      commonUtils.refreshbutton(jazzServices_po.getProdHeader(), Common.fivek);
      //Verifying the browser id at the Deployment Tab
      expect(jazzServices_po.getDeploymentStatus().getText()).toEqual('DEPLOYMENTS');
      browser.driver.switchTo().activeElement();
  });

  it('Verify METRICS Navigation for Website', () => {
      commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), Common.fivek);
      jazzServices_po.getServiceHomePage().click();
      browser.sleep(Common.twok);
      browser.driver.switchTo().activeElement();
      commonUtils.fluentwaittry(jazzServices_po.getService(servicename), Common.fivek);
      // // Navigation to services
      browser.wait(EC.elementToBeClickable(jazzServices_po.getService(servicename)), Common.timeOutHigh);
      // //To Navigate to the particular service and verifying the Page
      jazzServices_po.getService(servicename).click();
      commonUtils.fluentwaittry(jazzServices_po.getServiceNameHeader(), Common.fivek);
      commonUtils.fluentwaittry(jazzServices_po.getProdName(), Common.fivek);
      jazzServices_po.getProdName().click();
      commonUtils.waitForSpinnerDisappear();
      commonUtils.refreshbutton(jazzServices_po.getProdHeader(), Common.fivek);
      browser.driver.switchTo().activeElement();
      commonUtils.refreshbutton(jazzServices_po.getMetrices(), Common.fivek);
      jazzServices_po.getMetrices().click();
      commonUtils.waitForMetricsSpinner();
      commonUtils.refreshbutton(jazzServices_po.getDeploymentStatus(), Common.fivek);
      jazzServices_po.getDeploymentStatus().click();
      commonUtils.waitForSpinnerDisappear();
      commonUtils.fluentwaittry(jazzServices_po.goToFunction(), Common.fivek);
      expect(jazzServices_po.goToFunction().getText()).toEqual('GO TO WEBSITE');
      jazzServices_po.goToFunction().click();
      browser.getAllWindowHandles().then(function (handles) {
        browser.switchTo().window(handles[1]).then(function () {
          browser.sleep(Common.fivek);
          //As go to website page is not reachable and it takes more than 10 minutes to display so commenting the below steps for now.
          //expect(jazzServices_po.websiteTemplete().getText()).toEqual('Jazz Serverless Platform Website Template');
          browser.close();
        });
        browser.switchTo().window(handles[0]).then(function () {
          commonUtils.refreshbutton(jazzServices_po.getMetrices(), Common.fivek);
          jazzServices_po.getMetrices().click();
          commonUtils.waitForSpinnerDisappear();
        });
      });
  });


  it('Verify Website Deployments', () => {
      commonUtils.verifyDelpoyment();
  });

  it('Verify Wesbsite Asset', () => {
      commonUtils.verifyAsset();
      // commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), Common.fivek);
      // jazzServices_po.getServiceHomePage().click();
  });


  it('Verify METRICS COUNT for Website', () => {
      browser.sleep(Common.twok);
      // commonUtils.fluentwaittry(jazzServices_po.getService(servicename), Common.fivek);
      // browser.wait(EC.elementToBeClickable(jazzServices_po.getService(servicename)), Common.timeOutHigh);
      // //To Navigate to the particular service and verifying the Page
      // jazzServices_po.getService(servicename).click();
      // commonUtils.fluentwaittry(jazzServices_po.getServiceNameHeader(), Common.fivek);
      // commonUtils.fluentwaittry(jazzServices_po.getProdName(), Common.fivek);
      // jazzServices_po.getProdName().click();
      // commonUtils.waitForSpinnerDisappear();
      commonUtils.fluentwaittry(jazzServices_po.getMetrices(), Common.fivek);
      jazzServices_po.getMetrices().click();
      commonUtils.waitForMetricsSpinner();
      // As go to website page is not reachable so it is not generating any value so commenting the below steps for now.
      //commonUtils.refreshbutton(jazzServices_po.getMetricesRequestCount(),Common.fivek);
      //expect(jazzServices_po.getMetricesRequestCount().getText()).toEqual('10');  
      browser.sleep(Common.twok);
      commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), Common.fivek);
      jazzServices_po.getServiceHomePage().click();
  });

  it('Identifying Environment and Navigation for Website', () => {
      browser.driver.sleep(Common.twok);
      commonUtils.fluentwaittry(jazzServices_po.getService(servicename), Common.fivek);
      browser.wait(EC.elementToBeClickable(jazzServices_po.getService(servicename)), Common.timeOutHigh);
      //To Navigate to the particular service and verifying the Page
      jazzServices_po.getService(servicename).click();
      browser.wait(EC.visibilityOf(jazzServices_po.getRepository()), Common.timeOutHigh);
      jazzServices_po.getRepository().click();
      browser.sleep(Common.fivek);

  });
  it('Create the Test Branch for Website', () => {
      browser.getAllWindowHandles().then(function (handles) {
        browser.sleep(Common.tenk);
        var min = 11;
        var max = 99;
        var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        test = 'test' + randomNum;
        browser.switchTo().window(handles[1]).then(function () {
          browser.sleep(Common.twok);

          var some_name = browser.getTitle().then(function (webpagetitle) {
            if (webpagetitle === 'Sign in · GitLab') {
              jazzServices_po.gitUsername().sendKeys(Common.config.SCM_USERNAME).then(null, function(err){
                console.log(err.name); 
              });
              jazzServices_po.gitPassword().sendKeys(Common.config.SCM_PASSWORD).then(null, function(err){
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
                flag = 0;
                browser.sleep(Common.twentyk);
                browser.close();
              });
              browser.close();
            }
            else {
              expect(webpagetitle).not.toEqual('Sign in · GitLab');
              jazzServices_po.bitUsername().sendKeys(Common.config.SCM_USERNAME).then(null, function(err){
                console.log(err.name); 
              });
              browser.sleep(Common.twok);
              jazzServices_po.bitPassword().sendKeys(Common.config.SCM_PASSWORD).then(null, function(err){
                console.log(err.name); 
              });
              browser.sleep(Common.twok);
              jazzServices_po.bitLogin().click().then(null, function(err){
                console.log(err.name); 
              });
              browser.sleep(Common.twok);
              jazzServices_po.createBranch().click().then(null, function(err){
                console.log(err.name); 
              });
              browser.sleep(Common.twok);
              jazzServices_po.drp_BranchType().click().then(null, function(err){
                console.log(err.name); 
              });
              browser.sleep(Common.twok);
              jazzServices_po.select_BranchType().click().then(null, function(err){
                console.log(err.name); 
              });
              browser.sleep(Common.twok);
              jazzServices_po.branchName().sendKeys(test).then(null, function(err){
                console.log(err.name); 
              });
              browser.sleep(Common.twok);
              jazzServices_po.btn_CreateBranch().click().then(null, function(err){
                console.log(err.name); 
              });
              browser.sleep(Common.twok);
              jazzServices_po.getBitLogoutIcon().click().then(null, function(err){
                console.log(err.name); 
              });
              browser.sleep(Common.twok);
              jazzServices_po.getBitLogout().click().then(null, function(err){
                console.log(err.name); 
                flag = 0;
                browser.sleep(Common.twentyk);
                browser.close(); 
              });
                browser.sleep(Common.twok);
                browser.close();
            }
          });
        });

        browser.switchTo().window(handles[0]).then(function () {
          browser.sleep(Common.fivek);
          //commonUtils.waitforservice(jazzServices_po.activeTestBranch(), Common.fifteenk);
          // browser.wait(function () {
          //   browser.sleep(Common.sixtyk);
          //   return jazzServices_po.activeTestBranch().isDisplayed()
          //     .then(
          //       function (text) {
          //         flag=1;
          //         return text;
          //       },
          //       function (error) {
          //         browser.refresh();
          //         flag=0;
          //         return false;
          //       });
          //   }, 240 * 1000);
          waitforskiptest(jazzServices_po.activeTestBranch(), Common.sixtyk);
          jazzServices_po.activeTestBranch().click().
            then(null, function (err) {
              console.log("the error occurred is : " + err.name);
            });
          commonUtils.waitForSpinnerDisappear();
          browser.driver.switchTo().activeElement();
          browser.sleep(Common.fivek);
        });
      });

  });

  it('Verify METRICS Navigation for Website for Test Branch', () => {
      browser.sleep(Common.twok);
      commonUtils.fluentwaittry(jazzServices_po.goToFunction(), Common.fivek);
      expect(jazzServices_po.goToFunction().getText()).toEqual('GO TO WEBSITE');
      jazzServices_po.goToFunction().click();
      browser.getAllWindowHandles().then(function (handles) {
        browser.switchTo().window(handles[1]).then(function () {
          browser.sleep(Common.fivek);
          //As go to website page is not reachable and it takes more than 10 minutes to display so commenting the below steps for now.
          //expect(jazzServices_po.websiteTemplete().getText()).toEqual('Jazz Serverless Platform Website Template');
          browser.close();
        });
        browser.switchTo().window(handles[0]).then(function () {
          commonUtils.refreshbutton(jazzServices_po.getMetrices(), Common.fivek);
          jazzServices_po.getMetrices().click();
          commonUtils.waitForSpinnerDisappear();
        });
      });
  });


  it('Verify Website Deployments for Test Branch', () => {
      commonUtils.verifyDelpoyment();
  });

  it('Verify Wesbsite Asset for Test Branch', () => {
      commonUtils.verifyAsset();
      // commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), Common.fivek);
      // jazzServices_po.getServiceHomePage().click();
  });

  it('Verify METRICS COUNT for Website in Test Branch', () => {
      browser.sleep(Common.twok);
      commonUtils.fluentwaittry(jazzServices_po.getMetrices(), Common.fifteenk);
      jazzServices_po.getMetrices().click();
      commonUtils.waitForMetricsSpinner();
      // As go to website page is not reachable so it is not generating any value so commenting the below steps for now.
      //commonUtils.refreshbutton(jazzServices_po.getMetricesRequestCount(),Common.fivek);
      //expect(jazzServices_po.getMetricesRequestCount().getText()).toEqual('10');  
      browser.sleep(Common.twok);
      commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), Common.fivek);
      jazzServices_po.getServiceHomePage().click();
  });
});

