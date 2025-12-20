/**
 * S1-HKD: SỔ CHI TIẾT DOANH THU BÁN HÀNG HÓA, DỊCH VỤ
 * Circular 88/2021/TT-BTC - Appendix 2 - Mẫu số S1-HKD
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LedgerTableComponent, HeaderCell, DataColumn, FooterRow } from '../shared-components/ledger-table.component';
import { S1_DoanhThu } from '../models/ledger.models';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-1-doanh-thu',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-1-doanh-thu.component.html',
  styleUrl: './ledger-1-doanh-thu.component.css',
})
export class Ledger1DoanhThuComponent implements OnInit {
  // Data
  data: S1_DoanhThu[] = [];
  
  // New record form
  newRecord: Partial<S1_DoanhThu> = this.getEmptyRecord();

  // Table header configuration (multi-row)
  headerRows: HeaderCell[][] = [
    // Row 1
    [
      { label: 'Ngày, tháng ghi sổ', rowspan: 2, class: 'date-col' },
      { label: 'Chứng từ', colspan: 2, class: 'header-level-1' },
      { label: 'Diễn giải', rowspan: 2, class: 'diengiai-col' },
      { label: 'Doanh thu bán hàng hóa, dịch vụ', colspan: 2, class: 'header-level-1' },
      { label: 'Ghi chú', rowspan: 2, class: 'note-col' },
    ],
    // Row 2
    [
      { label: 'Số hiệu', class: 'chungtu-col' },
      { label: 'Ngày, tháng', class: 'date-col' },
      { label: 'Phân phối, cung cấp hàng hóa', class: 'number-col' },
      { label: 'Hoạt động KD khác', class: 'number-col' },
    ],
  ];

  // Column labels (A, B, C...)
  columnLabels = ['A', 'B', 'C', 'D', '1', '2', 'E'];

  // Data columns
  dataColumns: DataColumn[] = [
    { key: 'ngayThangGhiSo', type: 'date' },
    { key: 'chungTu', nestedKey: 'soHieu', type: 'text' },
    { key: 'chungTu', nestedKey: 'ngayThang', type: 'date' },
    { key: 'dienGiai', type: 'text' },
    { key: 'doanhThuPhanPhoi', type: 'number' },
    { key: 'doanhThuKhac', type: 'number' },
    { key: 'ghiChu', type: 'text' },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const stored = localStorage.getItem('s1_doanhthu');
    if (stored) {
      this.data = JSON.parse(stored);
    }
    this.calculateFooter();
  }

  saveData() {
    localStorage.setItem('s1_doanhthu', JSON.stringify(this.data));
    this.calculateFooter();
  }

  getEmptyRecord(): Partial<S1_DoanhThu> {
    return {
      ngayThangGhiSo: new Date(),
      chungTu: { soHieu: '', ngayThang: new Date() },
      dienGiai: '',
      doanhThuPhanPhoi: 0,
      doanhThuKhac: 0,
      ghiChu: ''
    };
  }

  addRecord() {
    if (!this.validateForm()) return;

    const record: S1_DoanhThu = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ngayThangGhiSo: new Date(this.newRecord.ngayThangGhiSo!),
      chungTu: {
        soHieu: this.newRecord.chungTu?.soHieu || '',
        ngayThang: new Date(this.newRecord.chungTu?.ngayThang!)
      },
      dienGiai: this.newRecord.dienGiai || '',
      doanhThuPhanPhoi: this.newRecord.doanhThuPhanPhoi || 0,
      doanhThuKhac: this.newRecord.doanhThuKhac || 0,
      ghiChu: this.newRecord.ghiChu
    };

    this.data.push(record);
    this.saveData();
    this.newRecord = this.getEmptyRecord();
  }

  updateRecord(record: S1_DoanhThu) {
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

  // Add record from inline table (new method)
  addRecordFromTable(rowData: any) {
    const record: S1_DoanhThu = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ngayThangGhiSo: rowData.ngayThangGhiSo ? new Date(rowData.ngayThangGhiSo) : new Date(),
      chungTu: {
        soHieu: rowData.chungTu?.soHieu || rowData['chungTu'] || '',
        ngayThang: rowData.chungTu?.ngayThang ? new Date(rowData.chungTu.ngayThang) : new Date()
      },
      dienGiai: rowData.dienGiai || '',
      doanhThuPhanPhoi: rowData.doanhThuPhanPhoi || 0,
      doanhThuKhac: rowData.doanhThuKhac || 0,
      ghiChu: rowData.ghiChu || ''
    };

    this.data.push(record);
    this.saveData();
  }

  validateForm(): boolean {
    if (!this.newRecord.chungTu?.soHieu || !this.newRecord.dienGiai) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Số hiệu chứng từ, Diễn giải)');
      return false;
    }
    return true;
  }

  // Footer calculations
  footerRows: FooterRow[] = [];

  calculateFooter() {
    const sumPhanPhoi = this.data.reduce((s, r) => s + (r.doanhThuPhanPhoi || 0), 0);
    const sumKhac = this.data.reduce((s, r) => s + (r.doanhThuKhac || 0), 0);

    this.footerRows = [
      {
        label: 'Tổng cộng',
        labelColspan: 4,
        values: [sumPhanPhoi, sumKhac],
        noteColspan: 1,
        class: 'footer-cong'
      }
    ];
  }

  // Summary for display
  getTongDoanhThu(): string {
    const total = this.data.reduce((s, r) => 
      s + (r.doanhThuPhanPhoi || 0) + (r.doanhThuKhac || 0), 0);
    return formatVND(total);
  }
}
