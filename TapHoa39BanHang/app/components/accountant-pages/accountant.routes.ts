import { Routes } from '@angular/router';
import { AccountantLayoutComponent } from './accountant-layout.component';
import { Ledger1DoanhThuComponent } from './ledger-1-doanh-thu/ledger-1-doanh-thu.component';
import { Ledger2VatLieuComponent } from './ledger-2-vat-lieu/ledger-2-vat-lieu.component';
import { Ledger3ChiPhiComponent } from './ledger-3-chi-phi/ledger-3-chi-phi.component';
import { Ledger5LuongNhanCongComponent } from './ledger-5-luong-nhan-cong/ledger-5-luong-nhan-cong.component';
import { Ledger4NghiaVuThueComponent } from './ledger-4-nghia-vu-thue/ledger-4-nghia-vu-thue.component';
import { Ledger6QuyTienMatComponent } from './ledger-6-quy-tien-mat/ledger-6-quy-tien-mat.component';
import { Ledger7TienNganHangComponent } from './ledger-7-tien-ngan-hang/ledger-7-tien-ngan-hang.component';

/**
 * Accountant Pages Routes
 * 7 Sổ Kế Toán - Household Business Accounting System
 */
export const ACCOUNTANT_ROUTES: Routes = [
  {
    path: '',
    component: AccountantLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'ledger-1',
        pathMatch: 'full',
      },
      {
        path: 'ledger-1',
        component: Ledger1DoanhThuComponent,
      },
      {
        path: 'ledger-2',
        component: Ledger2VatLieuComponent,
      },
      {
        path: 'ledger-3',
        component: Ledger3ChiPhiComponent,
      },
      {
        path: 'ledger-4',
        component: Ledger4NghiaVuThueComponent,
      },
      {
        path: 'ledger-5',
        component: Ledger5LuongNhanCongComponent,
      },
      {
        path: 'ledger-6',
        component: Ledger6QuyTienMatComponent,
      },
      {
        path: 'ledger-7',
        component: Ledger7TienNganHangComponent,
      },
    ],
  },
];
