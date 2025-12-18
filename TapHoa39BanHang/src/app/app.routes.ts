import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { EditProductPageRefactoredComponent } from './components/edit-product-page/edit-product-page-refactored.component';
import { WorkSchedulePageComponent } from './components/work-schedule-page/work-schedule-page.component';
import { AttendancePageComponent } from './components/attendance-page/attendance-page.component';
import { EmployeeListPageComponent } from './components/employee-list-page/employee-list-page.component';
import { PayrollPageComponent } from './components/payroll-page/payroll-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'home', component: MainPageComponent },
    { path: 'edit-product-page', component: EditProductPageRefactoredComponent },
    { path: 'work-schedule', component: WorkSchedulePageComponent },
    { path: 'attendance', component: AttendancePageComponent },
    { path: 'employee-list', component: EmployeeListPageComponent },
    { path: 'payroll', component: PayrollPageComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];