import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountantService } from '../services/accountant.service';
import { Ledger4ANhanVienChinhThuc, Ledger4BNhanVienKhoan } from '../models/ledger.models';
import { LedgerTableComponent } from '../shared-components/ledger-table.component';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-4-luong-nhan-cong',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-4-luong-nhan-cong.component.html',
  styleUrl: './ledger-4-luong-nhan-cong.component.css',
})
export class Ledger4LuongNhanCongComponent implements OnInit {
  filteredDataA: Ledger4ANhanVienChinhThuc[] = [];
  filteredDataB: Ledger4BNhanVienKhoan[] = [];
  allDataA: Ledger4ANhanVienChinhThuc[] = [];
  allDataB: Ledger4BNhanVienKhoan[] = [];
  selectedMonth: string = '';
  activeTab: 'a' | 'b' = 'a';

  newRecordA: Partial<Ledger4ANhanVienChinhThuc> = {
    hinhThucTra: 'TM',
    luongCoBan: 0,
    phuCap: 0,
    bhxhNLD: 0,
    bhxhChuHo: 0,
  };

  newRecordB: Partial<Ledger4BNhanVienKhoan> = {
    soTienKhoan: 0,
    thueTNCNKhauTru: 0,
  };

  tableColumnsA: any[] = [
    { key: 'thang', label: 'Tháng', type: 'text', width: '80px' },
    { key: 'hoTen', label: 'Họ Tên', type: 'text', width: '120px' },
    { key: 'luongCoBan', label: 'Lương Cơ Bản', type: 'number', width: '120px', summable: true },
    { key: 'phuCap', label: 'Phụ Cấp', type: 'number', width: '100px' },
    { key: 'tongLuong', label: 'Tổng Lương', type: 'number', width: '100px', readonly: true, summable: true },
    { key: 'bhxhNLD', label: 'BHXH NLD', type: 'number', width: '100px' },
    { key: 'bhxhChuHo', label: 'BHXH Chủ Hộ', type: 'number', width: '100px' },
    { key: 'thucLinh', label: 'Thực Lĩnh', type: 'number', width: '100px', readonly: true, summable: true },
    { key: 'hinhThucTra', label: 'Hình Thức', type: 'select', width: '100px', options: [
      { value: 'TM', label: 'Tiền Mặt' },
      { value: 'CK', label: 'Chuyển Khoản' },
    ]},
  ];

  tableColumnsB: any[] = [
    { key: 'ngayChi', label: 'Ngày Chi', type: 'date', width: '100px' },
    { key: 'hoTen', label: 'Họ Tên', type: 'text', width: '120px' },
    { key: 'congViecKhoan', label: 'Công Việc', type: 'text', width: '150px' },
    { key: 'soTienKhoan', label: 'Số Tiền', type: 'number', width: '120px', summable: true },
    { key: 'soCMND_CCCD', label: 'CMND/CCCD', type: 'text', width: '120px' },
    { key: 'thueTNCNKhauTru', label: 'Thuế TNCN', type: 'number', width: '100px' },
    { key: 'soTienThucTra', label: 'Thực Trả', type: 'number', width: '100px', readonly: true, summable: true },
  ];

  constructor(private accountantService: AccountantService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.accountantService.getLedger4A().subscribe((data: any) => {
      this.allDataA = data;
      this.filteredDataA = [...this.allDataA];
    });

    this.accountantService.getLedger4B().subscribe((data: any) => {
      this.allDataB = data;
      this.filteredDataB = [...this.allDataB];
    });
  }

  filterByMonth() {
    if (this.selectedMonth === '') {
      this.filteredDataA = [...this.allDataA];
      this.filteredDataB = [...this.allDataB];
      return;
    }

    // For Tab A (Monthly payroll)
    this.filteredDataA = this.allDataA.filter((record) => record.thang === this.selectedMonth);

    // For Tab B (Per transaction)
    this.filteredDataB = this.allDataB.filter((record) => {
      const recordMonth = this.getMonthFromDate((record.ngayChi as any).toString());
      return recordMonth === this.selectedMonth;
    });
  }

  getMonthFromDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  getAvailableMonths(): string[] {
    const months = new Set<string>();
    this.allDataA.forEach((record) => {
      months.add(record.thang);
    });
    this.allDataB.forEach((record) => {
      const month = this.getMonthFromDate((record.ngayChi as any).toString());
      months.add(month);
    });
    return Array.from(months).sort().reverse();
  }

  resetFilter() {
    this.selectedMonth = '';
    this.filterByMonth();
  }

  addRecordA() {
    if (!this.newRecordA.thang || !this.newRecordA.hoTen || !this.newRecordA.luongCoBan) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const record: Ledger4ANhanVienChinhThuc = {
      id: Date.now().toString(),
      thang: this.newRecordA.thang || '',
      hoTen: this.newRecordA.hoTen || '',
      luongCoBan: this.newRecordA.luongCoBan || 0,
      phuCap: this.newRecordA.phuCap || 0,
      tongLuong: (this.newRecordA.luongCoBan || 0) + (this.newRecordA.phuCap || 0),
      bhxhNLD: this.newRecordA.bhxhNLD || 0,
      bhxhChuHo: this.newRecordA.bhxhChuHo || 0,
      thucLinh: (this.newRecordA.luongCoBan || 0) + (this.newRecordA.phuCap || 0) - (this.newRecordA.bhxhNLD || 0) - (this.newRecordA.bhxhChuHo || 0),
      hinhThucTra: (this.newRecordA.hinhThucTra as any) || 'TM',
      kyNhan: false,
    };

    this.accountantService.addLedger4A(record);
    this.newRecordA = {
      hinhThucTra: 'TM',
      luongCoBan: 0,
      phuCap: 0,
      bhxhNLD: 0,
      bhxhChuHo: 0,
    };
    this.loadData();
  }

  addRecordB() {
    if (!this.newRecordB.ngayChi || !this.newRecordB.hoTen || !this.newRecordB.soTienKhoan) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const record: Ledger4BNhanVienKhoan = {
      id: Date.now().toString(),
      ngayChi: this.newRecordB.ngayChi as Date,
      hoTen: this.newRecordB.hoTen || '',
      congViecKhoan: this.newRecordB.congViecKhoan || '',
      soTienKhoan: this.newRecordB.soTienKhoan || 0,
      soCMND_CCCD: this.newRecordB.soCMND_CCCD || '',
      camKet08: this.newRecordB.camKet08 || false,
      thueTNCNKhauTru: (this.newRecordB.soTienKhoan || 0) >= 2000000 ? (this.newRecordB.thueTNCNKhauTru || 0) : 0,
      soTienThucTra: (this.newRecordB.soTienKhoan || 0) - ((this.newRecordB.soTienKhoan || 0) >= 2000000 ? (this.newRecordB.thueTNCNKhauTru || 0) : 0),
      kyNhan: false,
    };

    this.accountantService.addLedger4B(record);
    this.newRecordB = {
      soTienKhoan: 0,
      thueTNCNKhauTru: 0,
    };
    this.loadData();
  }

  updateRecordA(record: Ledger4ANhanVienChinhThuc) {
    this.accountantService.updateLedger4A(record.id || '', record);
  }

  updateRecordB(record: Ledger4BNhanVienKhoan) {
    this.accountantService.updateLedger4B(record.id || '', record);
  }

  deleteRecordA(id: string) {
    if (confirm('Bạn chắc chắn muốn xóa?')) {
      this.accountantService.deleteLedger4A(id);
    }
  }

  deleteRecordB(id: string) {
    if (confirm('Bạn chắc chắn muốn xóa?')) {
      this.accountantService.deleteLedger4B(id);
    }
  }

  sumLuongA(): string {
    const sum = this.filteredDataA.reduce((acc, record) => acc + (record.tongLuong || 0), 0);
    return formatVND(sum);
  }

  sumBHXHA(): string {
    const sum = this.filteredDataA.reduce((acc, record) => acc + ((record.bhxhNLD || 0) + (record.bhxhChuHo || 0)), 0);
    return formatVND(sum);
  }

  sumKhoanB(): string {
    const sum = this.filteredDataB.reduce((acc, record) => acc + (record.soTienKhoan || 0), 0);
    return formatVND(sum);
  }
}
