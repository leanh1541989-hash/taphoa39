/**
 * S7-HKD: SỔ TIỀN GỬI NGÂN HÀNG
 * Circular 88/2021/TT-BTC - Appendix 2 - Mẫu số S7-HKD
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LedgerTableComponent, HeaderCell, DataColumn, FooterRow } from '../shared-components/ledger-table.component';
import { S7_TienNganHang } from '../models/ledger.models';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-7-tien-ngan-hang',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-7-tien-ngan-hang.component.html',
  styleUrl: './ledger-7-tien-ngan-hang.component.css',
})
export class Ledger7TienNganHangComponent implements OnInit {
  // Bank account info
  tenNganHang: string = '';
  soTaiKhoan: string = '';

  // Data
  data: S7_TienNganHang[] = [];

  // New record form
  newRecord: Partial<S7_TienNganHang> = this.getEmptyRecord();

  // Opening balance
  soDuDauKy: number = 0;

  // Table header configuration (multi-row as per Circular 88)
  headerRows: HeaderCell[][] = [
    // Row 1
    [
      { label: 'Ngày, tháng ghi sổ', rowspan: 2, class: 'date-col' },
      { label: 'Chứng từ', colspan: 2, class: 'header-level-1' },
      { label: 'Diễn giải', rowspan: 2, class: 'diengiai-col' },
      { label: 'Số tiền', colspan: 3, class: 'header-level-1' },
      { label: 'Ghi chú', rowspan: 2, class: 'note-col' },
    ],
    // Row 2
    [
      { label: 'Số hiệu', class: 'chungtu-col' },
      { label: 'Ngày, tháng', class: 'date-col' },
      { label: 'Gửi vào', class: 'number-col' },
      { label: 'Rút ra', class: 'number-col' },
      { label: 'Còn lại', class: 'number-col highlight' },
    ],
  ];

  // Column labels (A, B, C...)
  columnLabels = ['A', 'B', 'C', 'D', '1', '2', '3', 'E'];

  // Data columns
  dataColumns: DataColumn[] = [
    { key: 'ngayThangGhiSo', type: 'date' },
    { key: 'chungTu', nestedKey: 'soHieu', type: 'text' },
    { key: 'chungTu', nestedKey: 'ngayThang', type: 'date' },
    { key: 'dienGiai', type: 'text' },
    { key: 'soTienGuiVao', type: 'number' },
    { key: 'soTienRutRa', type: 'number' },
    { key: 'soTienConLai', type: 'number', class: 'highlight' },
    { key: 'ghiChu', type: 'text' },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const stored = localStorage.getItem('s7_tiennganhang');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.data = parsed.data || [];
      this.soDuDauKy = parsed.soDuDauKy || 0;
      this.tenNganHang = parsed.tenNganHang || '';
      this.soTaiKhoan = parsed.soTaiKhoan || '';
    }
    this.calculateRunningBalance();
    this.calculateFooter();
  }

  saveData() {
    localStorage.setItem('s7_tiennganhang', JSON.stringify({
      data: this.data,
      soDuDauKy: this.soDuDauKy,
      tenNganHang: this.tenNganHang,
      soTaiKhoan: this.soTaiKhoan
    }));
    this.calculateFooter();
  }

  getEmptyRecord(): Partial<S7_TienNganHang> {
    return {
      ngayThangGhiSo: new Date(),
      chungTu: { soHieu: '', ngayThang: new Date() },
      dienGiai: '',
      soTienGuiVao: 0,
      soTienRutRa: 0,
      soTienConLai: 0,
      ghiChu: ''
    };
  }

  addRecord() {
    if (!this.validateForm()) return;

    const record: S7_TienNganHang = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ngayThangGhiSo: new Date(this.newRecord.ngayThangGhiSo!),
      chungTu: {
        soHieu: this.newRecord.chungTu?.soHieu || '',
        ngayThang: new Date(this.newRecord.chungTu?.ngayThang!)
      },
      dienGiai: this.newRecord.dienGiai || '',
      soTienGuiVao: this.newRecord.soTienGuiVao || 0,
      soTienRutRa: this.newRecord.soTienRutRa || 0,
      soTienConLai: 0, // Will be calculated
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
      runningBalance = runningBalance + (record.soTienGuiVao || 0) - (record.soTienRutRa || 0);
      record.soTienConLai = runningBalance;
    });
  }

  updateRecord(record: S7_TienNganHang) {
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
    if (!this.newRecord.chungTu?.soHieu || !this.newRecord.dienGiai) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Số hiệu chứng từ, Diễn giải)');
      return false;
    }
    if (!this.newRecord.soTienGuiVao && !this.newRecord.soTienRutRa) {
      alert('Vui lòng nhập số tiền Gửi vào hoặc Rút ra');
      return false;
    }
    return true;
  }

  // Footer rows
  footerRows: FooterRow[] = [];

  calculateFooter() {
    const sumGuiVao = this.data.reduce((s, r) => s + (r.soTienGuiVao || 0), 0);
    const sumRutRa = this.data.reduce((s, r) => s + (r.soTienRutRa || 0), 0);
    const lastRecord = this.data[this.data.length - 1];
    const soDuCuoiKy = lastRecord?.soTienConLai || this.soDuDauKy;

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
        values: [sumGuiVao, sumRutRa, null],
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
  getTongGuiVao(): string {
    const total = this.data.reduce((s, r) => s + (r.soTienGuiVao || 0), 0);
    return formatVND(total);
  }

  getTongRutRa(): string {
    const total = this.data.reduce((s, r) => s + (r.soTienRutRa || 0), 0);
    return formatVND(total);
  }

  getSoDuCuoiKy(): string {
    const lastRecord = this.data[this.data.length - 1];
    return formatVND(lastRecord?.soTienConLai || this.soDuDauKy);
  }

  updateSoDuDauKy() {
    this.calculateRunningBalance();
    this.saveData();
  }

  updateBankInfo() {
    this.saveData();
  }
}
