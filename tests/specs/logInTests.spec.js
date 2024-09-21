const pageURL = JSON.parse(JSON.stringify(require("../testData/baseURLs.json")));
const data = JSON.parse(JSON.stringify(require("../testData/data.json")));

import { test, expect } from '@playwright/test'
import { PageManager } from '../pageObjects/pageManager'

test.beforeEach(async ({page}) => {

    await page.goto(pageURL.url);

});

test('Log In - Happy path - Log In', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().fillUserNameTxt(data.username);
    await pm.onLogInPage().fillPasswordTxt(data.password);
    await pm.onLogInPage().clickLogInBtn();
    await pm.onLogInPage().checkLogIn();
});

test('Log In - Invalid Log In - Not fill username', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().fillPasswordTxt(data.password);
    await pm.onLogInPage().clickLogInBtn();
    await pm.onLogInPage().checkUserNameError();
});

test('Log In- Invalid Log In - Not fill password', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().fillUserNameTxt(data.username);
    await pm.onLogInPage().clickLogInBtn();
    await pm.onLogInPage().checkPasswordError();
});

test('Log In - Invalid Log In - Not fill username and password', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().clickLogInBtn();
    await pm.onLogInPage().checkUsernameAndPasswordError();
});

test('Log In - Invalid Log In - Invalid username', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().fillUserNameTxt(data.invalidUsername);
    await pm.onLogInPage().fillPasswordTxt(data.password);
    await pm.onLogInPage().clickLogInBtn();
    await pm.onLogInPage().checkIncorrectUserNameOrPasswordError();
});

test('Log In - Invalid Log In - Invalid password', async ({page}) => {
    const pm = new PageManager(page);
    await pm.onLogInPage().fillUserNameTxt(data.username);
    await pm.onLogInPage().fillPasswordTxt(data.invalidPassword);
    await pm.onLogInPage().clickLogInBtn();
    await pm.onLogInPage().checkIncorrectUserNameOrPasswordError();
});