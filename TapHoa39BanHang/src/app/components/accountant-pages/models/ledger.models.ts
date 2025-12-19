/**
 * Accounting Ledger Models
 * Circular 88/2021/TT-BTC Compliant
 * Vietnamese Household Business (Hộ Kinh Doanh) - 7 Sổ Kế Toán
 */

// ============ LEDGER 1: SỔ CHI TIẾT DOANH THU ============
export interface Ledger1DoanhThu {
  id?: string;
  ngayBan: Date; // Ngày bán
  soHoaDon: string; // Số hóa đơn
  hinhThucBan: 'TM' | 'CK'; // Tiền mặt / Chuyển khoản
  nhomHang: 'NuocNgot' | 'BanhKeo' | 'NhuYeuPham' | 'Khac';
  doanhThuChuaVAT: number; // Doanh thu chưa VAT
  thueVAT: number; // Thuế VAT
  tongTienThanhToan: number; // Auto: doanhThuChuaVAT + thueVAT
  ghiChu?: string;
}

// ============ LEDGER 2: SỔ CHI TIẾT VẬT LIỆU – HÀNG HÓA ============
export interface Ledger2VatLieu {
  id?: string;
  ngay: Date;
  tenHang: string; // Tên hàng / Nhóm hàng
  donViTinh: string; // Đơn vị tính (cái, kg, bao, etc.)
  tonDauKy: number; // Tồn đầu kỳ
  nhapTrongKy: number; // Nhập trong kỳ
  xuatTrongKy: number; // Xuất trong kỳ
  haoHutHuy?: number; // Hao hụt / hủy (optional)
  tonCuoiKy: number; // Auto: tonDauKy + nhapTrongKy - xuatTrongKy - haoHutHuy
  ghiChu?: string;
}

// ============ LEDGER 3: SỔ CHI PHÍ SẢN XUẤT KINH DOANH ============
export interface Ledger3ChiPhi {
  id?: string;
  ngayChi: Date;
  noiDungChi: string;
  loaiChiPhi: 'GiaVon' | 'LuongCong' | 'ThueMBang' | 'DienNuoc' | 'VanChuyen' | 'Khac';
  soTienChuaVAT: number;
  vatKhauTru: number; // VAT được khấu trừ
  tongTien: number; // Auto: soTienChuaVAT + vatKhauTru
  hinhThucThanhToan: 'TM' | 'CK';
  chungTuKemTheo?: string;
  ghiChu?: string;
}

// ============ LEDGER 4A: NHÂN VIÊN CHÍNH THỨC (ĐÓ BHXH) ============
export interface Ledger4ANhanVienChinhThuc {
  id?: string;
  thang: string; // MM/yyyy
  hoTen: string;
  luongCoBan: number;
  phuCap: number;
  tongLuong: number; // Auto: luongCoBan + phuCap
  bhxhNLD: number; // BHXH Người Lao Động
  bhxhChuHo: number; // BHXH Chủ Hộ
  thucLinh: number; // Auto: tongLuong - bhxhNLD - bhxhChuHo
  hinhThucTra: 'TM' | 'CK';
  kyNhan: boolean; // Checkbox
}

// ============ LEDGER 4B: NHÂN VIÊN KHOÁN (<2,000,000/lần) ============
export interface Ledger4BNhanVienKhoan {
  id?: string;
  ngayChi: Date;
  hoTen: string;
  congViecKhoan: string;
  soTienKhoan: number; // Must be < 2,000,000
  soCMND_CCCD: string;
  camKet08: boolean; // Cam kết 08 checkbox (required)
  thueTNCNKhauTru: number; // Default 0 if soTienKhoan < 2,000,000
  soTienThucTra: number; // Auto: soTienKhoan - thueTNCNKhauTru
  kyNhan: boolean;
}

// ============ LEDGER 5: SỔ THEO DÕI TÌNH HÌNH THANH TOÁN (CÔNG NỢ) ============
export interface Ledger5CongNo {
  id?: string;
  ngay: Date;
  doiTuong: string; // Tên nhà cung cấp / khách hàng
  loaiDoiTuong: 'NhaCungCap' | 'KhachHang';
  noiDung: string;
  phatsinhTang: number; // Phát sinh tăng (nợ mới)
  phatsinhGiam: number; // Phát sinh giảm (thanh toán)
  soDu: number; // Auto: running balance
  hanThanhToan: Date;
  ghiChu?: string;
}

// ============ LEDGER 6: SỔ QUỸ TIỀN MẶT ============
export interface Ledger6QuyTienMat {
  id?: string;
  ngay: Date;
  noiDungThuChi: string;
  thu: number; // Thu tiền
  chi: number; // Chi tiền
  tonQuy: number; // Auto: running balance (must not be negative)
  nguoiThuChi?: string;
  ghiChu?: string;
}

// ============ LEDGER 7: SỔ TIỀN GỬI NGÂN HÀNG ============
export interface Ledger7TienNganHang {
  id?: string;
  ngay: Date;
  soChungTu: string; // Số chứng từ / số tham chiếu giao dịch
  noiDungGiaoDich: string;
  thu: number; // Thu từ ngân hàng
  chi: number; // Chi ra ngân hàng
  soDu: number; // Auto: running balance
  doiTuongLienQuan?: string;
  ghiChu?: string;
  highlight?: boolean; // True if > 20,000,000 VND
}

// ============ UTILITY TYPES ============
export interface MonthYearFilter {
  month: number;
  year: number;
}

export interface LedgerStats {
  totalRows: number;
  sumByColumn?: { [key: string]: number };
}

export type AllLedgerTypes =
  | Ledger1DoanhThu
  | Ledger2VatLieu
  | Ledger3ChiPhi
  | Ledger4ANhanVienChinhThuc
  | Ledger4BNhanVienKhoan
  | Ledger5CongNo
  | Ledger6QuyTienMat
  | Ledger7TienNganHang;
