import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatVND, formatDate } from '../../accountant-pages//services/formatting.utils';

interface Column {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  options?: { value: string | number; label: string }[];
  summable?: boolean; // For auto-summing footer
  readonly?: boolean;
  width?: string;
}

@Component({
  selector: 'app-ledger-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ledger-table.component.html',
  styleUrl: './ledger-table.component.css',
})
export class LedgerTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: Column[] = [];
  @Output() rowSaved = new EventEmitter<any>();
  @Output() rowDeleted = new EventEmitter<string>();

  editingId: string | null = null;
  editingData: any = null;

  ngOnInit() {
    // Ensure data is sorted by date if first column is date
    if (this.columns.length > 0 && this.columns[0].type === 'date') {
      this.data.sort(
        (a, b) => new Date(a[this.columns[0].key]).getTime() - 
                   new Date(b[this.columns[0].key]).getTime()
      );
    }
  }

  startEdit(row: any) {
    this.editingId = row.id;
    this.editingData = { ...row };
  }

  saveEdit(row: any) {
    this.rowSaved.emit(row);
    this.editingId = null;
    this.editingData = null;
  }

  cancelEdit() {
    this.editingId = null;
    this.editingData = null;
  }

  deleteRow(id: string) {
    if (confirm('Bạn chắc chắn muốn xóa dòng này?')) {
      this.rowDeleted.emit(id);
    }
  }

  getCellDisplay(row: any, col: Column): string {
    const value = row[col.key];

    if (col.type === 'date') {
      return formatDate(value);
    }

    if (col.type === 'number') {
      return formatVND(value);
    }

    if (col.type === 'select' && col.options) {
      const option = col.options.find((opt) => opt.value === value);
      return option?.label || value;
    }

    if (col.type === 'checkbox') {
      return value ? '✓' : '';
    }

    return value || '';
  }

  getDateInputValue(date: Date | string | null | undefined): string {
    if (!date) return '';
    if (typeof date === 'string') return date.substring(0, 10);
    return date.toISOString().substring(0, 10);
  }

  hasSummable(): boolean {
    return this.columns.some((col) => col.summable);
  }

  sumColumn(key: string): string {
    const sum = this.data.reduce((acc, row) => {
      const val = Number(row[key]) || 0;
      return acc + val;
    }, 0);
    return formatVND(sum);
  }
}
