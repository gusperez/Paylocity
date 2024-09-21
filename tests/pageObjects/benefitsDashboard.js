import { expect } from '@playwright/test';


class BenefitsDashboardPage {

    constructor(page){
        this.page = page;
        this.logOutLnk = page.getByRole('link', { name: 'Log Out' });
        this.addEmployeeBtn = page.getByRole('button', { name: 'Add Employee' });
        this.addEmployeePopUp = page.locator('.modal-content');
        

        this.firstNameTxt = page.locator('#firstName');
        this.lastNameTxt = page.locator('#lastName');
        this.dependantsTxt = page.locator('#dependants');
        this.addBtn = page.locator('#addEmployee');
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
        this.closeBtn = page.getByRole('button', { name: 'Close' });

        this.deleteBtn = page.getByRole('button', { name: 'Delete' });
        this.updateBtn = page.getByRole('button', { name: 'Update' });


    }

    async clickAddEmployeeBtn(){
        const addEmployeeButton = this.addEmployeeBtn;
        await this.page.waitForLoadState('load');
        await this.addEmployeeBtn.click();
        await this.page.waitForSelector('.modal-content', { state: 'visible'});
    }

    async fillFirstNameTxt(firstname){
        await this.firstNameTxt.fill(firstname);
    }

    async fillLastNameTxt(lastname){
        await this.lastNameTxt.fill(lastname);
    }

    async fillDependantsTxt(dependants){
        await this.dependantsTxt.fill(dependants);
    }

    async clickAddBtn(){
        await this.addBtn.click();
        await this.page.waitForLoadState('load');
    }

    async clickCancelBtn(){
        await this.cancelBtn.click();
        await this.page.waitForLoadState('load');
    }

    async clickCloseBtn(){
        await this.closeBtn.click();
        await this.page.waitForLoadState('load');
    }

    async clickLogOutLnk(){
        await this.logOutLnk.click();
        await this.page.waitForLoadState('load');
    }

    async verifyEmployee(firstname, lastname, dependants){
        await this.page.waitForTimeout(1000);

        const tableEmployee = this.page.locator('#employeesTable');
        const rows = tableEmployee.locator('tr');
        let checkFlag = false;
        let benefits = 0;
        let net = 0;

        // Iterate over each row
        for (let i = 0; i < await rows.count(); i++){ // Start from 1 to skip the header row
            const row = rows.nth(i);

            // Locate all cells in the current row
            const cells = row.locator('td');
            let count = 0;

            // Iterate over each cell in the current row
            for(let j = 0; j < await cells.count(); j++){ 
                const cell = cells.nth(j);
                const cellText = await cell.textContent();
    
                if (cellText == firstname) count++;
                else if (cellText == lastname) count++;
                else if (cellText == dependants) count ++;

                // Validate salary, Gross Pay, Benefits Cost Net Pay
                else if (count == 3){
                    if (j == 4) await expect(cellText).toBe('52000.00');
                    if (j == 5) await expect(cellText).toBe('2000.00');
                    if (j == 6) {
                        benefits = ((1000/26) + ((500/26) * dependants)).toFixed(2);
                        await expect(cellText).toBe(benefits);
                    }
                    if (j == 7) {
                        net = 2000 - benefits;
                        await expect(parseFloat(cellText)).toBe(net);
                    }
                }
                //console.log(`Row ${i + 1}, Cell ${j + 1}: ${cellText}`);
            }

            if (count == 3){
                checkFlag = true;
                break;
            }
        }

        await expect(checkFlag, 'Employee was not found').toBeTruthy();
    }

    async deleteEmployee(id){
        await this.page.waitForSelector('#employeesTable');

        const tableEmployee = this.page.locator('#employeesTable');
        const rows = tableEmployee.locator('tr');
        let deleteEmployee = false;

        // Iterate over each row
        for (let i = 0; i < await rows.count(); i++){ // Start from 1 to skip the header row
            const row = rows.nth(i);

            // Locate all cells in the current row
            const cells = row.locator('td');

            // Iterate over each cell in the current row
            for(let j = 0; j < await cells.count(); j++){ 
                const cell = cells.nth(j);
                const cellText = await cell.textContent();
                if (cellText == id){
                    const actions = cells.nth(8);
                    const xBtn = actions.locator('.fas.fa-times');
                    await xBtn.click();
                    await this.deleteBtn.click();
                    deleteEmployee = true;
                    break;
                }
            }
        }

        await expect(deleteEmployee, 'Employee Id was not found').toBeTruthy();
    }

    async updateEmployee(id, newFirstname, newLastname, newDependants){
        await this.page.waitForSelector('#employeesTable');

        const tableEmployee = this.page.locator('#employeesTable');
        const rows = tableEmployee.locator('tr');
        let idExists = false;

        // Iterate over each row
        for (let i = 0; i < await rows.count(); i++){ // Start from 1 to skip the header row
            const row = rows.nth(i);

            // Locate all cells in the current row
            const cells = row.locator('td');

            // Iterate over each cell in the current row
            for(let j = 0; j < await cells.count(); j++){ 
                const cell = cells.nth(j);
                const cellText = await cell.textContent();
                if (cellText == id){
                    const actions = cells.nth(8);
                    const xBtn = actions.locator('.fas.fa-edit');
                    await xBtn.click();
                    await this.page.waitForSelector('.modal-content', { state: 'visible'});
                    await this.firstNameTxt.fill(newFirstname);
                    await this.lastNameTxt.fill(newLastname);
                    await this.dependantsTxt.fill(newDependants);
                    await this.updateBtn.click();
                    idExists = true;
                    break;
                }
            }
        }
        
        await expect(idExists, 'Employee Id was not found').toBeTruthy();
        
    }

    async checkEmployeeNoExists(id){

        await this.page.waitForSelector('#employeesTable');
        await this.page.waitForTimeout(1000);

        const tableEmployee = this.page.locator('#employeesTable');
        const rows = tableEmployee.locator('tr');
        let deletedEmployee = false;

        // Iterate over each row
        for (let i = 0; i < await rows.count(); i++){ // Start from 1 to skip the header row
            const row = rows.nth(i);
            const cells = row.locator('td');
            
            // check id cell in the current row
            for(let j = 0; j < await cells.count()-8; j++){ 
                const cell = cells.nth(j);
                const cellText = await cell.textContent();
                if (cellText == id){
                    deletedEmployee = true;
                }    
            }
        }
        await expect(deletedEmployee, 'Customer was not deleted successfully').toBeFalsy();
    }

    async checkUpdatedEmployee(id, firstname, lastname, dependants){
        await this.page.waitForTimeout(1000);

        const tableEmployee = this.page.locator('#employeesTable');
        const rows = tableEmployee.locator('tr');
        let checkFlag = false;
        let benefits = 0;
        let net = 0;

        // Iterate over each row
        for (let i = 0; i < await rows.count(); i++){ // Start from 1 to skip the header row
            const row = rows.nth(i);

            // Locate all cells in the current row
            const cells = row.locator('td');
            let count = 0;

            // Iterate over each cell in the current row
            for(let j = 0; j < await cells.count(); j++){ 
                const cell = cells.nth(j);
                const cellText = await cell.textContent();

                if (cellText == id) count++;
                else if (cellText == firstname) count++;
                else if (cellText == lastname) count++;
                else if (cellText == dependants) count ++;

                // Validate salary, Gross Pay, Benefits Cost Net Pay
                else if (count == 4){
                    if (j == 4) await expect(cellText).toBe('52000.00');
                    if (j == 5) await expect(cellText).toBe('2000.00');
                    if (j == 6) {
                        benefits = ((1000/26) + ((500/26) * dependants)).toFixed(2);
                        await expect(cellText).toBe(benefits);
                    }
                    if (j == 7) {
                        net = 2000 - benefits;
                        await expect(parseFloat(cellText)).toBe(net);
                    }
                }
                //console.log(`Row ${i + 1}, Cell ${j + 1}: ${cellText}`);
            }

            if (count == 4){
                checkFlag = true;
                break;
            }
        }

        await expect(checkFlag, 'Employee was not updated successfully').toBeTruthy();
    }

}

module.exports = {BenefitsDashboardPage};