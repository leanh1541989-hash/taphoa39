/**
 * S3-HKD: SỔ CHI PHÍ SẢN XUẤT, KINH DOANH
 * Circular 88/2021/TT-BTC - Appendix 2 - Mẫu số S3-HKD
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LedgerTableComponent, HeaderCell, DataColumn, FooterRow } from '../shared-components/ledger-table.component';
import { S3_ChiPhi } from '../models/ledger.models';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-3-chi-phi',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-3-chi-phi.component.html',
  styleUrl: './ledger-3-chi-phi.component.css',
})
export class Ledger3ChiPhiComponent implements OnInit {
  // Data
  data: S3_ChiPhi[] = [];

  // New record form
  newRecord: Partial<S3_ChiPhi> = this.getEmptyRecord();

  // Table header configuration (multi-row as per Circular 88)
  headerRows: HeaderCell[][] = [
    // Row 1
    [
      { label: 'Ngày, tháng ghi sổ', rowspan: 2, class: 'date-col' },
      { label: 'Chứng từ', colspan: 2, class: 'header-level-1' },
      { label: 'Diễn giải', rowspan: 2, class: 'diengiai-col' },
      { label: 'Tổng số tiền', rowspan: 2, class: 'number-col highlight' },
      { label: 'Chia ra', colspan: 7, class: 'header-level-1' },
    ],
    // Row 2
    [
      { label: 'Số hiệu', class: 'chungtu-col' },
      { label: 'Ngày, tháng', class: 'date-col' },
      { label: 'Tiền vật liệu, dụng cụ, hàng hóa', class: 'number-col' },
      { label: 'Tiền nhân công', class: 'number-col' },
      { label: 'Chi phí khấu hao TSCĐ', class: 'number-col' },
      { label: 'Chi phí thuê nhà, đất, mặt bằng SXKD', class: 'number-col' },
      { label: 'Chi phí điện, nước, nhiên liệu', class: 'number-col' },
      { label: 'Chi phí vận chuyển', class: 'number-col' },
      { label: 'Chi phí mua ngoài khác', class: 'number-col' },
    ],
  ];

  // Column labels (A, B, C...)
  columnLabels = ['A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5', '6', '7'];

  // Data columns
  dataColumns: DataColumn[] = [
    { key: 'ngayThangGhiSo', type: 'date' },
    { key: 'chungTu', nestedKey: 'soHieu', type: 'text' },
    { key: 'chungTu', nestedKey: 'ngayThang', type: 'date' },
    { key: 'dienGiai', type: 'text' },
    { key: 'tongSoTien', type: 'number', class: 'highlight' },
    { key: 'tienVatLieu', type: 'number' },
    { key: 'tienNhanCong', type: 'number' },
    { key: 'chiPhiKhauHao', type: 'number' },
    { key: 'chiPhiThueMatBang', type: 'number' },
    { key: 'chiPhiDienNuoc', type: 'number' },
    { key: 'chiPhiVanChuyen', type: 'number' },
    { key: 'chiPhiMuaNgoaiKhac', type: 'number' },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const stored = localStorage.getItem('s3_chiphi');
    if (stored) {
      this.data = JSON.parse(stored);
    }
    this.calculateFooter();
  }

  saveData() {
    localStorage.setItem('s3_chiphi', JSON.stringify(this.data));
    this.calculateFooter();
  }

  getEmptyRecord(): Partial<S3_ChiPhi> {
    return {
      ngayThangGhiSo: new Date(),
      chungTu: { soHieu: '', ngayThang: new Date() },
      dienGiai: '',
      tongSoTien: 0,
      tienVatLieu: 0,
      tienNhanCong: 0,
      chiPhiKhauHao: 0,
      chiPhiThueMatBang: 0,
      chiPhiDienNuoc: 0,
      chiPhiVanChuyen: 0,
      chiPhiMuaNgoaiKhac: 0
    };
  }

  addRecord() {
    if (!this.validateForm()) return;

    const record: S3_ChiPhi = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ngayThangGhiSo: new Date(this.newRecord.ngayThangGhiSo!),
      chungTu: {
        soHieu: this.newRecord.chungTu?.soHieu || '',
        ngayThang: new Date(this.newRecord.chungTu?.ngayThang!)
      },
      dienGiai: this.newRecord.dienGiai || '',
      tongSoTien: 0,
      tienVatLieu: this.newRecord.tienVatLieu || 0,
      tienNhanCong: this.newRecord.tienNhanCong || 0,
      chiPhiKhauHao: this.newRecord.chiPhiKhauHao || 0,
      chiPhiThueMatBang: this.newRecord.chiPhiThueMatBang || 0,
      chiPhiDienNuoc: this.newRecord.chiPhiDienNuoc || 0,
      chiPhiVanChuyen: this.newRecord.chiPhiVanChuyen || 0,
      chiPhiMuaNgoaiKhac: this.newRecord.chiPhiMuaNgoaiKhac || 0
    };

    // Auto-calculate total
    record.tongSoTien = 
      record.tienVatLieu + record.tienNhanCong + record.chiPhiKhauHao +
      record.chiPhiThueMatBang + record.chiPhiDienNuoc + 
      record.chiPhiVanChuyen + record.chiPhiMuaNgoaiKhac;

    this.data.push(record);
    this.saveData();
    this.newRecord = this.getEmptyRecord();
  }

  updateRecord(record: S3_ChiPhi) {
    // Recalculate total
    record.tongSoTien = 
      (record.tienVatLieu || 0) + (record.tienNhanCong || 0) + 
      (record.chiPhiKhauHao || 0) + (record.chiPhiThueMatBang || 0) + 
      (record.chiPhiDienNuoc || 0) + (record.chiPhiVanChuyen || 0) + 
      (record.chiPhiMuaNgoaiKhac || 0);

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
    const sumTotal = this.data.reduce((s, r) => s + (r.tongSoTien || 0), 0);
    const sumVatLieu = this.data.reduce((s, r) => s + (r.tienVatLieu || 0), 0);
    const sumNhanCong = this.data.reduce((s, r) => s + (r.tienNhanCong || 0), 0);
    const sumKhauHao = this.data.reduce((s, r) => s + (r.chiPhiKhauHao || 0), 0);
    const sumThue = this.data.reduce((s, r) => s + (r.chiPhiThueMatBang || 0), 0);
    const sumDienNuoc = this.data.reduce((s, r) => s + (r.chiPhiDienNuoc || 0), 0);
    const sumVanChuyen = this.data.reduce((s, r) => s + (r.chiPhiVanChuyen || 0), 0);
    const sumMuaNgoai = this.data.reduce((s, r) => s + (r.chiPhiMuaNgoaiKhac || 0), 0);

    this.footerRows = [
      {
        label: 'Tổng cộng',
        labelColspan: 4,
        values: [sumTotal, sumVatLieu, sumNhanCong, sumKhauHao, sumThue, sumDienNuoc, sumVanChuyen, sumMuaNgoai],
        class: 'footer-cong'
      }
    ];
  }

  // Summary display
  getTongChiPhi(): string {
    const total = this.data.reduce((s, r) => s + (r.tongSoTien || 0), 0);
    return formatVND(total);
  }

  // Auto-calculate total in form
  calculateFormTotal(): number {
    return (
      (this.newRecord.tienVatLieu || 0) +
      (this.newRecord.tienNhanCong || 0) +
      (this.newRecord.chiPhiKhauHao || 0) +
      (this.newRecord.chiPhiThueMatBang || 0) +
      (this.newRecord.chiPhiDienNuoc || 0) +
      (this.newRecord.chiPhiVanChuyen || 0) +
      (this.newRecord.chiPhiMuaNgoaiKhac || 0)
    );
  }
}
