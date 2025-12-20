/**
 * S6-HKD: SỔ QUỸ TIỀN MẶT
 * Circular 88/2021/TT-BTC - Appendix 2 - Mẫu số S6-HKD
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LedgerTableComponent, HeaderCell, DataColumn, FooterRow } from '../shared-components/ledger-table.component';
import { S6_QuyTienMat } from '../models/ledger.models';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-6-quy-tien-mat',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-6-quy-tien-mat.component.html',
  styleUrl: './ledger-6-quy-tien-mat.component.css',
})
export class Ledger6QuyTienMatComponent implements OnInit {
  // Data
  data: S6_QuyTienMat[] = [];

  // New record form
  newRecord: Partial<S6_QuyTienMat> = this.getEmptyRecord();

  // Opening balance
  soDuDauKy: number = 0;

  // Table header configuration (multi-row as per Circular 88)
  headerRows: HeaderCell[][] = [
    // Row 1
    [
      { label: 'Ngày, tháng ghi sổ', rowspan: 2, class: 'date-col' },
      { label: 'Ngày, tháng chứng từ', rowspan: 2, class: 'date-col' },
      { label: 'Số hiệu chứng từ', rowspan: 2, class: 'chungtu-col' },
      { label: 'Diễn giải', rowspan: 2, class: 'diengiai-col' },
      { label: 'Số tiền', colspan: 3, class: 'header-level-1' },
      { label: 'Ghi chú', rowspan: 2, class: 'note-col' },
    ],
    // Row 2
    [
      { label: 'Thu', class: 'number-col' },
      { label: 'Chi', class: 'number-col' },
      { label: 'Tồn', class: 'number-col highlight' },
    ],
  ];

  // Column labels (A, B, C...)
  columnLabels = ['A', 'B', 'C', 'D', '1', '2', '3', 'E'];

  // Data columns
  dataColumns: DataColumn[] = [
    { key: 'ngayThangGhiSo', type: 'date' },
    { key: 'ngayThangChungTu', type: 'date' },
    { key: 'soHieuChungTu', type: 'text' },
    { key: 'dienGiai', type: 'text' },
    { key: 'soTienThu', type: 'number' },
    { key: 'soTienChi', type: 'number' },
    { key: 'soTienTon', type: 'number', class: 'highlight' },
    { key: 'ghiChu', type: 'text' },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const stored = localStorage.getItem('s6_quytienmat');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.data = parsed.data || [];
      this.soDuDauKy = parsed.soDuDauKy || 0;
    }
    this.calculateRunningBalance();
    this.calculateFooter();
  }

  saveData() {
    localStorage.setItem('s6_quytienmat', JSON.stringify({
      data: this.data,
      soDuDauKy: this.soDuDauKy
    }));
    this.calculateFooter();
  }

  getEmptyRecord(): Partial<S6_QuyTienMat> {
    return {
      ngayThangGhiSo: new Date(),
      ngayThangChungTu: new Date(),
      soHieuChungTu: '',
      dienGiai: '',
      soTienThu: 0,
      soTienChi: 0,
      soTienTon: 0,
      ghiChu: ''
    };
  }

  addRecord() {
    if (!this.validateForm()) return;

    const record: S6_QuyTienMat = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ngayThangGhiSo: new Date(this.newRecord.ngayThangGhiSo!),
      ngayThangChungTu: new Date(this.newRecord.ngayThangChungTu!),
      soHieuChungTu: this.newRecord.soHieuChungTu || '',
      dienGiai: this.newRecord.dienGiai || '',
      soTienThu: this.newRecord.soTienThu || 0,
      soTienChi: this.newRecord.soTienChi || 0,
      soTienTon: 0, // Will be calculated
      ghiChu: this.newRecord.ghiChu
    };

    this.data.push(record);
    this.calculateRunningBalance();
    this.saveData();
    this.newRecord = this.getEmptyRecord();
  }

  calculateRunningBalance() {
    let runningBalance = this.soDuDauKy;

    this.data.forEach(record => {
      runningBalance = runningBalance + (record.soTienThu || 0) - (record.soTienChi || 0);
      record.soTienTon = runningBalance;
    });
  }

  updateRecord(record: S6_QuyTienMat) {
    const index = this.data.findIndex(r => r.id === record.id);
    if (index !== -1) {
      this.data[index] = record;
      this.calculateRunningBalance();
      this.saveData();
    }
  }

  deleteRecord(id: string) {
    this.data = this.data.filter(r => r.id !== id);
    this.calculateRunningBalance();
    this.saveData();
  }

  validateForm(): boolean {
    if (!this.newRecord.soHieuChungTu || !this.newRecord.dienGiai) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Số hiệu chứng từ, Diễn giải)');
      return false;
    }
    if (!this.newRecord.soTienThu && !this.newRecord.soTienChi) {
      alert('Vui lòng nhập số tiền Thu hoặc Chi');
      return false;
    }
    return true;
  }

  // Footer rows
  footerRows: FooterRow[] = [];

  calculateFooter() {
    const sumThu = this.data.reduce((s, r) => s + (r.soTienThu || 0), 0);
    const sumChi = this.data.reduce((s, r) => s + (r.soTienChi || 0), 0);
    const lastRecord = this.data[this.data.length - 1];
    const soDuCuoiKy = lastRecord?.soTienTon || this.soDuDauKy;

    this.footerRows = [
      {
        label: 'Số dư đầu kỳ',
        labelColspan: 4,
        values: [null, null, this.soDuDauKy],
        noteColspan: 1,
        class: 'footer-dauky'
      },
      {
        label: 'Cộng phát sinh trong kỳ',
        labelColspan: 4,
        values: [sumThu, sumChi, null],
        noteColspan: 1,
        class: 'footer-cong'
      },
      {
        label: 'Số dư cuối kỳ',
        labelColspan: 4,
        values: [null, null, soDuCuoiKy],
        noteColspan: 1,
        class: 'footer-cuoiky'
      },
    ];
  }

  // Summary display
  getTongThu(): string {
    const total = this.data.reduce((s, r) => s + (r.soTienThu || 0), 0);
    return formatVND(total);
  }

  getTongChi(): string {
    const total = this.data.reduce((s, r) => s + (r.soTienChi || 0), 0);
    return formatVND(total);
  }

  getSoDuCuoiKy(): string {
    const lastRecord = this.data[this.data.length - 1];
    return formatVND(lastRecord?.soTienTon || this.soDuDauKy);
  }

  updateSoDuDauKy() {
    this.calculateRunningBalance();
    this.saveData();
  }
}
