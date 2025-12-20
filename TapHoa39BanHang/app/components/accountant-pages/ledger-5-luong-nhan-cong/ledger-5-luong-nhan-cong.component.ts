/**
 * S5-HKD: SỔ THEO DÕI TÌNH HÌNH THANH TOÁN TIỀN LƯƠNG VÀ CÁC KHOẢN NỘP THEO LƯƠNG
 * Circular 88/2021/TT-BTC - Appendix 2 - Mẫu số S5-HKD
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LedgerTableComponent, HeaderCell, DataColumn, FooterRow } from '../shared-components/ledger-table.component';
import { S5_TienLuong } from '../models/ledger.models';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-5-luong-nhan-cong',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-5-luong-nhan-cong.component.html',
  styleUrl: './ledger-5-luong-nhan-cong.component.css',
})
export class Ledger5LuongNhanCongComponent implements OnInit {
  // Data
  data: S5_TienLuong[] = [];

  // New record form
  newRecord: Partial<S5_TienLuong> = this.getEmptyRecord();

  // Opening balances
  soDuDauKy = {
    tienLuong: 0,
    bhxh: 0,
    bhyt: 0,
    bhtn: 0
  };

  // Table header configuration (complex multi-row as per Circular 88)
  headerRows: HeaderCell[][] = [
    // Row 1 - Main groups
    [
      { label: 'Ngày, tháng ghi sổ', rowspan: 2, class: 'date-col' },
      { label: 'Chứng từ', colspan: 2, class: 'header-level-1' },
      { label: 'Diễn giải', rowspan: 2, class: 'diengiai-col' },
      { label: 'Tiền lương', colspan: 3, class: 'header-level-1' },
      { label: 'BHXH', colspan: 3, class: 'header-level-1' },
      { label: 'BHYT', colspan: 3, class: 'header-level-1' },
      { label: 'BHTN', colspan: 3, class: 'header-level-1' },
      { label: 'Ghi chú', rowspan: 2, class: 'note-col' },
    ],
    // Row 2 - Sub columns
    [
      { label: 'Số hiệu', class: 'chungtu-col' },
      { label: 'Ngày, tháng', class: 'date-col' },
      { label: 'Phải trả', class: 'number-col' },
      { label: 'Đã trả', class: 'number-col' },
      { label: 'Còn phải trả', class: 'number-col' },
      { label: 'Phải nộp', class: 'number-col' },
      { label: 'Đã nộp', class: 'number-col' },
      { label: 'Còn phải nộp', class: 'number-col' },
      { label: 'Phải nộp', class: 'number-col' },
      { label: 'Đã nộp', class: 'number-col' },
      { label: 'Còn phải nộp', class: 'number-col' },
      { label: 'Phải nộp', class: 'number-col' },
      { label: 'Đã nộp', class: 'number-col' },
      { label: 'Còn phải nộp', class: 'number-col' },
    ],
  ];

  // Column labels (A, B, C...)
  columnLabels = ['A', 'B', 'C', 'D', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'E'];

  // Data columns
  dataColumns: DataColumn[] = [
    { key: 'ngayThangGhiSo', type: 'date' },
    { key: 'chungTu', nestedKey: 'soHieu', type: 'text' },
    { key: 'chungTu', nestedKey: 'ngayThang', type: 'date' },
    { key: 'dienGiai', type: 'text' },
    { key: 'luongPhaiTra', type: 'number' },
    { key: 'luongDaTra', type: 'number' },
    { key: 'luongConPhaiTra', type: 'number' },
    { key: 'bhxhPhaiNop', type: 'number' },
    { key: 'bhxhDaNop', type: 'number' },
    { key: 'bhxhConPhaiNop', type: 'number' },
    { key: 'bhytPhaiNop', type: 'number' },
    { key: 'bhytDaNop', type: 'number' },
    { key: 'bhytConPhaiNop', type: 'number' },
    { key: 'bhtnPhaiNop', type: 'number' },
    { key: 'bhtnDaNop', type: 'number' },
    { key: 'bhtnConPhaiNop', type: 'number' },
    { key: 'ghiChu', type: 'text' },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const stored = localStorage.getItem('s5_tienluong');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.data = parsed.data || [];
      this.soDuDauKy = parsed.soDuDauKy || { tienLuong: 0, bhxh: 0, bhyt: 0, bhtn: 0 };
    }
    this.calculateRunningBalance();
    this.calculateFooter();
  }

  saveData() {
    localStorage.setItem('s5_tienluong', JSON.stringify({
      data: this.data,
      soDuDauKy: this.soDuDauKy
    }));
    this.calculateFooter();
  }

  getEmptyRecord(): Partial<S5_TienLuong> {
    return {
      ngayThangGhiSo: new Date(),
      chungTu: { soHieu: '', ngayThang: new Date() },
      dienGiai: '',
      luongPhaiTra: 0,
      luongDaTra: 0,
      luongConPhaiTra: 0,
      bhxhPhaiNop: 0,
      bhxhDaNop: 0,
      bhxhConPhaiNop: 0,
      bhytPhaiNop: 0,
      bhytDaNop: 0,
      bhytConPhaiNop: 0,
      bhtnPhaiNop: 0,
      bhtnDaNop: 0,
      bhtnConPhaiNop: 0,
      ghiChu: ''
    };
  }

  addRecord() {
    if (!this.validateForm()) return;

    const record: S5_TienLuong = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ngayThangGhiSo: new Date(this.newRecord.ngayThangGhiSo!),
      chungTu: {
        soHieu: this.newRecord.chungTu?.soHieu || '',
        ngayThang: new Date(this.newRecord.chungTu?.ngayThang!)
      },
      dienGiai: this.newRecord.dienGiai || '',
      luongPhaiTra: this.newRecord.luongPhaiTra || 0,
      luongDaTra: this.newRecord.luongDaTra || 0,
      luongConPhaiTra: 0, // Will be calculated
      bhxhPhaiNop: this.newRecord.bhxhPhaiNop || 0,
      bhxhDaNop: this.newRecord.bhxhDaNop || 0,
      bhxhConPhaiNop: 0,
      bhytPhaiNop: this.newRecord.bhytPhaiNop || 0,
      bhytDaNop: this.newRecord.bhytDaNop || 0,
      bhytConPhaiNop: 0,
      bhtnPhaiNop: this.newRecord.bhtnPhaiNop || 0,
      bhtnDaNop: this.newRecord.bhtnDaNop || 0,
      bhtnConPhaiNop: 0,
      ghiChu: this.newRecord.ghiChu
    };

    this.data.push(record);
    this.calculateRunningBalance();
    this.saveData();
    this.newRecord = this.getEmptyRecord();
  }

  calculateRunningBalance() {
    let runningLuong = this.soDuDauKy.tienLuong;
    let runningBHXH = this.soDuDauKy.bhxh;
    let runningBHYT = this.soDuDauKy.bhyt;
    let runningBHTN = this.soDuDauKy.bhtn;

    this.data.forEach(record => {
      runningLuong = runningLuong + (record.luongPhaiTra || 0) - (record.luongDaTra || 0);
      runningBHXH = runningBHXH + (record.bhxhPhaiNop || 0) - (record.bhxhDaNop || 0);
      runningBHYT = runningBHYT + (record.bhytPhaiNop || 0) - (record.bhytDaNop || 0);
      runningBHTN = runningBHTN + (record.bhtnPhaiNop || 0) - (record.bhtnDaNop || 0);

      record.luongConPhaiTra = runningLuong;
      record.bhxhConPhaiNop = runningBHXH;
      record.bhytConPhaiNop = runningBHYT;
      record.bhtnConPhaiNop = runningBHTN;
    });
  }

  updateRecord(record: S5_TienLuong) {
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
    return true;
  }

  // Footer rows
  footerRows: FooterRow[] = [];

  calculateFooter() {
    const sumLuongPhai = this.data.reduce((s, r) => s + (r.luongPhaiTra || 0), 0);
    const sumLuongDa = this.data.reduce((s, r) => s + (r.luongDaTra || 0), 0);
    const sumBHXHPhai = this.data.reduce((s, r) => s + (r.bhxhPhaiNop || 0), 0);
    const sumBHXHDa = this.data.reduce((s, r) => s + (r.bhxhDaNop || 0), 0);
    const sumBHYTPhai = this.data.reduce((s, r) => s + (r.bhytPhaiNop || 0), 0);
    const sumBHYTDa = this.data.reduce((s, r) => s + (r.bhytDaNop || 0), 0);
    const sumBHTNPhai = this.data.reduce((s, r) => s + (r.bhtnPhaiNop || 0), 0);
    const sumBHTNDa = this.data.reduce((s, r) => s + (r.bhtnDaNop || 0), 0);

    const lastRecord = this.data[this.data.length - 1];
    
    this.footerRows = [
      {
        label: 'Số dư đầu kỳ',
        labelColspan: 4,
        values: [
          this.soDuDauKy.tienLuong, null, null,
          this.soDuDauKy.bhxh, null, null,
          this.soDuDauKy.bhyt, null, null,
          this.soDuDauKy.bhtn, null, null
        ],
        noteColspan: 1,
        class: 'footer-dauky'
      },
      {
        label: 'Cộng phát sinh trong kỳ',
        labelColspan: 4,
        values: [
          sumLuongPhai, sumLuongDa, null,
          sumBHXHPhai, sumBHXHDa, null,
          sumBHYTPhai, sumBHYTDa, null,
          sumBHTNPhai, sumBHTNDa, null
        ],
        noteColspan: 1,
        class: 'footer-cong'
      },
      {
        label: 'Số dư cuối kỳ',
        labelColspan: 4,
        values: [
          null, null, lastRecord?.luongConPhaiTra || this.soDuDauKy.tienLuong,
          null, null, lastRecord?.bhxhConPhaiNop || this.soDuDauKy.bhxh,
          null, null, lastRecord?.bhytConPhaiNop || this.soDuDauKy.bhyt,
          null, null, lastRecord?.bhtnConPhaiNop || this.soDuDauKy.bhtn
        ],
        noteColspan: 1,
        class: 'footer-cuoiky'
      },
    ];
  }

  // Summary display
  getTongLuongPhaiTra(): string {
    const total = this.data.reduce((s, r) => s + (r.luongPhaiTra || 0), 0);
    return formatVND(total);
  }

  getTongLuongDaTra(): string {
    const total = this.data.reduce((s, r) => s + (r.luongDaTra || 0), 0);
    return formatVND(total);
  }

  updateSoDuDauKy() {
    this.calculateRunningBalance();
    this.saveData();
  }
}
