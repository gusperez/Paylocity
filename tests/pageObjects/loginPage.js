import { expect } from '@playwright/test';


class LoginPage {

    constructor(page){
        this.page = page;
        this.usernameTxt = page.getByRole('textbox', { name: 'Username' });
        this.passwordTxt = page.getByRole('textbox', { name: 'Password' });
        this.logInBtn = page.getByRole('button', { name: 'Log In' });
        this.employeesTable = page.locator('#employeesTable');
    }

    async logIn(username, password){
        await this.usernameTxt.fill(username);
        await this.passwordTxt.fill(password);
        await this.logInBtn.click();
        await this.page.waitForLoadState('load');

        await this.page.waitForSelector('#employeesTable');

        // Wait for all rows to be loaded (excluding the header row)
        await this.page.waitForFunction(() => {
            const rows = document.querySelectorAll(' #employeesTable tr');
            return rows.length > 1
        });
    }

    async fillUserNameTxt(username){
        await this.usernameTxt.fill(username);
    }

    async fillPasswordTxt(password){
        await this.passwordTxt.fill(password);
    }

    async clickLogInBtn(){
        await this.logInBtn.click();
        await this.page.waitForLoadState('load');
    }

    async checkUserNameError(){
        const usernameError = await this.page.locator('.validation-summary-errors li').innerText();
        await expect(usernameError).toBe('The Username field is required.');
    }

    async checkPasswordError(){
        const passwordError = await this.page.locator('.validation-summary-errors li').innerText();
        await expect(passwordError).toBe('The Password field is required.');
    }

    async checkUsernameAndPasswordError(){
        const usernameError = await this.page.locator('.validation-summary-errors li').nth(0).innerText();
        const passwordError = await this.page.locator('.validation-summary-errors li').nth(1).innerText();
        await expect(usernameError).toBe('The Username field is required.');
        await expect(passwordError).toBe('The Password field is required.');
    }

    async checkIncorrectUserNameOrPasswordError(){
        const passwordError = await this.page.locator('.validation-summary-errors li').innerText();
        await expect(passwordError).toBe('The specified username or password is incorrect.');
    }

    async checkLogIn(){
        const logInSuccessfully = await this.employeesTable;
        await logInSuccessfully.waitFor();
        await expect(logInSuccessfully).toBeVisible();
    }

}

module.exports = {LoginPage};