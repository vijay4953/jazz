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

import { browser, by, element, $, protractor, $$ } from 'protractor';
import { CONFIGURATIONS } from '../../src/config/configuration';
const fs = require('fs');
const config = CONFIGURATIONS.optional.general.e2e;
import { Jazz } from '../page-objects/jazzservices.po';
import { Login } from '../page-objects/login.po';


let servicename;

let jazzServices_po: Jazz;
jazzServices_po = new Jazz();

let login_po: Login;
login_po = new Login();

export class Common {
  
  public static readonly emailId = CONFIGURATIONS.optional.general.e2e.EMAIL_ID;
  public static readonly config = CONFIGURATIONS.optional.general.e2e;
  public static readonly timeOutHigh = 180000;
  public static readonly EC = protractor.ExpectedConditions;
  public static readonly twok = 2000;
  public static readonly fivek = 5000;
  public static readonly tenk = 10000;
  public static readonly fifteenk = 15000;
  public static readonly twentyk = 20000;
  public static readonly thirtyk = 30000;
  public static readonly sixtyk = 60000;

  waitForSpinnerLogin() {
    browser.wait(Common.EC.not(Common.EC.visibilityOf(jazzServices_po.getLoginSpinner())), 180000);
  }
  waitForSpinnerDisappear() {
    browser.wait(Common.EC.not(Common.EC.visibilityOf(jazzServices_po.getSpinner())), 180000);
  }
  waitForMetricsSpinner() {
    browser.wait(Common.EC.not(Common.EC.visibilityOf(jazzServices_po.getMetricsSpinner())), 180000);
  }
  waitforservice(ele, t) {
    browser.manage().timeouts().implicitlyWait(0);
    browser.wait(function () {
      browser.sleep(t);
      return ele.isDisplayed()
        .then(
          function (text) {
            console.log( "Test is :"+ text);
            return text;
          },
          function (error) {
            browser.refresh();
            console.error(" Error :" + error );
            return false;
          });
    }, 240 * 1000);
  }
  fluentwaittry(ele, t) {
    browser.manage().timeouts().implicitlyWait(0);
    browser.wait(function () {
      browser.sleep(t);
      return ele.isDisplayed()
        .then(
          function (text) {
            return text;

          },
          function (error) {
            browser.refresh();
            console.log("Element and error" +ele  +error);
            return error;
          });
    }, 180 * 1000);
  }

  refreshbutton(ele, t) {
    browser.manage().timeouts().implicitlyWait(0);
    if (!browser.wait(Common.EC.elementToBeClickable(jazzServices_po.getRefresh()), Common.fivek)) {
      console.log("Refresh button is disable");
      return false;
      
    }
    browser.wait(function () {
      browser.sleep(t);
      return ele.isPresent()
        .then(
          function (text) {
            return text;
          },
          function (error) {
            jazzServices_po.getRefresh().click();
            return false;
          });
    }, 120 * 1000);
  }

  elementPresent(elm, t) {
    browser.manage().timeouts().implicitlyWait(0);
    browser.wait(function () {
      browser.sleep(t);
      return elm.isPresent()
        .then(
          function (text) {
            return text;
          },
          function (error) {
            browser.refresh();
            console.log("Element and error" +elm  +error);
          });
    }, 60 * 1000);
  }

  verifyDelpoyment() {
    browser.driver.sleep(Common.twok);
    jazzServices_po.getDeploymentStatus();
    jazzServices_po.getDeploymentStatus().click();
    this.waitForSpinnerDisappear();
    this.refreshbutton(jazzServices_po.getDeploymentStatusVerify(), Common.fivek);
    //Verifying the Deployment status
    expect(jazzServices_po.getDeploymentStatusVerify().getText()).toEqual('Successful');
  }
  verifyAsset() {
    browser.driver.sleep(Common.twok);
    this.refreshbutton(jazzServices_po.getAsset(), Common.fivek);
    //To get the Asset Tab
    jazzServices_po.getAsset().click();
    this.waitForSpinnerDisappear();
    this.refreshbutton(jazzServices_po.getAssetStatusVerify(), Common.fivek);
    //Verifying the Assets are ACTIVE
    expect(jazzServices_po.getAssetStatusVerify().getText().then(function (text) { return text.toLowerCase() })).toEqual('active');
  }
  verifyLogs() {
    this.refreshbutton(jazzServices_po.getLogs(), Common.fivek);
    jazzServices_po.getLogs().click();
    this.refreshbutton(jazzServices_po.getFilterIcon(), Common.fivek);
    browser.driver.switchTo().activeElement();
    jazzServices_po.getFilterIcon().click();
    this.refreshbutton(jazzServices_po.getDropDown(), Common.fivek);
    jazzServices_po.getDropDown().click();
    jazzServices_po.getDay().click();
    browser.sleep(Common.twok);
    jazzServices_po.getDropDown().click();
    jazzServices_po.getWeek().click();
    browser.sleep(Common.twok);
    expect(jazzServices_po.getWeekVerify().getText()).toEqual('WEEK');
    jazzServices_po.getDropDown().click();
    jazzServices_po.getMonth().click();
    browser.sleep(Common.twok);
    expect(jazzServices_po.getMonthVerify().getText()).toEqual('MONTH');
    jazzServices_po.getDropDown().click();
    jazzServices_po.getYear().click();
    expect(jazzServices_po.getYearVerify().getText()).toEqual('YEAR');
    // browser.refresh();
    // this.fluentwaittry(jazzServices_po.getServiceHomePage(), Common.fivek);
    // jazzServices_po.getServiceHomePage().click();
  }
  Login()
  {
      browser.refresh();
      browser.wait(Common.EC.visibilityOf(login_po.getLoginButton()), Common.timeOutHigh);
      login_po.getLoginButton().click();
      if (browser.wait(Common.EC.visibilityOf(login_po.submitLoginButton()), Common.timeOutHigh))
      {
        login_po.getUserNameInput().sendKeys(config.USER_NAME);
        login_po.getPasswordInput().sendKeys(config.PASSWORD);
        login_po.submitLoginButton().click();
        this.waitForSpinnerLogin();
        browser.wait(Common.EC.visibilityOf(jazzServices_po.getPageTitle()), Common.timeOutHigh);
        const page_title = jazzServices_po.getPageTitle().getText();
        expect(page_title).toEqual('Services');
      }
      else{
        throw new Error('Page is not uploaded. waited for 3 min');  
      }
  }
}