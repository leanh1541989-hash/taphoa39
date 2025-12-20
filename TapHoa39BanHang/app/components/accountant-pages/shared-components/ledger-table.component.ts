/**
 * Shared Ledger Table Component
 * Circular 88/2021/TT-BTC - Appendix 2 Compliant
 * Supports multi-row headers (rowspan/colspan), footer summary rows
 * Material Design enhanced
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { formatVND, formatDate } from '../services/formatting.utils';

export interface HeaderCell {
  label: string;
  rowspan?: number;
  colspan?: number;
  class?: string;
  width?: string;
}

export interface DataColumn {
  key: string;
  type: 'text' | 'number' | 'date';
  readonly?: boolean;
  class?: string;
  nestedKey?: string; // For nested objects like chungTu.soHieu
}

export interface FooterRow {
  label: string;
  labelColspan?: number;
  values: (number | null)[];
  noteColspan?: number;
  class?: string;
}

@Component({
  selector: 'app-ledger-table',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './ledger-table.component.html',
  styleUrl: './ledger-table.component.css',
})
export class LedgerTableComponent implements OnInit {
  // Multi-row header configuration
  @Input() headerRows: HeaderCell[][] = [];
  
  // Column labels (A, B, C, D, 1, 2, 3...)
  @Input() columnLabels: string[] = [];
  @Input() showColumnLabels: boolean = true;
  
  // Data columns configuration
  @Input() dataColumns: DataColumn[] = [];
  
  // Data
  @Input() data: any[] = [];
  
  // Footer rows
  @Input() footerRows: FooterRow[] = [];
  
  // Options
  @Input() showStt: boolean = true;
  @Input() editable: boolean = true;
  
  // Events
  @Output() rowSaved = new EventEmitter<any>();
  @Output() rowDeleted = new EventEmitter<string>();
  @Output() rowAdded = new EventEmitter<any>();

  editingId: string | null = null;
  editingData: any = null;
  isAddingNew: boolean = false;
  newRow: any = null;

  // Legacy support
  @Input() columns: any[] = [];

  ngOnInit() {
    // Sort by date if available
    if (this.data.length > 0 && this.dataColumns.length > 0) {
      const dateCol = this.dataColumns.find(c => c.type === 'date');
      if (dateCol) {
        this.data.sort((a, b) => {
          const dateA = this.getNestedValue(a, dateCol.key, dateCol.nestedKey);
          const dateB = this.getNestedValue(b, dateCol.key, dateCol.nestedKey);
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
      }
    }
  }

  startEdit(row: any) {
    this.editingId = row.id;
    this.editingData = JSON.parse(JSON.stringify(row));
  }

  saveEdit(row: any) {
    this.rowSaved.emit(row);
    this.editingId = null;
    this.editingData = null;
  }

  cancelEdit() {
    if (this.editingData && this.editingId) {
      // Restore original data
      const index = this.data.findIndex(r => r.id === this.editingId);
      if (index !== -1) {
        this.data[index] = this.editingData;
      }
    }
    this.editingId = null;
    this.editingData = null;
  }

  deleteRow(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa dòng này?')) {
      this.rowDeleted.emit(id);
    }
  }

  getNestedValue(obj: any, key: string, nestedKey?: string): any {
    if (nestedKey) {
      return obj[key]?.[nestedKey];
    }
    return obj[key];
  }

  setNestedValue(obj: any, key: string, nestedKey: string | undefined, value: any) {
    if (nestedKey) {
      if (!obj[key]) obj[key] = {};
      obj[key][nestedKey] = value;
    } else {
      obj[key] = value;
    }
  }

  getCellDisplay(row: any, col: DataColumn): string {
    const value = this.getNestedValue(row, col.key, col.nestedKey);

    if (col.type === 'date') {
      return formatDate(value);
    }

    if (col.type === 'number') {
      if (value === null || value === undefined || value === 0) return '';
      return formatVND(value).replace(' ₫', '');
    }

    return value || '';
  }

  getCellClass(col: DataColumn): string {
    let classes = col.class || '';
    if (col.type === 'number') {
      classes += ' text-right number-col';
    } else if (col.type === 'date') {
      classes += ' text-center date-col';
    }
    return classes.trim();
  }

  getDateInputValue(date: Date | string | null | undefined): string {
    if (!date) return '';
    if (typeof date === 'string') return date.substring(0, 10);
    return date.toISOString().substring(0, 10);
  }

  onDateChange(event: Event, row: any, key: string) {
    const value = (event.target as HTMLInputElement).value;
    row[key] = value ? new Date(value) : null;
  }

  onNumberChange(row: any, col: DataColumn) {
    // Trigger recalculation if needed
    this.rowSaved.emit({ ...row, _recalculate: true });
  }

  formatNumber(value: number | null): string {
    if (value === null || value === undefined) return '';
    return formatVND(value).replace(' ₫', '');
  }

  // Add new row inline
  addNewRow() {
    if (this.isAddingNew) return;
    
    // Create empty row with default values
    this.newRow = { id: 'new_' + Date.now() };
    this.dataColumns.forEach(col => {
      if (col.nestedKey) {
        if (!this.newRow[col.key]) this.newRow[col.key] = {};
        this.newRow[col.key][col.nestedKey] = col.type === 'number' ? null : '';
      } else {
        this.newRow[col.key] = col.type === 'number' ? null : (col.type === 'date' ? new Date() : '');
      }
    });
    
    this.isAddingNew = true;
    this.editingId = null;
  }

  saveNewRow() {
    if (this.newRow) {
      this.rowAdded.emit(this.newRow);
      this.newRow = null;
      this.isAddingNew = false;
    }
  }

  cancelNewRow() {
    this.newRow = null;
    this.isAddingNew = false;
  }

  // Dynamic font size based on number length
  getNumberFontSize(value: number | null | undefined): string {
    if (value === null || value === undefined) return '12px';
    const formatted = this.formatNumber(value);
    const len = formatted.length;
    
    // Base size 12px, reduce by 0.5px per character over 8, min 5px
    if (len <= 8) return '12px';
    if (len <= 10) return '11px';
    if (len <= 12) return '10px';
    if (len <= 14) return '9px';
    if (len <= 16) return '8px';
    if (len <= 18) return '7px';
    if (len <= 20) return '6px';
    return '5px';
  }
}
