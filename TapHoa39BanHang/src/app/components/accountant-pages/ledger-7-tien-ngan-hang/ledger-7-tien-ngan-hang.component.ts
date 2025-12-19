import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountantService } from '../services/accountant.service';
import { Ledger7TienNganHang } from '../models/ledger.models';
import { LedgerTableComponent } from '../shared-components/ledger-table.component';
import { formatVND } from '../services/formatting.utils';

interface Column {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  options?: { value: string | number; label: string }[];
  summable?: boolean;
  readonly?: boolean;
  width?: string;
}

@Component({
  selector: 'app-ledger-7-tien-ngan-hang',
  standalone: true,
  imports: [CommonModule, FormsModule, LedgerTableComponent],
  templateUrl: './ledger-7-tien-ngan-hang.component.html',
  styleUrl: './ledger-7-tien-ngan-hang.component.css',
})
export class Ledger7TienNganHangComponent implements OnInit {
  allData: Ledger7TienNganHang[] = [];
  filteredData: Ledger7TienNganHang[] = [];
  newRecord: Partial<Ledger7TienNganHang> = {
    ngay: new Date(),
    soChungTu: '',
    noiDungGiaoDich: '',
    thu: 0,
    chi: 0,
  };

  tableColumns: Column[] = [
    { key: 'ngay', label: 'Ngày Giao Dịch', type: 'date' },
    { key: 'soChungTu', label: 'Số Chứng Tư', type: 'text' },
    { key: 'noiDungGiaoDich', label: 'Nội Dung Giao Dịch', type: 'text' },
    { key: 'thu', label: 'Thu (Số Tiền)', type: 'number' },
    { key: 'chi', label: 'Chi (Số Tiền)', type: 'number' },
    { key: 'nguoiThucHien', label: 'Người Thực Hiện', type: 'text' },
    { key: 'ghiChu', label: 'Ghi Chú', type: 'text' },
  ];

  selectedMonth: string = new Date().toISOString().split('-').slice(0, 2).join('-');

  constructor(private accountantService: AccountantService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.accountantService.getLedger7().subscribe((data: any) => {
      this.allData = data;
      this.filteredData = [...this.allData];
    });
  }

  filterByMonth(): void {
    if (!this.selectedMonth) {
      this.filteredData = [...this.allData];
      return;
    }

    this.filteredData = this.allData.filter(
      (record: Ledger7TienNganHang) => {
        const recordDate = new Date(record.ngay);
        const recordMonth = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
        return recordMonth === this.selectedMonth;
      }
    );
  }

  addRecord(): void {
    if (!this.newRecord.ngay) {
      alert('Vui lòng chọn ngày giao dịch');
      return;
    }

    this.accountantService.addLedger7(this.newRecord as Ledger7TienNganHang);
    this.newRecord = {
      ngay: new Date(),
      soChungTu: '',
      noiDungGiaoDich: '',
      thu: 0,
      chi: 0,
    };
  }

  updateRecord(record: Ledger7TienNganHang): void {
    this.accountantService.updateLedger7(record.id!, record);
  }

  deleteRecord(id: string): void {
    if (!confirm('Bạn chắc chắn muốn xóa bản ghi này?')) {
      return;
    }

    this.accountantService.deleteLedger7(id);
  }

  getTotalThu(): number {
    return this.filteredData.reduce((sum, record) => sum + (record.thu || 0), 0);
  }

  getTotalChi(): number {
    return this.filteredData.reduce((sum, record) => sum + (record.chi || 0), 0);
  }

  getNetBalance(): number {
    return this.getTotalThu() - this.getTotalChi();
  }

  getCurrentBalance(): string {
    return this.formatVND(this.getNetBalance());
  }

  formatVND(value: number): string {
    return formatVND(value);
  }
}
