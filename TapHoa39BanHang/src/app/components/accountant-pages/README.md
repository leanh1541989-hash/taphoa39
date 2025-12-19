# 7 Sổ Kế Toán - Vietnamese Household Business Accounting System

## Overview

A complete front-end accounting application for Vietnamese household businesses (Hộ Kinh Doanh) compliant with **Circular 88/2021/TT-BTC**. This system implements the 7 essential accounting ledgers required for tax compliance and daily business management.

**Tech Stack:**
- Angular 20 (Standalone Components)
- TypeScript
- TailwindCSS
- LocalStorage (no backend required)
- RxJS Observables

---

## 7 Ledgers (7 Sổ Kế Toán)

### 1. **Sổ Chi Tiết Doanh Thu** (Revenue Ledger)
**Purpose:** Track all sales from retail operations (point-of-sale invoices)

| Column | Type | Notes |
|--------|------|-------|
| Ngày Bán | Date | Sale date |
| Số Hóa Đơn | Text | Invoice number |
| Hình Thức Bán | Select | Cash / Bank Transfer |
| Nhóm Hàng | Select | Product category (Beverages, Snacks, Essentials, Other) |
| Doanh Thu Chưa VAT | Number | Revenue before tax |
| Thuế VAT | Number | VAT amount |
| Tổng Tiền Thanh Toán | Auto | = Revenue + VAT |
| Ghi Chú | Text | Notes |

**Key Features:**
- ✅ Monthly filtering
- ✅ Auto-calculated totals
- ✅ Summary statistics (total invoices, revenue, payment)
- ✅ Vietnamese currency formatting

---

### 2. **Sổ Chi Tiết Vật Liệu – Hàng Hóa** (Inventory Ledger)
**Purpose:** Track inventory movements (purchases, sales, loss/damage)

| Column | Type | Notes |
|--------|------|-------|
| Ngày | Date | Record date |
| Tên Hàng | Text | Product name / category |
| Đơn Vị Tính | Text | Unit (pieces, kg, bags, etc.) |
| Tồn Đầu Kỳ | Number | Beginning balance |
| Nhập Trong Kỳ | Number | Purchases |
| Xuất Trong Kỳ | Number | Sales |
| Hao Hụt / Hủy | Number | Loss/damage |
| Tồn Cuối Kỳ | Auto | = Beginning + Purchases - Sales - Loss |
| Ghi Chú | Text | Notes |

**Key Features:**
- ✅ NO FIFO/LIFO (simple balance tracking)
- ✅ Auto-calculated ending balance
- ✅ Product grouping support
- ✅ Monthly filtering

---

### 3. **Sổ Chi Phí Sản Xuất Kinh Doanh** (Expense Ledger)
**Purpose:** Record all business operating expenses

| Column | Type | Notes |
|--------|------|-------|
| Ngày Chi | Date | Expense date |
| Nội Dung Chi | Text | Expense description |
| Loại Chi Phí | Select | Cost of Goods / Labor / Rent / Utilities / Transport / Other |
| Số Tiền Chưa VAT | Number | Amount before VAT |
| VAT Được Khấu Trừ | Number | VAT deductible |
| Tổng Tiền | Auto | = Amount + VAT |
| Hình Thức Thanh Toán | Select | Cash / Bank Transfer |
| Chứng Từ Kèm Theo | Text | Supporting document reference |
| Ghi Chú | Text | Notes |

**Key Features:**
- ✅ Expense categorization for tax compliance
- ✅ VAT deduction tracking
- ✅ Supporting document linking
- ✅ Payment method tracking

---

### 4. **Sổ Theo Dõi Tiền Lương & Nhân Công** (Payroll Ledger)
**Two sections:**

#### 4A. **Nhân Viên Chính Thức (Đóng BHXH)** - Official Employees

| Column | Type | Notes |
|--------|------|-------|
| Tháng | Text | MM/yyyy |
| Họ Tên | Text | Employee name |
| Lương Cơ Bản | Number | Base salary |
| Phụ Cấp | Number | Allowances |
| Tổng Lương | Auto | = Base + Allowances |
| BHXH NLĐ | Number | Employee social insurance |
| BHXH Chủ Hộ | Number | Employer social insurance |
| Thực Lĩnh | Auto | = Total - Insurance |
| Hình Thức Trả | Select | Cash / Bank |
| Ký Nhận | Checkbox | Signed |

#### 4B. **Nhân Viên Khoán (<2M/lần)** - Contract Workers

| Column | Type | Notes |
|--------|------|-------|
| Ngày Chi | Date | Payment date |
| Họ Tên | Text | Worker name |
| Công Việc Khoán | Text | Work description |
| Số Tiền Khoán | Number | Contract amount (< 2,000,000 VND) |
| Số CMND/CCCD | Text | ID number |
| Cam Kết 08 | Checkbox | Commitment 08 (required) |
| Thuế TNCN Khấu Trừ | Number | Personal income tax (auto 0 if < 2M) |
| Số Tiền Thực Trả | Auto | = Amount - Tax |
| Ký Nhận | Checkbox | Signed |

**Key Features:**
- ✅ Two separate employee categories
- ✅ Automatic tax calculation for contract workers
- ✅ Social insurance deductions
- ✅ Tab-based UI for organization

---

### 5. **Sổ Theo Dõi Tình Hình Thanh Toán (Công Nợ)** (Payables/Receivables Ledger)
**Purpose:** Track debt with suppliers and customers

| Column | Type | Notes |
|--------|------|-------|
| Ngày | Date | Transaction date |
| Đối Tượng | Text | Counterparty name |
| Loại Đối Tượng | Select | Supplier / Customer |
| Nội Dung | Text | Description |
| Phát Sinh Tăng | Number | New debt incurred |
| Phát Sinh Giảm | Number | Debt repaid |
| Số Dư | Auto | Running balance |
| Hạn Thanh Toán | Date | Payment deadline |
| Ghi Chú | Text | Notes |

**Key Features:**
- ✅ Running balance calculation
- ✅ Separate tracking by supplier/customer
- ✅ Payment deadline tracking
- ✅ Running balance summary by type

---

### 6. **Sổ Quỹ Tiền Mặt** (Cash Fund Ledger)
**Purpose:** Daily cash in/out tracking

| Column | Type | Notes |
|--------|------|-------|
| Ngày | Date | Transaction date |
| Nội Dung Thu/Chi | Text | Description |
| Thu | Number | Cash in |
| Chi | Number | Cash out |
| Tồn Quỹ | Auto | Running balance |
| Người Thu/Chi | Text | Person responsible |
| Ghi Chú | Text | Notes |

**Key Features:**
- ✅ Running balance calculation
- ⚠️ **Negative balance warning** (red alert)
- ✅ Current balance display with color coding
- ✅ Daily cash flow tracking

---

### 7. **Sổ Tiền Gửi Ngân Hàng** (Bank Statement Ledger)
**Purpose:** Bank transactions mirroring bank statements

| Column | Type | Notes |
|--------|------|-------|
| Ngày | Date | Transaction date |
| Số Chứng Từ | Text | Reference number |
| Nội Dung Giao Dịch | Text | Transaction description |
| Thu | Number | Deposits |
| Chi | Number | Withdrawals |
| Số Dư | Auto | Running balance |
| Đối Tượng Liên Quan | Text | Counterparty |
| Ghi Chú | Text | Notes |

**Key Features:**
- ✅ Running balance calculation
- ✅ **Highlight transactions > 20M VND** (yellow row)
- ✅ Bank statement style formatting
- ✅ Reference tracking

---

## Project Structure

```
accountant-pages/
├── models/
│   └── ledger.models.ts          # TypeScript interfaces for all 7 ledgers
├── services/
│   ├── accountant.service.ts      # Main service (CRUD + LocalStorage)
│   └── formatting.utils.ts        # Date, currency, validation utilities
├── shared-components/
│   └── ledger-table.component.ts  # Reusable table (inline edit, delete)
├── ledger-1-doanh-thu/
│   └── ledger-1-doanh-thu.component.ts
├── ledger-2-vat-lieu/
│   └── ledger-2-vat-lieu.component.ts
├── ledger-3-chi-phi/
│   └── ledger-3-chi-phi.component.ts
├── ledger-4-luong-nhan-cong/
│   └── ledger-4-luong-nhan-cong.component.ts
├── ledger-5-cong-no/
│   └── ledger-5-cong-no.component.ts
├── ledger-6-quy-tien-mat/
│   └── ledger-6-quy-tien-mat.component.ts
├── ledger-7-tien-ngan-hang/
│   └── ledger-7-tien-ngan-hang.component.ts
├── accountant-layout.component.ts # Main layout + sidebar navigation
└── accountant.routes.ts           # Routing configuration
```

---

## Features

### 🎨 **UI/UX Design**
- **Sidebar Navigation** - 7 ledgers in left panel + tools
- **Form-Based Entry** - Add records with required field validation
- **Inline Editing** - Click "Sửa" to edit any row
- **Month Filtering** - Filter by MM/yyyy (where applicable)
- **Auto-Calculations** - Totals, balances, auto-computed columns
- **Summary Stats** - Key metrics displayed as cards
- **Excel-like Table** - Professional, accountant-friendly layout
- **Color Coding** - Status indicators (negatives in red, large transactions in yellow)

### 💾 **Data Persistence**
- **LocalStorage** - All data saved automatically
- **No Backend** - Standalone client-side application
- **JSON Export** - Export functionality (placeholder)

### ✅ **Input Validation**
- Required fields marked with `*`
- Number validation (positive only)
- Date format: dd/MM/yyyy
- Email validation (where needed)
- ID number validation (9 or 12 digits)
- Tax rule enforcement (< 2M subsidy limit)

### 🔢 **Financial Calculations**
- **Auto-Sum Footers** - Sum all numeric columns
- **Running Balances** - Ledgers 5, 6, 7
- **Tax Calculations** - Ledger 4B (TNCN)
- **Currency Formatting** - All amounts in VND with separators

---

## Usage

### **Integration into Main App**

1. **Add route in `app.routes.ts`:**

```typescript
import { ACCOUNTANT_ROUTES } from './components/accountant-pages/accountant.routes';

export const routes: Routes = [
  // ... other routes
  {
    path: 'accountant',
    children: ACCOUNTANT_ROUTES,
  },
  // ... other routes
];
```

2. **Add navigation link in your main layout:**

```html
<a routerLink="/accountant" class="nav-link">
  📊 Kế Toán (Accounting)
</a>
```

3. **Access in browser:**
```
http://localhost:4200/accountant/ledger-1
http://localhost:4200/accountant/ledger-2
... etc
```

### **Adding a New Record**

1. Fill in form fields (required fields marked `*`)
2. Click "Thêm [Ledger Name]"
3. Data saved to browser LocalStorage
4. Row appears in table below

### **Editing a Record**

1. Click "Sửa" button on any row
2. Form becomes editable
3. Click "Lưu" to save or "Hủy" to discard changes

### **Deleting a Record**

1. Click "Xóa" button on any row
2. Confirm deletion (cannot be undone)
3. Row removed, balances recalculated

---

## Styling

**TailwindCSS Classes Used:**
- `bg-gray-*` - Neutral backgrounds
- `bg-blue-50` / `bg-red-50` - Semantic backgrounds
- `text-2xl font-bold` - Headers
- `px-3 py-2 border` - Form inputs
- `rounded-lg hover:bg-*` - Buttons
- `border-2 border-*` - Highlights

**Color Scheme:**
- **Gray** (Ledger 1) - Revenue
- **Red** (Ledger 6) - Negative cash warning
- **Yellow** (Ledger 7) - Large transactions > 20M
- **Blue** - Summaries & highlights

---

## Compliance

✅ **Circular 88/2021/TT-BTC Compliant**
- No enterprise accounting concepts
- Simple FIFO/LIFO
- Tax-friendly layout
- Supporting document linking
- Monthly organization
- Vietnamese naming & formatting

❌ **NOT Included:**
- Chart of accounts (enterprise feature)
- Debit/credit double-entry
- Depreciation calculations
- Intercompany transactions

---

## Browser Storage

Data is stored in browser LocalStorage with keys:
```
accountant_ledger1  // Doanh thu
accountant_ledger2  // Vật liệu
accountant_ledger3  // Chi phí
accountant_ledger4a // NV chính thức
accountant_ledger4b // NV khoán
accountant_ledger5  // Công nợ
accountant_ledger6  // Quỹ tiền mặt
accountant_ledger7  // Tiền ngân hàng
```

**To backup data:**
1. Open browser DevTools → Application → LocalStorage
2. Export each key as JSON
3. Save to file

**To clear data:**
1. Click "🗑️ Xóa Tất Cả" in sidebar (with confirmation)
2. Or manually delete keys in DevTools

---

## Future Enhancements

- 📊 PDF export functionality
- ☁️ Cloud sync (Firebase, etc.)
- 📱 Mobile responsiveness improvements
- 📈 Financial dashboard/KPI charts
- 🔍 Advanced filtering & search
- 👥 Multi-user support with authentication
- 🗂️ Category/template management
- ⚙️ Settings & customization

---

## Support & Documentation

**Accounting Circular:** Circular 88/2021/TT-BTC
**Business Type:** Hộ Kinh Doanh (Household Business)
**Region:** Vietnam
**Tax Year:** Compatible with current Vietnamese tax calendar

---

## License

Part of TapHoa39 BanHang Management System
