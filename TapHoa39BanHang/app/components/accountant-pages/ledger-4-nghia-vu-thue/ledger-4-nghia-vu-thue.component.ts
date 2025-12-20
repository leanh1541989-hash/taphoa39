/**
 * S4-HKD: SỔ THEO DÕI TÌNH HÌNH THỰC HIỆN NGHĨA VỤ THUẾ VỚI NSNN
 * Circular 88/2021/TT-BTC - Appendix 2 - Mẫu số S4-HKD
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LedgerTableComponent, HeaderCell, DataColumn, FooterRow } from '../shared-components/ledger-table.component';
import { S4_NghiaVuThue } from '../models/ledger.models';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-4-nghia-vu-thue',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-4-nghia-vu-thue.component.html',
  styleUrl: './ledger-4-nghia-vu-thue.component.css',
})
export class Ledger4NghiaVuThueComponent implements OnInit {
  // Tax type being tracked
  loaiThue: string = 'Thuế GTGT';

  // Data
  data: S4_NghiaVuThue[] = [];

  // New record form
  newRecord: Partial<S4_NghiaVuThue> = this.getEmptyRecord();

  // Opening balance (Số thuế còn phải nộp đầu kỳ)
  soDuDauKy: number = 0;

  // Table header configuration (multi-row)
  headerRows: HeaderCell[][] = [
    // Row 1
    [
      { label: 'Chứng từ', colspan: 2, class: 'header-level-1' },
      { label: 'Diễn giải', rowspan: 2, class: 'diengiai-col' },
      { label: 'Số thuế phải nộp', rowspan: 2, class: 'number-col' },
      { label: 'Số thuế đã nộp', rowspan: 2, class: 'number-col' },
      { label: 'Ghi chú', rowspan: 2, class: 'note-col' },
    ],
    // Row 2
    [
      { label: 'Số hiệu', class: 'chungtu-col' },
      { label: 'Ngày, tháng', class: 'date-col' },
    ],
  ];

  // Column labels (A, B, C...)
  columnLabels = ['A', 'B', 'C', '1', '2', 'D'];

  // Data columns
  dataColumns: DataColumn[] = [
    { key: 'chungTu', nestedKey: 'soHieu', type: 'text' },
    { key: 'chungTu', nestedKey: 'ngayThang', type: 'date' },
    { key: 'dienGiai', type: 'text' },
    { key: 'soThuePhaINop', type: 'number' },
    { key: 'soThueDaNop', type: 'number' },
    { key: 'ghiChu', type: 'text' },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const stored = localStorage.getItem('s4_nghiavuthue');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.data = parsed.data || [];
      this.soDuDauKy = parsed.soDuDauKy || 0;
      this.loaiThue = parsed.loaiThue || 'Thuế GTGT';
    }
    this.calculateFooter();
  }

  saveData() {
    localStorage.setItem('s4_nghiavuthue', JSON.stringify({
      data: this.data,
      soDuDauKy: this.soDuDauKy,
      loaiThue: this.loaiThue
    }));
    this.calculateFooter();
  }

  getEmptyRecord(): Partial<S4_NghiaVuThue> {
    return {
      chungTu: { soHieu: '', ngayThang: new Date() },
      dienGiai: '',
      soThuePhaINop: 0,
      soThueDaNop: 0,
      ghiChu: ''
    };
  }

  addRecord() {
    if (!this.validateForm()) return;

    const record: S4_NghiaVuThue = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      chungTu: {
        soHieu: this.newRecord.chungTu?.soHieu || '',
        ngayThang: new Date(this.newRecord.chungTu?.ngayThang!)
      },
      dienGiai: this.newRecord.dienGiai || '',
      soThuePhaINop: this.newRecord.soThuePhaINop || 0,
      soThueDaNop: this.newRecord.soThueDaNop || 0,
      ghiChu: this.newRecord.ghiChu
    };

    this.data.push(record);
    this.saveData();
    this.newRecord = this.getEmptyRecord();
  }

  updateRecord(record: S4_NghiaVuThue) {
    const index = this.data.findIndex(r => r.id === record.id);
    if (index !== -1) {
      this.data[index] = record;
      this.saveData();
    }
  }

  deleteRecord(id: string) {
    this.data = this.data.filter(r => r.id !== id);
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
    const sumPhaiNop = this.data.reduce((s, r) => s + (r.soThuePhaINop || 0), 0);
    const sumDaNop = this.data.reduce((s, r) => s + (r.soThueDaNop || 0), 0);
    const soDuCuoiKy = this.soDuDauKy + sumPhaiNop - sumDaNop;

    this.footerRows = [
      {
        label: 'Số dư đầu kỳ (Số thuế còn phải nộp)',
        labelColspan: 3,
        values: [this.soDuDauKy, null],
        noteColspan: 1,
        class: 'footer-dauky'
      },
      {
        label: 'Số phát sinh trong kỳ',
        labelColspan: 3,
        values: [sumPhaiNop, sumDaNop],
        noteColspan: 1,
        class: 'footer-phatsinh'
      },
      {
        label: 'Cộng số phát sinh trong kỳ',
        labelColspan: 3,
        values: [sumPhaiNop, sumDaNop],
        noteColspan: 1,
        class: 'footer-cong'
      },
      {
        label: 'Số dư cuối kỳ (Số thuế còn phải nộp)',
        labelColspan: 3,
        values: [soDuCuoiKy, null],
        noteColspan: 1,
        class: 'footer-cuoiky'
      },
    ];
  }

  // Summary display
  getSoThuePhaINop(): string {
    const total = this.data.reduce((s, r) => s + (r.soThuePhaINop || 0), 0);
    return formatVND(total);
  }

  getSoThueDaNop(): string {
    const total = this.data.reduce((s, r) => s + (r.soThueDaNop || 0), 0);
    return formatVND(total);
  }

  getSoDuCuoiKy(): string {
    const sumPhaiNop = this.data.reduce((s, r) => s + (r.soThuePhaINop || 0), 0);
    const sumDaNop = this.data.reduce((s, r) => s + (r.soThueDaNop || 0), 0);
    return formatVND(this.soDuDauKy + sumPhaiNop - sumDaNop);
  }

  updateSoDuDauKy() {
    this.saveData();
  }
}
