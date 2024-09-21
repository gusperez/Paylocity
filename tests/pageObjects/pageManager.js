import {page} from '@playwright/test';
import {LoginPage} from './loginPage';
import {BenefitsDashboardPage} from './benefitsDashboard';
import {LogoutPage} from './logoutPage';

class PageManager {

    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.benefitsDashboardPage = new BenefitsDashboardPage(this.page);
        this.logoutPage = new LogoutPage(this.page);
    }

    onLogInPage(){
        return this.loginPage;
    }

    onBenefitsDashboardPage(){
        return this.benefitsDashboardPage;
    }

    onLogOutPage(){
        return this.logoutPage;
    }
}

module.exports = { PageManager };