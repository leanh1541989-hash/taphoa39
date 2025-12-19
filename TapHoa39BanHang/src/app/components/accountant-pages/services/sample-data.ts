/**
 * Sample Data Generator for Testing
 * Generates mock data for all 7 ledgers
 */

import {
  Ledger1DoanhThu,
  Ledger2VatLieu,
  Ledger3ChiPhi,
  Ledger4ANhanVienChinhThuc,
  Ledger4BNhanVienKhoan,
  Ledger5CongNo,
  Ledger6QuyTienMat,
  Ledger7TienNganHang,
} from '../models/ledger.models';

/**
 * Generate sample Ledger 1 data (Revenue)
 */
export function generateSampleLedger1(): Ledger1DoanhThu[] {
  return [
    {
      id: '1',
      ngayBan: new Date(2024, 11, 1),
      soHoaDon: 'HD001',
      hinhThucBan: 'TM',
      nhomHang: 'NuocNgot',
      doanhThuChuaVAT: 500000,
      thueVAT: 50000,
      tongTienThanhToan: 550000,
      ghiChu: 'Bán nước ngọt',
    },
    {
      id: '2',
      ngayBan: new Date(2024, 11, 2),
      soHoaDon: 'HD002',
      hinhThucBan: 'CK',
      nhomHang: 'BanhKeo',
      doanhThuChuaVAT: 800000,
      thueVAT: 80000,
      tongTienThanhToan: 880000,
      ghiChu: 'Bán bánh kẹo',
    },
    {
      id: '3',
      ngayBan: new Date(2024, 11, 3),
      soHoaDon: 'HD003',
      hinhThucBan: 'TM',
      nhomHang: 'NhuYeuPham',
      doanhThuChuaVAT: 1200000,
      thueVAT: 120000,
      tongTienThanhToan: 1320000,
      ghiChu: 'Bán nhu yếu phẩm',
    },
  ];
}

/**
 * Generate sample Ledger 2 data (Inventory)
 */
export function generateSampleLedger2(): Ledger2VatLieu[] {
  return [
    {
      id: '1',
      ngay: new Date(2024, 11, 1),
      tenHang: 'Sữa tươi 1L',
      donViTinh: 'bao',
      tonDauKy: 100,
      nhapTrongKy: 50,
      xuatTrongKy: 30,
      haoHutHuy: 2,
      tonCuoiKy: 118,
      ghiChu: 'Hàng từ nhà cung cấp A',
    },
    {
      id: '2',
      ngay: new Date(2024, 11, 2),
      tenHang: 'Nước mắm 750ml',
      donViTinh: 'chai',
      tonDauKy: 200,
      nhapTrongKy: 100,
      xuatTrongKy: 80,
      haoHutHuy: 0,
      tonCuoiKy: 220,
      ghiChu: 'Hàng bán chạy',
    },
  ];
}

/**
 * Generate sample Ledger 3 data (Expenses)
 */
export function generateSampleLedger3(): Ledger3ChiPhi[] {
  return [
    {
      id: '1',
      ngayChi: new Date(2024, 11, 1),
      noiDungChi: 'Tiền điện tháng 12',
      loaiChiPhi: 'DienNuoc',
      soTienChuaVAT: 1500000,
      vatKhauTru: 0,
      tongTien: 1500000,
      hinhThucThanhToan: 'CK',
      chungTuKemTheo: 'PKT-2024-12-001',
      ghiChu: 'Thanh toán điện',
    },
    {
      id: '2',
      ngayChi: new Date(2024, 11, 5),
      noiDungChi: 'Thuê mặt bằng tháng 12',
      loaiChiPhi: 'ThueMBang',
      soTienChuaVAT: 5000000,
      vatKhauTru: 0,
      tongTien: 5000000,
      hinhThucThanhToan: 'CK',
      chungTuKemTheo: 'HD-2024-12-002',
      ghiChu: 'Thuê shop',
    },
  ];
}

/**
 * Generate sample Ledger 4A data (Official Employees)
 */
export function generateSampleLedger4A(): Ledger4ANhanVienChinhThuc[] {
  return [
    {
      id: '1',
      thang: '12/2024',
      hoTen: 'Nguyễn Văn A',
      luongCoBan: 5000000,
      phuCap: 500000,
      tongLuong: 5500000,
      bhxhNLD: 550000,
      bhxhChuHo: 550000,
      thucLinh: 4400000,
      hinhThucTra: 'CK',
      kyNhan: true,
    },
    {
      id: '2',
      thang: '12/2024',
      hoTen: 'Trần Thị B',
      luongCoBan: 4000000,
      phuCap: 300000,
      tongLuong: 4300000,
      bhxhNLD: 430000,
      bhxhChuHo: 430000,
      thucLinh: 3440000,
      hinhThucTra: 'TM',
      kyNhan: true,
    },
  ];
}

/**
 * Generate sample Ledger 4B data (Contract Workers)
 */
export function generateSampleLedger4B(): Ledger4BNhanVienKhoan[] {
  return [
    {
      id: '1',
      ngayChi: new Date(2024, 11, 10),
      hoTen: 'Lê Văn C',
      congViecKhoan: 'Vẽ bảng quảng cáo',
      soTienKhoan: 1500000,
      soCMND_CCCD: '012345678901',
      camKet08: true,
      thueTNCNKhauTru: 0,
      soTienThucTra: 1500000,
      kyNhan: true,
    },
  ];
}

/**
 * Generate sample Ledger 5 data (Debt)
 */
export function generateSampleLedger5(): Ledger5CongNo[] {
  return [
    {
      id: '1',
      ngay: new Date(2024, 11, 5),
      doiTuong: 'Công ty ABC',
      loaiDoiTuong: 'NhaCungCap',
      noiDung: 'Mua hàng hóa lô đầu',
      phatsinhTang: 10000000,
      phatsinhGiam: 0,
      soDu: 10000000,
      hanThanhToan: new Date(2024, 11, 20),
      ghiChu: 'Hóa đơn HĐ-001',
    },
    {
      id: '2',
      ngay: new Date(2024, 11, 10),
      doiTuong: 'Công ty ABC',
      loaiDoiTuong: 'NhaCungCap',
      noiDung: 'Thanh toán lô 1',
      phatsinhTang: 0,
      phatsinhGiam: 5000000,
      soDu: 5000000,
      hanThanhToan: new Date(2024, 11, 25),
      ghiChu: 'Thanh toán 50%',
    },
  ];
}

/**
 * Generate sample Ledger 6 data (Cash Fund)
 */
export function generateSampleLedger6(): Ledger6QuyTienMat[] {
  return [
    {
      id: '1',
      ngay: new Date(2024, 11, 1),
      noiDungThuChi: 'Doanh thu bán hàng ngày 1',
      thu: 5000000,
      chi: 0,
      tonQuy: 5000000,
      nguoiThuChi: 'Nguyễn Văn A',
      ghiChu: 'Doanh thu',
    },
    {
      id: '2',
      ngay: new Date(2024, 11, 2),
      noiDungThuChi: 'Chi tiền điện',
      thu: 0,
      chi: 1500000,
      tonQuy: 3500000,
      nguoiThuChi: 'Trần Thị B',
      ghiChu: 'Tiền điện',
    },
    {
      id: '3',
      ngay: new Date(2024, 11, 3),
      noiDungThuChi: 'Doanh thu bán hàng ngày 3',
      thu: 6000000,
      chi: 0,
      tonQuy: 9500000,
      nguoiThuChi: 'Nguyễn Văn A',
      ghiChu: 'Doanh thu',
    },
  ];
}

/**
 * Generate sample Ledger 7 data (Bank)
 */
export function generateSampleLedger7(): Ledger7TienNganHang[] {
  return [
    {
      id: '1',
      ngay: new Date(2024, 11, 1),
      soChungTu: 'REF-001',
      noiDungGiaoDich: 'Chuyển khoản từ khách hàng',
      thu: 25000000,
      chi: 0,
      soDu: 25000000,
      doiTuongLienQuan: 'Khách hàng X',
      ghiChu: 'Cộng tiền hàng',
      highlight: true,
    },
    {
      id: '2',
      ngay: new Date(2024, 11, 2),
      soChungTu: 'REF-002',
      noiDungGiaoDich: 'Chi tiền lương',
      thu: 0,
      chi: 15000000,
      soDu: 10000000,
      doiTuongLienQuan: 'Nhân viên',
      ghiChu: 'Tiền lương tháng 12',
      highlight: true,
    },
  ];
}

/**
 * Initialize all sample data to LocalStorage
 */
export function initializeSampleData() {
  localStorage.setItem(
    'accountant_ledger1',
    JSON.stringify(generateSampleLedger1())
  );
  localStorage.setItem(
    'accountant_ledger2',
    JSON.stringify(generateSampleLedger2())
  );
  localStorage.setItem(
    'accountant_ledger3',
    JSON.stringify(generateSampleLedger3())
  );
  localStorage.setItem(
    'accountant_ledger4a',
    JSON.stringify(generateSampleLedger4A())
  );
  localStorage.setItem(
    'accountant_ledger4b',
    JSON.stringify(generateSampleLedger4B())
  );
  localStorage.setItem(
    'accountant_ledger5',
    JSON.stringify(generateSampleLedger5())
  );
  localStorage.setItem(
    'accountant_ledger6',
    JSON.stringify(generateSampleLedger6())
  );
  localStorage.setItem(
    'accountant_ledger7',
    JSON.stringify(generateSampleLedger7())
  );

  console.log('✅ Sample data initialized in LocalStorage');
}

/**
 * Clear all sample data
 */
export function clearSampleData() {
  [
    'accountant_ledger1',
    'accountant_ledger2',
    'accountant_ledger3',
    'accountant_ledger4a',
    'accountant_ledger4b',
    'accountant_ledger5',
    'accountant_ledger6',
    'accountant_ledger7',
  ].forEach((key) => {
    localStorage.removeItem(key);
  });
  console.log('✅ Sample data cleared from LocalStorage');
}

/**
 * Usage:
 * 
 * In your app initialization (app.component.ts or main.ts):
 * 
 * import { initializeSampleData } from './components/accountant-pages/services/sample-data.ts';
 * 
 * ngOnInit() {
 *   // Initialize sample data on first load (optional)
 *   if (!localStorage.getItem('accountant_initialized')) {
 *     initializeSampleData();
 *     localStorage.setItem('accountant_initialized', 'true');
 *   }
 * }
 */
