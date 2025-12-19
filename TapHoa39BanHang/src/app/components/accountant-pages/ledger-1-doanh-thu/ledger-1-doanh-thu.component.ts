import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountantService } from '../services/accountant.service';
import { Ledger1DoanhThu } from '../models/ledger.models';
import { LedgerTableComponent } from '../shared-components/ledger-table.component';
import { formatVND } from '../services/formatting.utils';

@Component({
  selector: 'app-ledger-1-doanh-thu',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-1-doanh-thu.component.html',
  styleUrl: './ledger-1-doanh-thu.component.css',
})
export class Ledger1DoanhThuComponent implements OnInit {
  filteredData: Ledger1DoanhThu[] = [];
  allData: Ledger1DoanhThu[] = [];
  selectedMonth: string = '';

  newRecord: Partial<Ledger1DoanhThu> = {
    hinhThucBan: 'TM',
    nhomHang: 'Khac',
    doanhThuChuaVAT: 0,
    thueVAT: 0,
  };

  tableColumns: Array<{ key: string; label: string; type: 'date' | 'text' | 'select' | 'number'; width: string; options?: { value: string; label: string }[]; summable?: boolean; readonly?: boolean }> = [
    { key: 'ngayBan', label: 'Ngày Bán', type: 'date', width: '100px' },
    { key: 'soHoaDon', label: 'Số Hóa Đơn', type: 'text', width: '100px' },
    {
      key: 'hinhThucBan',
      label: 'Hình Thức Bán',
      type: 'select',
      options: [
        { value: 'TM', label: 'Tiền Mặt' },
        { value: 'CK', label: 'Chuyển Khoản' },
      ],
      width: '120px',
    },
    {
      key: 'nhomHang',
      label: 'Nhóm Hàng',
      type: 'select',
      options: [
        { value: 'NuocNgot', label: 'Nước Ngọt' },
        { value: 'BanhKeo', label: 'Bánh Kẹo' },
        { value: 'NhuYeuPham', label: 'Nhu Yếu Phẩm' },
        { value: 'Khac', label: 'Khác' },
      ],
      width: '120px',
    },
    {
      key: 'doanhThuChuaVAT',
      label: 'Doanh Thu (Chưa VAT)',
      type: 'number',
      summable: true,
      width: '150px',
    },
    {
      key: 'thueVAT',
      label: 'Thuế VAT',
      type: 'number',
      summable: true,
      width: '130px',
    },
    {
      key: 'tongTienThanhToan',
      label: 'Tổng Tiền',
      type: 'number',
      readonly: true,
      summable: true,
      width: '130px',
    },
    { key: 'ghiChu', label: 'Ghi Chú', type: 'text', width: '150px' },
  ];

  constructor(private accountantService: AccountantService) {}

  ngOnInit() {
    this.accountantService.getLedger1().subscribe((data) => {
      this.allData = data;
      this.filterByMonth();
    });
  }

  addRecord() {
    if (!this.validateForm()) return;

    const record: Ledger1DoanhThu = {
      ngayBan: new Date(this.newRecord.ngayBan as any),
      soHoaDon: this.newRecord.soHoaDon || '',
      hinhThucBan: this.newRecord.hinhThucBan as 'TM' | 'CK',
      nhomHang: this.newRecord.nhomHang as any,
      doanhThuChuaVAT: this.newRecord.doanhThuChuaVAT || 0,
      thueVAT: this.newRecord.thueVAT || 0,
      tongTienThanhToan: 0,
      ghiChu: this.newRecord.ghiChu,
    };

    this.accountantService.addLedger1(record);
    this.resetForm();
  }

  updateRecord(record: Ledger1DoanhThu) {
    this.accountantService.updateLedger1(record.id || '', record);
  }

  deleteRecord(id: string) {
    this.accountantService.deleteLedger1(id);
  }

  filterByMonth() {
    if (!this.selectedMonth) {
      this.filteredData = [...this.allData];
    } else {
      const [month, year] = this.selectedMonth.split('/').map(Number);
      this.filteredData = this.allData.filter((record) => {
        const d = new Date(record.ngayBan);
        return d.getMonth() === month - 1 && d.getFullYear() === year;
      });
    }
  }

  resetFilter() {
    this.selectedMonth = '';
    this.filterByMonth();
  }

  getAvailableMonths(): string[] {
    const months = new Set<string>();
    this.allData.forEach((record) => {
      const d = new Date(record.ngayBan);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      months.add(`${month}/${year}`);
    });
    return Array.from(months).sort().reverse();
  }

  sumDoanhThu(): string {
    const sum = this.filteredData.reduce(
      (acc, r) => acc + r.doanhThuChuaVAT,
      0
    );
    return formatVND(sum);
  }

  sumThanhToan(): string {
    const sum = this.filteredData.reduce((acc, r) => acc + r.tongTienThanhToan, 0);
    return formatVND(sum);
  }

  private validateForm(): boolean {
    if (
      !this.newRecord.ngayBan ||
      !this.newRecord.soHoaDon ||
      this.newRecord.doanhThuChuaVAT === undefined ||
      this.newRecord.doanhThuChuaVAT === null
    ) {
      alert('Vui lòng điền đủ các trường bắt buộc (*)');
      return false;
    }
    return true;
  }

  private resetForm() {
    this.newRecord = {
      hinhThucBan: 'TM',
      nhomHang: 'Khac',
      doanhThuChuaVAT: 0,
      thueVAT: 0,
    };
  }
}
