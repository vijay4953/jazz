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
 let flag = 1;
 const EC = protractor.ExpectedConditions;
 let winhandle;
 let servicename;
 let test;

 beforeAll(() => {
  jazzServices_po = new Jazz();
  commonUtils = new Common();
  browser.driver.sleep(Common.fivek);
  //jazzServices_po.navigateToJazzGet();
  commonUtils.Login();
 });

 beforeEach(() => {
  if( flag == 0){
    pending();
  }
} );

 afterAll(() => {
  jazzServices_po = new Jazz();
  commonUtils = new Common();
  browser.driver.sleep(Common.fivek);
  jazzServices_po.logoutIcon().click();
  jazzServices_po.logout().click();
});

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

 it('Create Lambda Service', () => {
   browser.driver.switchTo().activeElement();
   browser.driver.sleep(Common.fivek);
   browser.wait(EC.visibilityOf(jazzServices_po.getCreateService()), Common.timeOutHigh);
   browser.wait(EC.elementToBeClickable(jazzServices_po.getCreateService()), Common.timeOutHigh);
   jazzServices_po.getCreateService().click();
   browser.driver.switchTo().activeElement();
   browser.driver.sleep(Common.fivek);
   //Creating the Lambda
   jazzServices_po.getLambda().click();
   var min = 111;
   var max = 999;
   var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
   servicename = 'service' + randomNum;
   createservice(servicename);
   jazzServices_po.getEventScheduleFixedRate().click();
   serviceapprover();
   browser.driver.sleep(Common.fifteenk);
   //Verifying the Lambda is correct
   expect(jazzServices_po.getService(servicename).getText()).toEqual(servicename);
   expect(jazzServices_po.getFunctionType(servicename).getText()).toEqual('function');
   expect(jazzServices_po.getFunctionStatus(servicename).getText()).toEqual('creation started');
   //commonUtils.waitforservice(jazzServices_po.serviceStatus(servicename), Common.sixtyk);
      //expect(jazzServices_po.serviceStatus(servicename).getText()).toEqual('active');

      // jazzServices_po.serviceStatus(servicename).getText().then(function (service) {
      //   console.log("Service is :" + service)
        // if (result) {
        //   console.log("pass"+result);
        //   flag = 1;
        // } else{
        //   console.log("fail"+result);
        //   flag = 0;
        // }
   //expect(jazzServices_po.serviceStatus(servicename).getText()).toEqual('active');

    browser.wait(function () {
      browser.sleep(Common.sixtyk);
      return jazzServices_po.serviceStatus(servicename).isDisplayed()
        .then(
          function (text) {
            console.log( "Test is :"+ text);
            flag=1;
            return text;
          },
          function (error) {
            browser.refresh();
            console.error(" Error :" + error );
            flag=0;
            return false;
          });
      }, 240 * 1000);

 });

 it('Verify Function', () => {
   commonUtils.fluentwaittry(jazzServices_po.getService(servicename), Common.fivek);
   browser.wait(EC.elementToBeClickable(jazzServices_po.getService(servicename)), Common.timeOutHigh);
   //To Navigate to the particular service and verifying the Page
   jazzServices_po.getService(servicename).click();
   commonUtils.fluentwaittry(jazzServices_po.getOverviewStatus(), Common.fivek);
   expect(jazzServices_po.getOverviewStatus().getText()).toEqual('OVERVIEW');
   commonUtils.fluentwaittry(jazzServices_po.getServiceNameHeader(), Common.fivek);
   browser.wait(EC.visibilityOf(jazzServices_po.getServiceNameHeader()), Common.timeOutHigh);
   //To get the corresponding environment[Prod]
   commonUtils.elementPresent(jazzServices_po.getProdName(), Common.fivek);
   jazzServices_po.getProdName().click();
   commonUtils.waitForSpinnerDisappear();
   commonUtils.refreshbutton(jazzServices_po.getDeploymentStatus(), Common.fivek);
   commonUtils.refreshbutton(jazzServices_po.getProdHeader(), Common.fivek);
   //Verifying the browser id at the Deployment Tab
   expect(jazzServices_po.getDeploymentStatus().getText()).toEqual('DEPLOYMENTS');
   browser.driver.switchTo().activeElement();

 });

 it('Verify METRICS Navigation for Lambda', () => {
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
   commonUtils.elementPresent(jazzServices_po.getProdName(), Common.tenk);
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
   commonUtils.fluentwaittry(jazzServices_po.getTestFunction(), Common.fivek);
   expect(jazzServices_po.getTestFunction().getText()).toEqual('TEST FUNCTION');
   jazzServices_po.getTestFunction().click();
   browser.wait(EC.visibilityOf(jazzServices_po.getTestArea()), Common.timeOutHigh);
   jazzServices_po.getTestArea().sendKeys('{');
   jazzServices_po.getTestArea().sendKeys(' ');
   jazzServices_po.getTestArea().sendKeys('}');
   browser.wait(EC.visibilityOf(jazzServices_po.getTestButton()), Common.timeOutHigh);
   jazzServices_po.getTestButton().click();
   browser.driver.sleep(Common.fivek);
   browser.wait(EC.visibilityOf(jazzServices_po.getClose()), Common.timeOutHigh);
   jazzServices_po.getClose().click();
   commonUtils.refreshbutton(jazzServices_po.getMetrices(), Common.fivek);
   jazzServices_po.getMetrices().click();
   commonUtils.waitForSpinnerDisappear();
 });

 it('Verify Lambda Deployments', () => {
   commonUtils.verifyDelpoyment();
 });

 it('Verify Lambda Asset', () => {
   commonUtils.verifyAsset();
 });

 it('Verify Lambda Logs', () => {
   commonUtils.verifyLogs();
 });


 it('Verify METRICS COUNT for Lambda', () => {
   browser.sleep(Common.twok);
  //  commonUtils.fluentwaittry(jazzServices_po.getService(servicename), Common.fivek);
  //  browser.wait(EC.elementToBeClickable(jazzServices_po.getService(servicename)), Common.timeOutHigh);
  //  //To Navigate to the particular service and verifying the Page
  //  jazzServices_po.getService(servicename).click();
  //  commonUtils.fluentwaittry(jazzServices_po.getServiceNameHeader(), Common.fivek);
  //  commonUtils.elementPresent(jazzServices_po.getProdName(), Common.fivek);
  //  jazzServices_po.getProdName().click();
  //  commonUtils.waitForSpinnerDisappear();
   commonUtils.refreshbutton(jazzServices_po.getMetrices(), Common.fivek);
   jazzServices_po.getMetrices().click();
   commonUtils.waitForMetricsSpinner();
   commonUtils.refreshbutton(jazzServices_po.getMetricesCount(), Common.fivek);
   expect(jazzServices_po.getMetricesCount().getText()).not.toEqual('-');
   browser.sleep(Common.twok);
   commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), Common.fivek);
   jazzServices_po.getServiceHomePage().click();
 });

 it('Identifying Environment and Navigation for Lambda', () => {
   browser.driver.sleep(Common.twok);
   commonUtils.fluentwaittry(jazzServices_po.getService(servicename), Common.fivek);
   browser.wait(EC.elementToBeClickable(jazzServices_po.getService(servicename)), Common.timeOutHigh);
   //To Navigate to the particular service and verifying the Page
   jazzServices_po.getService(servicename).click();
   browser.wait(EC.visibilityOf(jazzServices_po.getRepository()), Common.timeOutHigh);
   jazzServices_po.getRepository().click();
   browser.sleep(Common.fivek);
 });
 it('Create the Test Branch for Lambda', () => {
   browser.getAllWindowHandles().then(function (handles) {
    browser.sleep(Common.twok);
    var min = 11;
    var max = 99;
    var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    test = 'test' + randomNum;
    browser.switchTo().window(handles[1]).then(function () {
     browser.sleep(Common.tenk);
     browser.getTitle().then(function (webpagetitle) {
      if (webpagetitle === 'Sign in · GitLab') {
       expect(webpagetitle).toEqual('Sign in · GitLab');
       jazzServices_po.gitUsername().sendKeys(Common.config.SCM_USERNAME);
       jazzServices_po.gitPassword().sendKeys(Common.config.SCM_PASSWORD);
       jazzServices_po.gitLogin().click();
       browser.wait(EC.visibilityOf(jazzServices_po.drpGitBranchType()), Common.timeOutHigh);
       jazzServices_po.drpGitBranchType().click();
       jazzServices_po.selectGitBranchType().click();
       jazzServices_po.gitBranchName().sendKeys(test);
       browser.wait(EC.elementToBeClickable(jazzServices_po.btnGitCreateBranch()), Common.timeOutHigh);
       jazzServices_po.btnGitCreateBranch().click();
       browser.sleep(Common.twok);
       browser.navigate().refresh();
       browser.sleep(Common.twok);
       jazzServices_po.getGitLogoutIcon().click();
       jazzServices_po.getGitLogout().click();
       browser.close();
      }
      else {
       expect(webpagetitle).not.toEqual('Sign in · GitLab');
       jazzServices_po.bitUsername().sendKeys(Common.config.SCM_USERNAME);
       jazzServices_po.bitPassword().sendKeys(Common.config.SCM_PASSWORD);
       jazzServices_po.bitLogin().click();
       browser.wait(EC.visibilityOf(jazzServices_po.createBranch()), Common.timeOutHigh);
       jazzServices_po.createBranch().click();
       jazzServices_po.drp_BranchType().click();
       jazzServices_po.select_BranchType().click();
       browser.sleep(Common.twok);
       jazzServices_po.branchName().sendKeys(test);
       browser.wait(EC.elementToBeClickable(jazzServices_po.btn_CreateBranch()), Common.timeOutHigh);
       jazzServices_po.btn_CreateBranch().click();
       browser.sleep(Common.tenk);
       browser.navigate().refresh();
       browser.sleep(Common.twok);
       jazzServices_po.getBitLogoutIcon().click();
       jazzServices_po.getBitLogout().click();
       browser.close();
      }
     });
    });

    browser.switchTo().window(handles[0]).then(function () {
     browser.sleep(Common.twok);
     commonUtils.waitforservice(jazzServices_po.activeTestBranch(), Common.fifteenk);
     jazzServices_po.activeTestBranch().click().
      then(null, function (err) {
       console.log("the error occurred is : " + err.name);
      });
     commonUtils.waitForSpinnerDisappear();
     browser.sleep(Common.fivek);
    });
   });
 });
 it('Verify METRICS Navigation for Lambda for Test Branch', () => {
   browser.sleep(Common.twok);
   commonUtils.fluentwaittry(jazzServices_po.getTestFunction(), Common.fifteenk);
   expect(jazzServices_po.getTestFunction().getText()).toEqual('TEST FUNCTION');
   jazzServices_po.getTestFunction().click();
   browser.wait(EC.visibilityOf(jazzServices_po.getTestArea()), Common.timeOutHigh);
   jazzServices_po.getTestArea().sendKeys('{');
   jazzServices_po.getTestArea().sendKeys(' ');
   jazzServices_po.getTestArea().sendKeys('}');
   browser.wait(EC.visibilityOf(jazzServices_po.getTestButton()), Common.timeOutHigh);
   jazzServices_po.getTestButton().click();
   browser.driver.sleep(Common.fivek);
   //expect(jazzServices_po.testSuccessMessage().getText()).toEqual('Function got triggered successfully');
   browser.wait(EC.visibilityOf(jazzServices_po.getClose()), Common.timeOutHigh);
   jazzServices_po.getClose().click();
   commonUtils.refreshbutton(jazzServices_po.getMetrices(), Common.fivek);
   jazzServices_po.getMetrices().click();
   commonUtils.waitForSpinnerDisappear();
 });

 it('Verify Lambda Deployments for Test Branch', () => {
   commonUtils.verifyDelpoyment();
 });

 it('Verify Lambda Asset for Test Branch', () => {
   commonUtils.verifyAsset();
 });

 it('Verify Lambda Logs for Test Branch', () => {
   commonUtils.verifyLogs();
 });
 it('Verify METRICS COUNT for Lambda in Test Branch', () => {
   browser.sleep(Common.twok);
   commonUtils.fluentwaittry(jazzServices_po.getMetrices(), Common.fifteenk);
   jazzServices_po.getMetrices().click();
   commonUtils.waitForMetricsSpinner();
   commonUtils.refreshbutton(jazzServices_po.getMetricesCount(), Common.tenk);
   expect(jazzServices_po.getMetricesCount().getText()).not.toEqual('-');
   browser.sleep(Common.twok);
   commonUtils.fluentwaittry(jazzServices_po.getServiceHomePage(), Common.fivek);
   jazzServices_po.getServiceHomePage().click();
 });
});

