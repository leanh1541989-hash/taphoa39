/**
 * INTEGRATION GUIDE - Accountant Pages
 * 
 * This file explains how to integrate the 7 Sổ Kế Toán system
 * into your main Angular application.
 */

// ============================================================
// STEP 1: Update app.routes.ts
// ============================================================

/*
Add this to your app.routes.ts:

import { Routes } from '@angular/router';
import { ACCOUNTANT_ROUTES } from './components/accountant-pages/accountant.routes';

export const routes: Routes = [
  {
    path: 'accountant',
    children: ACCOUNTANT_ROUTES,
  },
  // ... rest of your routes
];

*/

// ============================================================
// STEP 2: Add navigation link to your main layout
// ============================================================

/*
In your app.component.html or main-page.component.html:

<nav>
  <!-- ... existing navigation items ... -->
  
  <a 
    routerLink="/accountant" 
    routerLinkActive="active"
    class="nav-item"
  >
    📊 Kế Toán (Accounting)
  </a>
</nav>

*/

// ============================================================
// STEP 3: Ensure TailwindCSS is configured
// ============================================================

/*
TailwindCSS should already be in your project. If not:

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

In tailwind.config.js, ensure 'src' is included:
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

*/

// ============================================================
// STEP 4: NO ADDITIONAL SETUP NEEDED
// ============================================================

/*
The following are already implemented:

✅ Standalone components (Angular 14+)
✅ No external UI library dependencies
✅ Pure TailwindCSS styling
✅ LocalStorage for persistence
✅ RxJS Observables for reactivity
✅ TypeScript with full type safety

All ledger data automatically persists in browser LocalStorage.
*/

// ============================================================
// COMPONENT EXPORTS (for reference)
// ============================================================

/*
Available components for import:

import { AccountantLayoutComponent } from './components/accountant-pages/accountant-layout.component';
import { Ledger1DoanhThuComponent } from './components/accountant-pages/ledger-1-doanh-thu/ledger-1-doanh-thu.component';
import { Ledger2VatLieuComponent } from './components/accountant-pages/ledger-2-vat-lieu/ledger-2-vat-lieu.component';
import { Ledger3ChiPhiComponent } from './components/accountant-pages/ledger-3-chi-phi/ledger-3-chi-phi.component';
import { Ledger4LuongNhanCongComponent } from './components/accountant-pages/ledger-4-luong-nhan-cong/ledger-4-luong-nhan-cong.component';
import { Ledger5CongNoComponent } from './components/accountant-pages/ledger-5-cong-no/ledger-5-cong-no.component';
import { Ledger6QuyTienMatComponent } from './components/accountant-pages/ledger-6-quy-tien-mat/ledger-6-quy-tien-mat.component';
import { Ledger7TienNganHangComponent } from './components/accountant-pages/ledger-7-tien-ngan-hang/ledger-7-tien-ngan-hang.component';
import { AccountantService } from './components/accountant-pages/services/accountant.service';
import { LedgerTableComponent } from './components/accountant-pages/shared-components/ledger-table.component';

*/

// ============================================================
// QUICK START CHECKLIST
// ============================================================

/*
□ Copy all files from accountant-pages/ to your src/app/components/
□ Update app.routes.ts with ACCOUNTANT_ROUTES import
□ Add navigation link to your main layout
□ Test: Navigate to http://localhost:4200/accountant/ledger-1
□ Verify TailwindCSS styling loads correctly
□ Add test data to each ledger
□ Check browser DevTools → Application → LocalStorage for saved data
□ Test export functionality (placeholder)
□ Verify calculations (running balances, sums)

*/

// ============================================================
// USAGE EXAMPLES
// ============================================================

/*

### Using AccountantService programmatically:

import { AccountantService } from './components/accountant-pages/services/accountant.service';
import { Ledger1DoanhThu } from './components/accountant-pages/models/ledger.models';

@Component({ ... })
export class MyComponent {
  constructor(private accountantService: AccountantService) {}

  addSale() {
    const sale: Ledger1DoanhThu = {
      ngayBan: new Date(),
      soHoaDon: 'HD001',
      hinhThucBan: 'TM',
      nhomHang: 'NuocNgot',
      doanhThuChuaVAT: 1000000,
      thueVAT: 100000,
      tongTienThanhToan: 1100000,
    };
    
    this.accountantService.addLedger1(sale);
  }

  getLedger1Data() {
    this.accountantService.getLedger1().subscribe(data => {
      console.log('Current ledger 1 data:', data);
    });
  }
}

### Using formatting utilities:

import { formatVND, formatDate } from './components/accountant-pages/services/formatting.utils';

const amount = 1500000;
console.log(formatVND(amount)); // "1.500.000 ₫"

const date = new Date(2024, 11, 19);
console.log(formatDate(date)); // "19/12/2024"

*/

// ============================================================
// TROUBLESHOOTING
// ============================================================

/*

Q: Styles not showing?
A: Ensure TailwindCSS is configured in tailwind.config.js and 
   imported in your main styles.css

Q: Data not persisting?
A: Check browser DevTools → Application → LocalStorage for 
   keys starting with "accountant_"

Q: Routes not working?
A: Verify ACCOUNTANT_ROUTES is correctly imported and 
   nested in app.routes.ts

Q: Table not editable?
A: Click "Sửa" button to enter edit mode, then "Lưu" to save

Q: How to backup data?
A: Export LocalStorage keys as JSON files through DevTools

Q: How to clear data?
A: Use "🗑️ Xóa Tất Cả" button in sidebar (with confirmation)

*/

// ============================================================
// API REFERENCE: AccountantService Methods
// ============================================================

/*

LEDGER 1 (Doanh Thu):
- getLedger1(): Observable<Ledger1DoanhThu[]>
- addLedger1(record: Ledger1DoanhThu): void
- updateLedger1(id: string, record: Partial<Ledger1DoanhThu>): void
- deleteLedger1(id: string): void

LEDGER 2 (Vật Liệu):
- getLedger2(): Observable<Ledger2VatLieu[]>
- addLedger2(record: Ledger2VatLieu): void
- updateLedger2(id: string, record: Partial<Ledger2VatLieu>): void
- deleteLedger2(id: string): void

LEDGER 3 (Chi Phí):
- getLedger3(): Observable<Ledger3ChiPhi[]>
- addLedger3(record: Ledger3ChiPhi): void
- updateLedger3(id: string, record: Partial<Ledger3ChiPhi>): void
- deleteLedger3(id: string): void

LEDGER 4A (NV Chính Thức):
- getLedger4A(): Observable<Ledger4ANhanVienChinhThuc[]>
- addLedger4A(record: Ledger4ANhanVienChinhThuc): void
- updateLedger4A(id: string, record: Partial<Ledger4ANhanVienChinhThuc>): void
- deleteLedger4A(id: string): void

LEDGER 4B (NV Khoán):
- getLedger4B(): Observable<Ledger4BNhanVienKhoan[]>
- addLedger4B(record: Ledger4BNhanVienKhoan): void
- updateLedger4B(id: string, record: Partial<Ledger4BNhanVienKhoan>): void
- deleteLedger4B(id: string): void

LEDGER 5 (Công Nợ):
- getLedger5(): Observable<Ledger5CongNo[]>
- addLedger5(record: Ledger5CongNo): void
- updateLedger5(id: string, record: Partial<Ledger5CongNo>): void
- deleteLedger5(id: string): void

LEDGER 6 (Quỹ Tiền Mặt):
- getLedger6(): Observable<Ledger6QuyTienMat[]>
- addLedger6(record: Ledger6QuyTienMat): void
- updateLedger6(id: string, record: Partial<Ledger6QuyTienMat>): void
- deleteLedger6(id: string): void

LEDGER 7 (Tiền Ngân Hàng):
- getLedger7(): Observable<Ledger7TienNganHang[]>
- addLedger7(record: Ledger7TienNganHang): void
- updateLedger7(id: string, record: Partial<Ledger7TienNganHang>): void
- deleteLedger7(id: string): void

UTILITIES:
- exportLedgerData(ledgerNumber: number): string
- clearAllData(): void

*/

export default {};
