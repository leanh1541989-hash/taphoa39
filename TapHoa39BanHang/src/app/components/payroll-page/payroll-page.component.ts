import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService, Employee, AttendanceRecord, PayrollRecord as ServicePayrollRecord } from '../../services/employee.service';

// Regular employee payroll record
interface PayrollRecord {
  id: string;
  maNhanVien: string;
  stt: number;
  hoTen: string;
  chucDanh: string;
  luongCoBan: number;
  phuCapCaKeoDai: number;
  phuCapTracNhiem: number;
  phuCapQuanLyCa: number;
  phuCapXang: number;
  phuCapDienThoai: number;
  phuCapAnTrua: number;
  isSaved: boolean;
  isDirty: boolean;
}

// Contractor employee payroll record
interface ContractorPayrollRecord {
  id: string;
  maNhanVien: string;
  stt: number;
  hoTen: string;
  tongGioLam: number;      // Total hours from attendance
  donGiaGio: number;       // Hourly rate
  tienKhoan: number;       // donGiaGio * tongGioLam (calculated)
  thuong: number;          // Bonus
  phuCap: number;          // Allowance
  tongTienCong: number;    // tienKhoan + thuong + phuCap (calculated)
  thueTNCN: number;        // 10% of tongTienCong (calculated)
  thucTra: number;         // tongTienCong - thueTNCN (calculated)
  isSaved: boolean;
  isDirty: boolean;
}

@Component({
  selector: 'app-payroll-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './payroll-page.component.html',
  styleUrl: './payroll-page.component.css',
})
export class PayrollPageComponent implements OnInit {
  // Filter properties
  searchWorkerName: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();

  // Employee data
  employees: Employee[] = [];
  regularEmployees: Employee[] = [];
  contractorEmployees: Employee[] = [];

  // Payroll records
  payrollRecords: PayrollRecord[] = [];
  contractorPayrollRecords: ContractorPayrollRecord[] = [];

  // Attendance data for contractors
  attendanceRecords: AttendanceRecord[] = [];

  // Track deleted payroll IDs (to exclude from UI)
  deletedPayrollIds: Set<string> = new Set();

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeDateRange();
    this.loadData();
  }

  initializeDateRange() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.startDate = firstDayOfMonth;
    this.endDate = lastDayOfMonth;
  }

  async loadData() {
    // Step 1: Load deleted payroll IDs from IndexedDB
    await this.loadDeletedPayrollIds();

    // Step 2: Load saved payroll records from IndexedDB
    const savedPayrolls = await this.employeeService.filterPayrollsFromIndexedDB(this.getCurrentPeriod());

    // Step 3: Load employees
    this.employeeService.activeEmployees$.subscribe(employees => {
      this.employees = employees;
      this.separateEmployeeTypes();

      // Step 4: Load attendance and merge with saved payrolls
      this.loadAttendanceAndMergePayrolls(savedPayrolls);
    });

    await this.employeeService.loadEmployeesWithSync();
  }

  async loadDeletedPayrollIds() {
    try {
      const deletedIds = await this.employeeService.getDeletedPayrollIdsFromIndexedDB(this.getCurrentPeriod());
      this.deletedPayrollIds = new Set(deletedIds);
      console.log('📦 Loaded deleted payroll IDs:', this.deletedPayrollIds);
    } catch (error) {
      console.error('Error loading deleted payroll IDs:', error);
    }
  }

  separateEmployeeTypes() {
    this.regularEmployees = this.employees.filter(emp => !emp.nhanVienKhoan);
    this.contractorEmployees = this.employees.filter(emp => emp.nhanVienKhoan);
  }

  async loadAttendanceAndMergePayrolls(savedPayrolls: ServicePayrollRecord[]) {
    const fromDate = this.formatDateForAPI(this.startDate);
    const toDate = this.formatDateForAPI(this.endDate);

    // Try to load from IndexedDB first
    const cachedAttendance = await this.employeeService.filterAttendanceFromIndexedDB(fromDate, toDate);

    if (cachedAttendance.length > 0) {
      this.attendanceRecords = cachedAttendance;
      this.mergePayrollData(savedPayrolls);
    }

    // Also fetch from API to get latest data
    this.employeeService.getAttendanceByDateRange(fromDate, toDate).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.attendanceRecords = response.data;
          this.mergePayrollData(savedPayrolls);
        }
      },
      error: (error) => {
        console.error('Error loading attendance:', error);
        // Use cached data if available
        if (cachedAttendance.length === 0) {
          this.attendanceRecords = this.employeeService.getAttendanceFromCache();
          this.mergePayrollData(savedPayrolls);
        }
      }
    });
  }

  async mergePayrollData(savedPayrolls: ServicePayrollRecord[]) {
    this.loadPayrollData(savedPayrolls);
    this.loadContractorPayrollData(savedPayrolls);

    // Auto-save generated payroll records to IndexedDB
    await this.syncPayrollToIndexedDB();
  }

  /**
   * Sync current payroll records to IndexedDB
   * This saves attendance-generated data to payroll store
   */
  async syncPayrollToIndexedDB() {
    const period = this.getCurrentPeriod();
    const payrollsToSave: ServicePayrollRecord[] = [];

    // Convert regular employee payroll records
    for (const record of this.payrollRecords) {
      const payrollData: ServicePayrollRecord = {
        id: record.id,
        maNhanVien: record.maNhanVien,
        hoTen: record.hoTen,
        chucDanh: record.chucDanh,
        period: period,
        nhanVienKhoan: false,
        luongCoBan: record.luongCoBan,
        phuCapCaKeoDai: record.phuCapCaKeoDai,
        phuCapTracNhiem: record.phuCapTracNhiem,
        phuCapQuanLyCa: record.phuCapQuanLyCa,
        phuCapXang: record.phuCapXang,
        phuCapDienThoai: record.phuCapDienThoai,
        phuCapAnTrua: record.phuCapAnTrua,
        tongLuong: this.getTongLuong(record),
        bhxh: this.getBHXH(record),
        bhyt: this.getBHYT(record),
        bhtn: this.getBHTN(record),
        tongTrichBH: this.getTongTrichBH(record),
        thucLinh: this.getThucLinh(record)
      };
      payrollsToSave.push(payrollData);
    }

    // Convert contractor employee payroll records
    for (const record of this.contractorPayrollRecords) {
      const payrollData: ServicePayrollRecord = {
        id: record.id,
        maNhanVien: record.maNhanVien,
        hoTen: record.hoTen,
        period: period,
        nhanVienKhoan: true,
        tongGioLam: record.tongGioLam,
        donGiaGio: record.donGiaGio,
        tienKhoan: this.getTienKhoan(record),
        thuong: record.thuong,
        phuCap: record.phuCap,
        tongTienCong: this.getTongTienCong(record),
        thueTNCN: this.getThueTNCN(record),
        thucTra: this.getThucTra(record)
      };
      payrollsToSave.push(payrollData);
    }

    // Save all to IndexedDB
    if (payrollsToSave.length > 0) {
      await this.employeeService.savePayrollsToIndexedDB(payrollsToSave);
      console.log(`📦 Synced ${payrollsToSave.length} payroll records to IndexedDB`);
    }
  }

  loadPayrollData(savedPayrolls: ServicePayrollRecord[]) {
    const period = this.getCurrentPeriod();

    // Create payroll records for regular employees
    this.payrollRecords = this.regularEmployees
      .filter(emp => {
        // Exclude deleted records
        const payrollId = `${emp.maNhanVien}_${period}`;
        return !this.deletedPayrollIds.has(payrollId);
      })
      .map((emp, index) => {
        const payrollId = `${emp.maNhanVien}_${period}`;
        // Check if there's saved data for this employee
        const savedData = savedPayrolls.find(p => p.maNhanVien === emp.maNhanVien && !p.nhanVienKhoan);

        if (savedData) {
          return {
            id: payrollId,
            maNhanVien: emp.maNhanVien,
            stt: index + 1,
            hoTen: emp.hoTen,
            chucDanh: emp.chucDanh || '',
            luongCoBan: savedData.luongCoBan || 0,
            phuCapCaKeoDai: savedData.phuCapCaKeoDai || 0,
            phuCapTracNhiem: savedData.phuCapTracNhiem || 0,
            phuCapQuanLyCa: savedData.phuCapQuanLyCa || 0,
            phuCapXang: savedData.phuCapXang || 0,
            phuCapDienThoai: savedData.phuCapDienThoai || 0,
            phuCapAnTrua: savedData.phuCapAnTrua || 0,
            isSaved: true,
            isDirty: false
          };
        }

        return {
          id: payrollId,
          maNhanVien: emp.maNhanVien,
          stt: index + 1,
          hoTen: emp.hoTen,
          chucDanh: emp.chucDanh || '',
          luongCoBan: 0,
          phuCapCaKeoDai: 0,
          phuCapTracNhiem: 0,
          phuCapQuanLyCa: 0,
          phuCapXang: 0,
          phuCapDienThoai: 0,
          phuCapAnTrua: 0,
          isSaved: false,
          isDirty: false
        };
      });

    this.updateSTT();
  }

  loadContractorPayrollData(savedPayrolls: ServicePayrollRecord[]) {
    const period = this.getCurrentPeriod();

    // Create payroll records for contractor employees
    this.contractorPayrollRecords = this.contractorEmployees
      .filter(emp => {
        // Exclude deleted records
        const payrollId = `${emp.maNhanVien}_${period}`;
        return !this.deletedPayrollIds.has(payrollId);
      })
      .map((emp, index) => {
        const payrollId = `${emp.maNhanVien}_${period}`;
        const totalHours = this.getTotalHoursForEmployee(emp.maNhanVien);

        // Check if there's saved data for this employee
        const savedData = savedPayrolls.find(p => p.maNhanVien === emp.maNhanVien && p.nhanVienKhoan);

        if (savedData) {
          return {
            id: payrollId,
            maNhanVien: emp.maNhanVien,
            stt: index + 1,
            hoTen: emp.hoTen,
            tongGioLam: totalHours, // Always use current attendance data
            donGiaGio: savedData.donGiaGio || 0,
            tienKhoan: 0,
            thuong: savedData.thuong || 0,
            phuCap: savedData.phuCap || 0,
            tongTienCong: 0,
            thueTNCN: 0,
            thucTra: 0,
            isSaved: true,
            isDirty: false
          };
        }

        return {
          id: payrollId,
          maNhanVien: emp.maNhanVien,
          stt: index + 1,
          hoTen: emp.hoTen,
          tongGioLam: totalHours,
          donGiaGio: 0,
          tienKhoan: 0,
          thuong: 0,
          phuCap: 0,
          tongTienCong: 0,
          thueTNCN: 0,
          thucTra: 0,
          isSaved: false,
          isDirty: false
        };
      });

    this.updateContractorSTT();
  }

  getTotalHoursForEmployee(maNhanVien: string): number {
    const employeeAttendance = this.attendanceRecords.filter(
      record => record.workerId === maNhanVien
    );
    return employeeAttendance.reduce((sum, record) => sum + (record.totalHours || 0), 0);
  }

  // Filter handlers
  onStartDateChange(event: any) {
    this.startDate = event.value || this.startDate;
    this.reloadData();
  }

  onEndDateChange(event: any) {
    this.endDate = event.value || this.endDate;
    this.reloadData();
  }

  async reloadData() {
    // Reload deleted IDs and data for new period
    await this.loadDeletedPayrollIds();
    const savedPayrolls = await this.employeeService.filterPayrollsFromIndexedDB(this.getCurrentPeriod());
    this.loadAttendanceAndMergePayrolls(savedPayrolls);
  }

  // Filtered records
  get filteredPayrollRecords(): PayrollRecord[] {
    if (!this.searchWorkerName) {
      return this.payrollRecords;
    }
    return this.payrollRecords.filter(r =>
      r.hoTen.toLowerCase().includes(this.searchWorkerName.toLowerCase()) ||
      r.maNhanVien.toLowerCase().includes(this.searchWorkerName.toLowerCase())
    );
  }

  get filteredContractorRecords(): ContractorPayrollRecord[] {
    if (!this.searchWorkerName) {
      return this.contractorPayrollRecords;
    }
    return this.contractorPayrollRecords.filter(r =>
      r.hoTen.toLowerCase().includes(this.searchWorkerName.toLowerCase()) ||
      r.maNhanVien.toLowerCase().includes(this.searchWorkerName.toLowerCase())
    );
  }

  // Regular payroll calculations
  getTongLuong(record: PayrollRecord): number {
    return record.luongCoBan +
           record.phuCapCaKeoDai +
           record.phuCapTracNhiem +
           record.phuCapQuanLyCa +
           record.phuCapXang +
           record.phuCapDienThoai +
           record.phuCapAnTrua;
  }

  getBHXH(record: PayrollRecord): number {
    return this.getTongLuong(record) * 0.08;
  }

  getBHYT(record: PayrollRecord): number {
    return this.getTongLuong(record) * 0.015;
  }

  getBHTN(record: PayrollRecord): number {
    return this.getTongLuong(record) * 0.01;
  }

  getTongTrichBH(record: PayrollRecord): number {
    return this.getBHXH(record) + this.getBHYT(record) + this.getBHTN(record);
  }

  getThucLinh(record: PayrollRecord): number {
    return this.getTongLuong(record) - this.getTongTrichBH(record);
  }

  // Contractor payroll calculations
  getTienKhoan(record: ContractorPayrollRecord): number {
    return record.donGiaGio * record.tongGioLam;
  }

  getTongTienCong(record: ContractorPayrollRecord): number {
    return this.getTienKhoan(record) + record.thuong + record.phuCap;
  }

  getThueTNCN(record: ContractorPayrollRecord): number {
    const tongTienCong = this.getTongTienCong(record);
    // Only apply 10% tax if total > 1,999,999
    if (tongTienCong > 1999999) {
      return tongTienCong * 0.1;
    }
    return 0;
  }

  getThucTra(record: ContractorPayrollRecord): number {
    return this.getTongTienCong(record) - this.getThueTNCN(record);
  }

  // Delete records
  async deleteRecord(record: PayrollRecord) {
    const confirmed = confirm(`Bạn có chắc chắn muốn xóa bản ghi của "${record.hoTen}"?`);
    if (confirmed) {
      const isTemporaryRecord = record.id && record.id.length > 10 && !isNaN(Number(record.id));
      const payrollId = `${record.maNhanVien}_${this.getCurrentPeriod()}`;

      if (isTemporaryRecord && !record.isSaved) {
        // Just remove from local array if it's a temporary unsaved record
        this.payrollRecords = this.payrollRecords.filter(r => r.id !== record.id);
        this.updateSTT();
      } else {
        // Add to deleted list in IndexedDB
        await this.employeeService.addDeletedPayrollIdToIndexedDB(payrollId, this.getCurrentPeriod());
        this.deletedPayrollIds.add(payrollId);

        // Call delete API
        this.employeeService.deletePayroll(payrollId).subscribe({
          next: (response) => {
            this.payrollRecords = this.payrollRecords.filter(r => r.id !== record.id);
            this.updateSTT();
            this.snackBar.open('Đã xóa bản ghi thành công!', 'Đóng', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error deleting payroll:', error);
            // Still remove from UI
            this.payrollRecords = this.payrollRecords.filter(r => r.id !== record.id);
            this.updateSTT();
            this.snackBar.open('Đã xóa bản ghi khỏi danh sách', 'Đóng', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        });
      }
    }
  }

  addNewContractorRecord() {
    const newRecord: ContractorPayrollRecord = {
      id: Date.now().toString(),
      maNhanVien: '',
      stt: this.contractorPayrollRecords.length + 1,
      hoTen: '',
      tongGioLam: 0,
      donGiaGio: 0,
      tienKhoan: 0,
      thuong: 0,
      phuCap: 0,
      tongTienCong: 0,
      thueTNCN: 0,
      thucTra: 0,
      isSaved: false,
      isDirty: true
    };
    this.contractorPayrollRecords.push(newRecord);
  }

  async deleteContractorRecord(record: ContractorPayrollRecord) {
    const confirmed = confirm(`Bạn có chắc chắn muốn xóa bản ghi của "${record.hoTen}"?`);
    if (confirmed) {
      const isTemporaryRecord = record.id && record.id.length > 10 && !isNaN(Number(record.id));
      const payrollId = `${record.maNhanVien}_${this.getCurrentPeriod()}`;

      if (isTemporaryRecord && !record.isSaved) {
        // Just remove from local array if it's a temporary unsaved record
        this.contractorPayrollRecords = this.contractorPayrollRecords.filter(r => r.id !== record.id);
        this.updateContractorSTT();
      } else {
        // Add to deleted list in IndexedDB
        await this.employeeService.addDeletedPayrollIdToIndexedDB(payrollId, this.getCurrentPeriod());
        this.deletedPayrollIds.add(payrollId);

        // Call delete API
        this.employeeService.deletePayroll(payrollId).subscribe({
          next: (response) => {
            this.contractorPayrollRecords = this.contractorPayrollRecords.filter(r => r.id !== record.id);
            this.updateContractorSTT();
            this.snackBar.open('Đã xóa bản ghi thành công!', 'Đóng', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error deleting contractor payroll:', error);
            // Still remove from UI
            this.contractorPayrollRecords = this.contractorPayrollRecords.filter(r => r.id !== record.id);
            this.updateContractorSTT();
            this.snackBar.open('Đã xóa bản ghi khỏi danh sách', 'Đóng', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        });
      }
    }
  }

  updateSTT() {
    this.payrollRecords.forEach((record, index) => {
      record.stt = index + 1;
    });
  }

  updateContractorSTT() {
    this.contractorPayrollRecords.forEach((record, index) => {
      record.stt = index + 1;
    });
  }

  // Format helpers
  formatNumber(value: number): string {
    return Math.round(value).toLocaleString('en-US');
  }

  formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onInputChange(record?: PayrollRecord | ContractorPayrollRecord) {
    // Mark record as dirty when input changes
    if (record) {
      record.isDirty = true;
    }
  }

  shouldHighlightWorker(name: string): boolean {
    if (!this.searchWorkerName || this.searchWorkerName.trim() === '') {
      return false;
    }
    return name.toLowerCase().includes(this.searchWorkerName.toLowerCase());
  }

  // Get current period in YYYY-MM format
  getCurrentPeriod(): string {
    const year = this.startDate.getFullYear();
    const month = String(this.startDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // Save regular employee payroll record
  savePayrollRecord(record: PayrollRecord) {
    const period = this.getCurrentPeriod();
    const payrollData: ServicePayrollRecord = {
      maNhanVien: record.maNhanVien,
      hoTen: record.hoTen,
      chucDanh: record.chucDanh,
      period: period,
      nhanVienKhoan: false,
      luongCoBan: record.luongCoBan,
      phuCapCaKeoDai: record.phuCapCaKeoDai,
      phuCapTracNhiem: record.phuCapTracNhiem,
      phuCapQuanLyCa: record.phuCapQuanLyCa,
      phuCapXang: record.phuCapXang,
      phuCapDienThoai: record.phuCapDienThoai,
      phuCapAnTrua: record.phuCapAnTrua,
      tongLuong: this.getTongLuong(record),
      bhxh: this.getBHXH(record),
      bhyt: this.getBHYT(record),
      bhtn: this.getBHTN(record),
      tongTrichBH: this.getTongTrichBH(record),
      thucLinh: this.getThucLinh(record)
    };

    this.employeeService.savePayroll(payrollData).subscribe({
      next: (response) => {
        if (response.success) {
          record.isSaved = true;
          record.isDirty = false;
          // Remove from deleted list if it was previously deleted
          const payrollId = `${record.maNhanVien}_${period}`;
          if (this.deletedPayrollIds.has(payrollId)) {
            this.deletedPayrollIds.delete(payrollId);
            this.employeeService.removeDeletedPayrollIdFromIndexedDB(payrollId, period);
          }
          this.snackBar.open('Đã lưu bảng lương thành công!', 'Đóng', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error saving payroll:', error);
        this.snackBar.open('Lỗi khi lưu bảng lương!', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // Save contractor employee payroll record
  saveContractorPayrollRecord(record: ContractorPayrollRecord) {
    const period = this.getCurrentPeriod();
    const payrollData: ServicePayrollRecord = {
      maNhanVien: record.maNhanVien,
      hoTen: record.hoTen,
      period: period,
      nhanVienKhoan: true,
      tongGioLam: record.tongGioLam,
      donGiaGio: record.donGiaGio,
      tienKhoan: this.getTienKhoan(record),
      thuong: record.thuong,
      phuCap: record.phuCap,
      tongTienCong: this.getTongTienCong(record),
      thueTNCN: this.getThueTNCN(record),
      thucTra: this.getThucTra(record)
    };

    this.employeeService.savePayroll(payrollData).subscribe({
      next: (response) => {
        if (response.success) {
          record.isSaved = true;
          record.isDirty = false;
          // Remove from deleted list if it was previously deleted
          const payrollId = `${record.maNhanVien}_${period}`;
          if (this.deletedPayrollIds.has(payrollId)) {
            this.deletedPayrollIds.delete(payrollId);
            this.employeeService.removeDeletedPayrollIdFromIndexedDB(payrollId, period);
          }
          this.snackBar.open('Đã lưu bảng lương thành công!', 'Đóng', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error saving contractor payroll:', error);
        this.snackBar.open('Lỗi khi lưu bảng lương!', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
