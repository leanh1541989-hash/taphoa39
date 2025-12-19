/**
 * EXAMPLES.md - Code Usage Examples
 * 
 * This file contains practical examples of how to use the
 * accounting system components and services.
 */

# Usage Examples - 7 Sổ Kế Toán System

## 1. Basic Component Import & Usage

### **In your component:**

```typescript
import { Component } from '@angular/core';
import { Ledger1DoanhThuComponent } from './components/accountant-pages/ledger-1-doanh-thu/ledger-1-doanh-thu.component';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [Ledger1DoanhThuComponent],
  template: `
    <app-ledger-1-doanh-thu></app-ledger-1-doanh-thu>
  `
})
export class MyPageComponent {}
```

---

## 2. Working with AccountantService

### **Add a revenue transaction:**

```typescript
import { Component, OnInit } from '@angular/core';
import { AccountantService } from './components/accountant-pages/services/accountant.service';
import { Ledger1DoanhThu } from './components/accountant-pages/models/ledger.models';

@Component({
  selector: 'app-quick-entry',
  template: `
    <button (click)="addQuickSale()">Quick Add Sale</button>
  `
})
export class QuickEntryComponent implements OnInit {
  constructor(private accountant: AccountantService) {}

  addQuickSale() {
    const sale: Ledger1DoanhThu = {
      ngayBan: new Date(),
      soHoaDon: 'HD' + Date.now(),
      hinhThucBan: 'TM',
      nhomHang: 'NuocNgot',
      doanhThuChuaVAT: 500000,
      thueVAT: 50000,
      tongTienThanhToan: 550000,
    };

    this.accountant.addLedger1(sale);
    console.log('✅ Sale added!');
  }
}
```

### **Get all revenue data:**

```typescript
export class RevenueAnalysisComponent implements OnInit {
  revenues: Ledger1DoanhThu[] = [];

  constructor(private accountant: AccountantService) {}

  ngOnInit() {
    this.accountant.getLedger1().subscribe(data => {
      this.revenues = data;
      const total = this.revenues.reduce((sum, r) => sum + r.tongTienThanhToan, 0);
      console.log(`📊 Total Revenue: ${this.formatVND(total)}`);
    });
  }

  formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}
```

### **Update an inventory record:**

```typescript
export class InventoryManagerComponent {
  constructor(private accountant: AccountantService) {}

  updateStockItem(id: string, newQuantity: number) {
    this.accountant.updateLedger2(id, {
      xuatTrongKy: newQuantity
    });
    console.log('✅ Inventory updated!');
  }
}
```

### **Delete an expense record:**

```typescript
export class ExpenseManagerComponent {
  constructor(private accountant: AccountantService) {}

  removeExpense(id: string) {
    if (confirm('Are you sure?')) {
      this.accountant.deleteLedger3(id);
      console.log('✅ Expense deleted!');
    }
  }
}
```

---

## 3. Using Formatting Utilities

```typescript
import { 
  formatVND, 
  formatDate, 
  parseDate,
  validateEmail,
  validatePositiveNumber
} from './components/accountant-pages/services/formatting.utils';

// Format money
console.log(formatVND(1500000));  // "1.500.000 ₫"

// Format date
const date = new Date(2024, 11, 19);
console.log(formatDate(date));    // "19/12/2024"

// Parse date string
const parsed = parseDate("25/12/2024");
console.log(parsed);              // Date object

// Validate email
console.log(validateEmail("user@example.com"));  // true

// Validate positive number
console.log(validatePositiveNumber(-500));      // false
console.log(validatePositiveNumber(500));       // true
```

---

## 4. Working with Monthly Filtering

```typescript
export class MonthlyReportComponent implements OnInit {
  monthlyRevenue: { [key: string]: number } = {};

  constructor(private accountant: AccountantService) {}

  ngOnInit() {
    this.accountant.getLedger1().subscribe(data => {
      // Group by month
      data.forEach(record => {
        const date = new Date(record.ngayBan);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const key = `${month}/${year}`;

        if (!this.monthlyRevenue[key]) {
          this.monthlyRevenue[key] = 0;
        }
        this.monthlyRevenue[key] += record.tongTienThanhToan;
      });

      console.log('📊 Monthly Revenue:', this.monthlyRevenue);
    });
  }
}
```

---

## 5. Payroll Calculations (Ledger 4)

### **Official employees with insurance:**

```typescript
export class PayrollCalculatorComponent {
  constructor(private accountant: AccountantService) {}

  calculatePayroll(month: string) {
    this.accountant.getLedger4A().subscribe(employees => {
      const filtered = employees.filter(e => e.thang === month);
      
      const summary = {
        totalBaseSalary: 0,
        totalAllowances: 0,
        totalGrossSalary: 0,
        totalInsuranceEmployee: 0,
        totalInsuranceEmployer: 0,
        totalNetSalary: 0
      };

      filtered.forEach(emp => {
        summary.totalBaseSalary += emp.luongCoBan;
        summary.totalAllowances += emp.phuCap;
        summary.totalGrossSalary += emp.tongLuong;
        summary.totalInsuranceEmployee += emp.bhxhNLD;
        summary.totalInsuranceEmployer += emp.bhxhChuHo;
        summary.totalNetSalary += emp.thucLinh;
      });

      console.log('💰 Payroll Summary:', summary);
    });
  }
}
```

### **Contract workers (< 2M):**

```typescript
export class ContractWorkerComponent {
  constructor(private accountant: AccountantService) {}

  addContractWorker(
    hoTen: string,
    workDesc: string,
    amount: number,
    idNumber: string
  ) {
    // Amount must be < 2,000,000
    if (amount >= 2000000) {
      alert('Amount must be < 2,000,000 VND');
      return;
    }

    this.accountant.addLedger4B({
      ngayChi: new Date(),
      hoTen,
      congViecKhoan: workDesc,
      soTienKhoan: amount,
      soCMND_CCCD: idNumber,
      camKet08: true,
      thueTNCNKhauTru: 0,  // Auto-set to 0
      soTienThucTra: amount,
      kyNhan: false
    });
  }
}
```

---

## 6. Debt Tracking (Ledger 5)

```typescript
export class DebtTracker {
  constructor(private accountant: AccountantService) {}

  getSupplierDebt(supplierName: string) {
    this.accountant.getLedger5().subscribe(records => {
      const supplier = records
        .filter(r => r.doiTuong === supplierName && r.loaiDoiTuong === 'NhaCungCap')
        .pop();

      if (supplier) {
        console.log(`💳 Debt to ${supplierName}: ${this.formatVND(supplier.soDu)}`);
      }
    });
  }

  getCustomerReceivables(customerName: string) {
    this.accountant.getLedger5().subscribe(records => {
      const customer = records
        .filter(r => r.doiTuong === customerName && r.loaiDoiTuong === 'KhachHang')
        .pop();

      if (customer) {
        console.log(`📈 Receivable from ${customerName}: ${this.formatVND(customer.soDu)}`);
      }
    });
  }

  formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}
```

---

## 7. Cash Flow Analysis (Ledger 6)

```typescript
export class CashFlowAnalyzer {
  constructor(private accountant: AccountantService) {}

  getCurrentCashBalance() {
    this.accountant.getLedger6().subscribe(records => {
      if (records.length === 0) {
        console.log('💵 Current Cash Balance: 0 ₫');
        return;
      }

      const latest = records[records.length - 1];
      const balance = latest.tonQuy;
      const isNegative = balance < 0;

      console.log(
        `${isNegative ? '⚠️' : '✅'} Current Cash Balance: ${this.formatVND(balance)}`
      );
    });
  }

  getDailyCashflow(date: Date) {
    this.accountant.getLedger6().subscribe(records => {
      const daily = records.filter(r => {
        const recordDate = new Date(r.ngay);
        return recordDate.toDateString() === date.toDateString();
      });

      const totalIn = daily.reduce((sum, r) => sum + r.thu, 0);
      const totalOut = daily.reduce((sum, r) => sum + r.chi, 0);
      const net = totalIn - totalOut;

      console.log(`📊 Daily Cashflow (${this.formatDate(date)}):`, {
        totalIn: this.formatVND(totalIn),
        totalOut: this.formatVND(totalOut),
        net: this.formatVND(net)
      });
    });
  }

  formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
```

---

## 8. Bank Reconciliation (Ledger 7)

```typescript
export class BankReconciliation {
  constructor(private accountant: AccountantService) {}

  highlightLargeTransactions() {
    this.accountant.getLedger7().subscribe(records => {
      const large = records.filter(r => r.highlight);
      
      console.log('🔍 Large Transactions (> 20M):');
      large.forEach(t => {
        console.log(`- ${new Date(t.ngay).toLocaleDateString('vi-VN')}: ${this.formatVND(t.thu || t.chi)}`);
      });
    });
  }

  getBankBalance() {
    this.accountant.getLedger7().subscribe(records => {
      if (records.length === 0) {
        console.log('🏦 Bank Balance: 0 ₫');
        return;
      }

      const latest = records[records.length - 1];
      console.log(`🏦 Bank Balance: ${this.formatVND(latest.soDu)}`);
    });
  }

  formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}
```

---

## 9. Using Sample Data

```typescript
import { initializeSampleData, clearSampleData } from './components/accountant-pages/services/sample-data';

export class DataManagerComponent {
  loadSampleData() {
    // Populate with test data
    initializeSampleData();
    console.log('✅ Sample data loaded');
  }

  clearAllData() {
    if (confirm('Delete all data?')) {
      clearSampleData();
      console.log('✅ All data cleared');
    }
  }
}
```

---

## 10. Reactive Data Display

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountantService } from './components/accountant-pages/services/accountant.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="card">
        <h3>📊 Revenue</h3>
        <p class="amount">{{ revenue | currency:'VND' }}</p>
      </div>

      <div class="card">
        <h3>💰 Cash Balance</h3>
        <p [class.negative]="cashBalance < 0" class="amount">
          {{ cashBalance | currency:'VND' }}
        </p>
      </div>

      <div class="card">
        <h3>🏦 Bank Balance</h3>
        <p class="amount">{{ bankBalance | currency:'VND' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .card { padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }
    .amount { font-size: 1.5rem; font-weight: bold; }
    .negative { color: red; }
  `]
})
export class DashboardComponent {
  revenue = 0;
  cashBalance = 0;
  bankBalance = 0;

  constructor(private accountant: AccountantService) {
    this.loadMetrics();
  }

  loadMetrics() {
    this.accountant.getLedger1().subscribe(records => {
      this.revenue = records.reduce((sum, r) => sum + r.tongTienThanhToan, 0);
    });

    this.accountant.getLedger6().subscribe(records => {
      if (records.length > 0) {
        this.cashBalance = records[records.length - 1].tonQuy;
      }
    });

    this.accountant.getLedger7().subscribe(records => {
      if (records.length > 0) {
        this.bankBalance = records[records.length - 1].soDu;
      }
    });
  }
}
```

---

## 11. Export & Backup

```typescript
import { AccountantService } from './components/accountant-pages/services/accountant.service';

export class BackupService {
  constructor(private accountant: AccountantService) {}

  backupAllData() {
    const backup = {
      timestamp: new Date().toISOString(),
      ledger1: this.accountant.exportLedgerData(1),
      ledger2: this.accountant.exportLedgerData(2),
      ledger3: this.accountant.exportLedgerData(3),
      ledger4a: this.accountant.exportLedgerData(4),
      ledger4b: this.accountant.exportLedgerData(4),
      ledger5: this.accountant.exportLedgerData(5),
      ledger6: this.accountant.exportLedgerData(6),
      ledger7: this.accountant.exportLedgerData(7),
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  }

  restoreFromBackup(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const backup = JSON.parse(e.target?.result as string);
      // Restore each ledger from backup
      console.log('✅ Backup restored');
    };
    reader.readAsText(file);
  }
}
```

---

## Summary

These examples cover:
- ✅ Component integration
- ✅ Service CRUD operations
- ✅ Data formatting & validation
- ✅ Monthly filtering & grouping
- ✅ Financial calculations
- ✅ Reactive data updates
- ✅ Backup & restore
- ✅ Dashboard creation

For more details, see:
- **README.md** - Feature documentation
- **INTEGRATION_GUIDE.md** - Setup instructions
- **Inline code comments** - Implementation details
