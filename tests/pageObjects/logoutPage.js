import { expect } from '@playwright/test';


class LogoutPage {

    constructor(page){
        this.page = page;
        this.logInBtn = page.getByRole('button', { name: 'Log In' });
    }

    async checkLogOut(){
        const logOutSuccessfully = await this.logInBtn;
        await logOutSuccessfully.waitFor();
        await expect(logOutSuccessfully).toBeVisible();
    }

}

module.exports = {LogoutPage};