const pageURL = JSON.parse(JSON.stringify(require("../testData/baseURLs.json")));
const data = JSON.parse(JSON.stringify(require("../testData/data.json")));

import { test, expect } from '@playwright/test'
import { PageManager } from '../pageObjects/pageManager'

test.beforeEach(async ({page}) => {

    await page.goto(pageURL.url);

});

test('Benefits Dashboard - Add Employee', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().logIn(data.username, data.password);
    await pm.onBenefitsDashboardPage().clickAddEmployeeBtn();
    await pm.onBenefitsDashboardPage().fillFirstNameTxt(data.firstname);
    await pm.onBenefitsDashboardPage().fillLastNameTxt(data.lastname);
    await pm.onBenefitsDashboardPage().fillDependantsTxt(data.dependants);
    await pm.onBenefitsDashboardPage().clickAddBtn();
    await pm.onBenefitsDashboardPage().verifyEmployee(data.firstname, data.lastname, data.dependants);
});

test('Benefits Dashboard - Cancel Add Employee', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().logIn(data.username, data.password);
    await pm.onBenefitsDashboardPage().clickAddEmployeeBtn();
    await pm.onBenefitsDashboardPage().fillFirstNameTxt(data.firstname);
    await pm.onBenefitsDashboardPage().fillLastNameTxt(data.lastname);
    await pm.onBenefitsDashboardPage().fillDependantsTxt(data.dependants);
    await pm.onBenefitsDashboardPage().clickCancelBtn();
});

test('Benefits Dashboard - Close Add Employee', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().logIn(data.username, data.password);
    await pm.onBenefitsDashboardPage().clickAddEmployeeBtn();
    await pm.onBenefitsDashboardPage().fillFirstNameTxt(data.firstname);
    await pm.onBenefitsDashboardPage().fillLastNameTxt(data.lastname);
    await pm.onBenefitsDashboardPage().fillDependantsTxt(data.dependants);
    await pm.onBenefitsDashboardPage().clickCloseBtn();
});

test('Benefits Dashboard - Log Out', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().logIn(data.username, data.password);
    await pm.onBenefitsDashboardPage().clickLogOutLnk();
    await pm.onLogOutPage().checkLogOut();
});

test('Benefits Dashboard - Delete Employee', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().logIn(data.username, data.password);
    await pm.onBenefitsDashboardPage().deleteEmployee(data.idToDelete);
    await pm.onBenefitsDashboardPage().checkEmployeeNoExists(data.idToDelete);
});

test('Benefits Dashboard - Update Employee', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().logIn(data.username, data.password);
    await pm.onBenefitsDashboardPage().updateEmployee(data.idToUpdate, data.newFirstname, data.newLastname, data.newDependants);
    await pm.onBenefitsDashboardPage().checkUpdatedEmployee(data.idToUpdate, data.newFirstname, data.newLastname, data.newDependants);
});