import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountantService } from '../services/accountant.service';
import { Ledger3ChiPhi } from '../models/ledger.models';
import { LedgerTableComponent } from '../shared-components/ledger-table.component';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-3-chi-phi',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-3-chi-phi.component.html',
  styleUrl: './ledger-3-chi-phi.component.css',
})
export class Ledger3ChiPhiComponent implements OnInit {
  filteredData: Ledger3ChiPhi[] = [];
  allData: Ledger3ChiPhi[] = [];
  selectedMonth: string = '';

  newRecord: Partial<Ledger3ChiPhi> = {
    hinhThucThanhToan: 'TM',
    loaiChiPhi: 'LuongCong',
    soTienChuaVAT: 0,
    vatKhauTru: 0,
  };

  tableColumns: any[] = [
    { key: 'ngayChi', label: 'Ngày Chi', type: 'date', width: '100px' },
    { key: 'noiDungChi', label: 'Nội Dung Chi', type: 'text', width: '150px' },
    { key: 'loaiChiPhi', label: 'Loại Chi Phí', type: 'select', width: '120px', options: [
      { value: 'GiaVon', label: 'Giá Vốn' },
      { value: 'LuongCong', label: 'Lương Công' },
      { value: 'ThueMBang', label: 'Thuê Mặt Bằng' },
      { value: 'DienNuoc', label: 'Điện Nước' },
      { value: 'VanChuyen', label: 'Vận Chuyển' },
      { value: 'Khac', label: 'Khác' },
    ]},
    { key: 'soTienChuaVAT', label: 'Số Tiền (Chưa VAT)', type: 'number', width: '150px', summable: true },
    { key: 'vatKhauTru', label: 'VAT Khấu Trừ', type: 'number', width: '150px' },
    { key: 'hinhThucThanhToan', label: 'Hình Thức TT', type: 'select', width: '120px', options: [
      { value: 'TM', label: 'Tiền Mặt' },
      { value: 'CK', label: 'Chuyển Khoản' },
    ]},
    { key: 'ghiChu', label: 'Ghi Chú', type: 'text', width: '150px' },
  ];

  constructor(private accountantService: AccountantService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.accountantService.getLedger3().subscribe((data: any) => {
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
      const recordMonth = this.getMonthFromDate(record.ngayChi.toString());
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
      const month = this.getMonthFromDate(record.ngayChi.toString());
      months.add(month);
    });
    return Array.from(months).sort().reverse();
  }

  resetFilter() {
    this.selectedMonth = '';
    this.filterByMonth();
  }

  addRecord() {
    if (!this.newRecord.ngayChi || !this.newRecord.loaiChiPhi || !this.newRecord.soTienChuaVAT) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const record: Ledger3ChiPhi = {
      id: Date.now().toString(),
      ngayChi: this.newRecord.ngayChi as Date,
      noiDungChi: this.newRecord.noiDungChi || '',
      loaiChiPhi: (this.newRecord.loaiChiPhi as any) || 'Khac',
      soTienChuaVAT: this.newRecord.soTienChuaVAT || 0,
      vatKhauTru: this.newRecord.vatKhauTru || 0,
      tongTien: (this.newRecord.soTienChuaVAT || 0) + (this.newRecord.vatKhauTru || 0),
      hinhThucThanhToan: (this.newRecord.hinhThucThanhToan as any) || 'TM',
      ghiChu: this.newRecord.ghiChu || '',
    };

    this.accountantService.addLedger3(record);
    this.newRecord = {
      hinhThucThanhToan: 'TM',
      loaiChiPhi: 'LuongCong',
      soTienChuaVAT: 0,
      vatKhauTru: 0,
    };
    this.loadData();
  }

  updateRecord(record: Ledger3ChiPhi) {
    this.accountantService.updateLedger3(record.id || '', record);
  }

  deleteRecord(id: string) {
    if (confirm('Bạn chắc chắn muốn xóa?')) {
      this.accountantService.deleteLedger3(id);
    }
  }

  sumChiPhi(): string {
    const sum = this.filteredData.reduce((acc, record) => acc + (record.soTienChuaVAT || 0), 0);
    return formatVND(sum);
  }

  sumVAT(): string {
    const sum = this.filteredData.reduce((acc, record) => acc + (record.vatKhauTru || 0), 0);
    return formatVND(sum);
  }
}

