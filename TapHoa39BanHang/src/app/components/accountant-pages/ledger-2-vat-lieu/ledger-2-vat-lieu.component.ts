/**
 * S2-HKD: SỔ CHI TIẾT VẬT LIỆU, DỤNG CỤ, SẢN PHẨM, HÀNG HÓA
 * Circular 88/2021/TT-BTC - Appendix 2 - Mẫu số S2-HKD
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LedgerTableComponent, HeaderCell, DataColumn, FooterRow } from '../shared-components/ledger-table.component';
import { S2_VatLieu } from '../models/ledger.models';
import { formatVND, formatNumber } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-2-vat-lieu',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-2-vat-lieu.component.html',
  styleUrl: './ledger-2-vat-lieu.component.css',
})
export class Ledger2VatLieuComponent implements OnInit {
  // Current material being tracked
  tenVatLieu: string = '';
  donViTinh: string = '';

  // Data
  data: S2_VatLieu[] = [];

  // New record form
  newRecord: Partial<S2_VatLieu> = this.getEmptyRecord();

  // Table header configuration (multi-row)
  headerRows: HeaderCell[][] = [
    // Row 1
    [
      { label: 'Chứng từ', colspan: 2, class: 'header-level-1' },
      { label: 'Diễn giải', rowspan: 2, class: 'diengiai-col' },
      { label: 'Đơn vị tính', rowspan: 2, class: 'unit-col' },
      { label: 'Đơn giá', rowspan: 2, class: 'number-col' },
      { label: 'Nhập', colspan: 2, class: 'header-level-1' },
      { label: 'Xuất', colspan: 2, class: 'header-level-1' },
      { label: 'Tồn', colspan: 2, class: 'header-level-1' },
      { label: 'Ghi chú', rowspan: 2, class: 'note-col' },
    ],
    // Row 2
    [
      { label: 'Số hiệu', class: 'chungtu-col' },
      { label: 'Ngày, tháng', class: 'date-col' },
      { label: 'Số lượng', class: 'number-col' },
      { label: 'Thành tiền', class: 'number-col' },
      { label: 'Số lượng', class: 'number-col' },
      { label: 'Thành tiền', class: 'number-col' },
      { label: 'Số lượng', class: 'number-col' },
      { label: 'Thành tiền', class: 'number-col' },
    ],
  ];

  // Column labels (A, B, C...)
  columnLabels = ['A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5', '6', 'F'];

  // Data columns
  dataColumns: DataColumn[] = [
    { key: 'chungTu', nestedKey: 'soHieu', type: 'text' },
    { key: 'chungTu', nestedKey: 'ngayThang', type: 'date' },
    { key: 'dienGiai', type: 'text' },
    { key: 'donViTinh', type: 'text' },
    { key: 'donGia', type: 'number', subtype: 'currency' },
    { key: 'nhapSoLuong', type: 'number', subtype: 'quantity' },
    { key: 'nhapThanhTien', type: 'number', subtype: 'currency' },
    { key: 'xuatSoLuong', type: 'number', subtype: 'quantity' },
    { key: 'xuatThanhTien', type: 'number', subtype: 'currency' },
    { key: 'tonSoLuong', type: 'number', subtype: 'quantity' },
    { key: 'tonThanhTien', type: 'number', subtype: 'currency' },
    { key: 'ghiChu', type: 'text' },
  ];

  // Opening balance
  soDuDauKy = { soLuong: 0, thanhTien: 0 };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const stored = localStorage.getItem('s2_vatlieu');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.data = parsed.data || [];
      this.soDuDauKy = parsed.soDuDauKy || { soLuong: 0, thanhTien: 0 };
      this.tenVatLieu = parsed.tenVatLieu || '';
      this.donViTinh = parsed.donViTinh || '';
    }
    this.calculateTon();
    this.calculateFooter();
  }

  saveData() {
    localStorage.setItem('s2_vatlieu', JSON.stringify({
      data: this.data,
      soDuDauKy: this.soDuDauKy,
      tenVatLieu: this.tenVatLieu,
      donViTinh: this.donViTinh
    }));
    this.calculateFooter();
  }

  getEmptyRecord(): Partial<S2_VatLieu> {
    return {
      chungTu: { soHieu: '', ngayThang: new Date() },
      dienGiai: '',
      donViTinh: this.donViTinh,
      donGia: 0,
      nhapSoLuong: 0,
      nhapThanhTien: 0,
      xuatSoLuong: 0,
      xuatThanhTien: 0,
      tonSoLuong: 0,
      tonThanhTien: 0,
      ghiChu: ''
    };
  }

  addRecord() {
    if (!this.validateForm()) return;

    const record: S2_VatLieu = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      chungTu: {
        soHieu: this.newRecord.chungTu?.soHieu || '',
        ngayThang: new Date(this.newRecord.chungTu?.ngayThang!)
      },
      dienGiai: this.newRecord.dienGiai || '',
      donViTinh: this.newRecord.donViTinh || this.donViTinh,
      donGia: this.newRecord.donGia || 0,
      nhapSoLuong: this.newRecord.nhapSoLuong || 0,
      nhapThanhTien: this.newRecord.nhapThanhTien || 0,
      xuatSoLuong: this.newRecord.xuatSoLuong || 0,
      xuatThanhTien: this.newRecord.xuatThanhTien || 0,
      tonSoLuong: 0,
      tonThanhTien: 0,
      ghiChu: this.newRecord.ghiChu
    };

    // Auto-calculate thành tiền if not provided
    if (record.nhapSoLuong && record.donGia && !record.nhapThanhTien) {
      record.nhapThanhTien = record.nhapSoLuong * record.donGia;
    }
    if (record.xuatSoLuong && record.donGia && !record.xuatThanhTien) {
      record.xuatThanhTien = record.xuatSoLuong * record.donGia;
    }

    this.data.push(record);
    this.calculateTon();
    this.saveData();
    this.newRecord = this.getEmptyRecord();
  }

  calculateTon() {
    let runningQty = this.soDuDauKy.soLuong;
    let runningValue = this.soDuDauKy.thanhTien;

    this.data.forEach(record => {
      runningQty = runningQty + (record.nhapSoLuong || 0) - (record.xuatSoLuong || 0);
      runningValue = runningValue + (record.nhapThanhTien || 0) - (record.xuatThanhTien || 0);
      record.tonSoLuong = runningQty;
      record.tonThanhTien = runningValue;
    });
  }

  updateRecord(record: S2_VatLieu) {
    const index = this.data.findIndex(r => r.id === record.id);
    if (index !== -1) {
      this.data[index] = record;
      this.calculateTon();
      this.saveData();
    }
  }

  deleteRecord(id: string) {
    this.data = this.data.filter(r => r.id !== id);
    this.calculateTon();
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
    const sumNhapSL = this.data.reduce((s, r) => s + (r.nhapSoLuong || 0), 0);
    const sumNhapTT = this.data.reduce((s, r) => s + (r.nhapThanhTien || 0), 0);
    const sumXuatSL = this.data.reduce((s, r) => s + (r.xuatSoLuong || 0), 0);
    const sumXuatTT = this.data.reduce((s, r) => s + (r.xuatThanhTien || 0), 0);

    const lastRecord = this.data[this.data.length - 1];
    const tonSL = lastRecord?.tonSoLuong || this.soDuDauKy.soLuong;
    const tonTT = lastRecord?.tonThanhTien || this.soDuDauKy.thanhTien;

    this.footerRows = [
      {
        label: 'Số dư đầu kỳ',
        labelColspan: 5,
        values: [this.soDuDauKy.soLuong, this.soDuDauKy.thanhTien, null, null, null, null],
        noteColspan: 1,
        class: 'footer-dauky'
      },
      {
        label: 'Cộng phát sinh trong kỳ',
        labelColspan: 5,
        values: [sumNhapSL, sumNhapTT, sumXuatSL, sumXuatTT, null, null],
        noteColspan: 1,
        class: 'footer-cong'
      },
      {
        label: 'Số dư cuối kỳ',
        labelColspan: 5,
        values: [null, null, null, null, tonSL, tonTT],
        noteColspan: 1,
        class: 'footer-cuoiky'
      },
    ];
  }

  // Summary display
  getTongNhap(): string {
    const total = this.data.reduce((s, r) => s + (r.nhapThanhTien || 0), 0);
    return formatVND(total);
  }

  getTongXuat(): string {
    const total = this.data.reduce((s, r) => s + (r.xuatThanhTien || 0), 0);
    return formatVND(total);
  }

  updateSoDuDauKy() {
    this.calculateTon();
    this.saveData();
  }
}
