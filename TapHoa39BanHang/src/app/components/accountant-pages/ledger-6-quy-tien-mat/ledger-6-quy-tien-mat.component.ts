import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountantService } from '../services/accountant.service';
import { Ledger6QuyTienMat } from '../models/ledger.models';
import { LedgerTableComponent } from '../shared-components/ledger-table.component';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-6-quy-tien-mat',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-6-quy-tien-mat.component.html',
  styleUrl: './ledger-6-quy-tien-mat.component.css',
})
export class Ledger6QuyTienMatComponent implements OnInit {
  filteredData: Ledger6QuyTienMat[] = [];
  allData: Ledger6QuyTienMat[] = [];
  selectedMonth: string = '';
  currentBalance: number = 0;

  newRecord: Partial<Ledger6QuyTienMat> = {
    thu: 0,
    chi: 0,
  };

  tableColumns: any[] = [
    { key: 'ngay', label: 'Ngày', type: 'date', width: '100px' },
    { key: 'noiDungThuChi', label: 'Nội Dung Thu / Chi', type: 'text', width: '200px' },
    { key: 'thu', label: 'Thu (VND)', type: 'number', width: '120px', summable: true },
    { key: 'chi', label: 'Chi (VND)', type: 'number', width: '120px', summable: true },
    { key: 'tonQuy', label: 'Tồn Quỹ (VND)', type: 'number', width: '120px', readonly: true },
    { key: 'nguoiThuChi', label: 'Người Thu / Chi', type: 'text', width: '150px' },
    { key: 'ghiChu', label: 'Ghi Chú', type: 'text', width: '150px' },
  ];

  constructor(private accountantService: AccountantService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.accountantService.getLedger6().subscribe((data: any) => {
      this.allData = data;
      this.filteredData = [...this.allData];
      this.calculateBalance();
    });
  }

  calculateBalance() {
    let balance = 0;
    this.filteredData.forEach((record) => {
      balance += (record.thu || 0) - (record.chi || 0);
    });
    this.currentBalance = balance;
  }

  filterByMonth() {
    if (this.selectedMonth === '') {
      this.filteredData = [...this.allData];
      this.calculateBalance();
      return;
    }

    this.filteredData = this.allData.filter((record) => {
      const recordMonth = this.getMonthFromDate((record.ngay as any).toString());
      return recordMonth === this.selectedMonth;
    });
    this.calculateBalance();
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
    if (!this.newRecord.ngay || !this.newRecord.noiDungThuChi) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const record: Ledger6QuyTienMat = {
      id: Date.now().toString(),
      ngay: this.newRecord.ngay as Date,
      noiDungThuChi: this.newRecord.noiDungThuChi || '',
      thu: this.newRecord.thu || 0,
      chi: this.newRecord.chi || 0,
      tonQuy: 0,
      nguoiThuChi: this.newRecord.nguoiThuChi || '',
      ghiChu: this.newRecord.ghiChu || '',
    };

    this.accountantService.addLedger6(record);
    this.newRecord = {
      thu: 0,
      chi: 0,
    };
    this.loadData();
  }

  updateRecord(record: Ledger6QuyTienMat) {
    this.accountantService.updateLedger6(record.id || '', record);
  }

  deleteRecord(id: string) {
    if (confirm('Bạn chắc chắn muốn xóa?')) {
      this.accountantService.deleteLedger6(id);
    }
  }

  sumThu(): string {
    const sum = this.filteredData.reduce((acc, record) => acc + (record.thu || 0), 0);
    return formatVND(sum);
  }

  sumChi(): string {
    const sum = this.filteredData.reduce((acc, record) => acc + (record.chi || 0), 0);
    return formatVND(sum);
  }

  getCurrentBalance(): number {
    return this.currentBalance;
  }

  formatBalance(): string {
    const balance = this.getCurrentBalance();
    return formatVND(Math.abs(balance)) + (balance < 0 ? ' (âm)' : '');
  }
}

      
