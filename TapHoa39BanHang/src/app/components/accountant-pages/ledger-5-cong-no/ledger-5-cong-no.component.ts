import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountantService } from '../services/accountant.service';
import { Ledger5CongNo } from '../models/ledger.models';
import { LedgerTableComponent } from '../shared-components/ledger-table.component';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-5-cong-no',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-5-cong-no.component.html',
  styleUrl: './ledger-5-cong-no.component.css',
})
export class Ledger5CongNoComponent implements OnInit {
  filteredData: Ledger5CongNo[] = [];
  allData: Ledger5CongNo[] = [];
  selectedMonth: string = '';

  newRecord: Partial<Ledger5CongNo> = {
    loaiDoiTuong: 'NhaCungCap',
    phatsinhTang: 0,
    phatsinhGiam: 0,
  };

  tableColumns: any[] = [
    { key: 'ngay', label: 'Ngày', type: 'date', width: '100px' },
    { key: 'doiTuong', label: 'Đối Tượng', type: 'text', width: '150px' },
    { key: 'loaiDoiTuong', label: 'Loại', type: 'select', width: '120px', options: [
      { value: 'NhaCungCap', label: 'Nhà Cung Cấp' },
      { value: 'KhachHang', label: 'Khách Hàng' },
    ]},
    { key: 'noiDung', label: 'Nội Dung', type: 'text', width: '150px' },
    { key: 'phatsinhTang', label: 'Phát Sinh Tăng', type: 'number', width: '120px', summable: true },
    { key: 'phatsinhGiam', label: 'Phát Sinh Giảm', type: 'number', width: '120px', summable: true },
    { key: 'soDu', label: 'Số Dư', type: 'number', width: '100px', readonly: true },
    { key: 'ghiChu', label: 'Ghi Chú', type: 'text', width: '150px' },
  ];

  constructor(private accountantService: AccountantService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.accountantService.getLedger5().subscribe((data: any) => {
      this.allData = data;
      this.filteredData = [...this.allData];
    });
  }

  filterByMonth() {
    if (this.selectedMonth === '') {
      this.filteredData = [...this.allData];
      return;
    }

    this.filteredData = this.allData.filter((record) => {
      const recordMonth = this.getMonthFromDate((record.ngay as any).toString());
      return recordMonth === this.selectedMonth;
    });
  }

  getMonthFromDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  getAvailableMonths(): string[] {
    const months = new Set<string>();
    this.allData.forEach((record) => {
      const month = this.getMonthFromDate((record.ngay as any).toString());
      months.add(month);
    });
    return Array.from(months).sort().reverse();
  }

  resetFilter() {
    this.selectedMonth = '';
    this.filterByMonth();
  }

  addRecord() {
    if (!this.newRecord.ngay || !this.newRecord.doiTuong || !this.newRecord.loaiDoiTuong) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const record: Ledger5CongNo = {
      id: Date.now().toString(),
      ngay: this.newRecord.ngay as Date,
      doiTuong: this.newRecord.doiTuong || '',
      loaiDoiTuong: (this.newRecord.loaiDoiTuong as any) || 'NhaCungCap',
      noiDung: this.newRecord.noiDung || '',
      phatsinhTang: this.newRecord.phatsinhTang || 0,
      phatsinhGiam: this.newRecord.phatsinhGiam || 0,
      soDu: 0,
      hanThanhToan: this.newRecord.hanThanhToan as Date,
      ghiChu: this.newRecord.ghiChu || '',
    };

    this.accountantService.addLedger5(record);
    this.newRecord = {
      loaiDoiTuong: 'NhaCungCap',
      phatsinhTang: 0,
      phatsinhGiam: 0,
    };
    this.loadData();
  }

  updateRecord(record: Ledger5CongNo) {
    this.accountantService.updateLedger5(record.id || '', record);
  }

  deleteRecord(id: string) {
    if (confirm('Bạn chắc chắn muốn xóa?')) {
      this.accountantService.deleteLedger5(id);
    }
  }

  getTotalByType(type: 'NhaCungCap' | 'KhachHang'): string {
    const sum = this.filteredData
      .filter((r) => r.loaiDoiTuong === type)
      .reduce((acc, record) => acc + (record.phatsinhTang || 0) - (record.phatsinhGiam || 0), 0);
    return formatVND(sum);
  }
}

