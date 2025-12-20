/**
 * Accounting Ledger Models
 * Circular 88/2021/TT-BTC - Appendix 2 Compliant
 * Vietnamese Household Business (Hộ Kinh Doanh) - 7 Sổ Kế Toán
 * Mẫu sổ kế toán: S1-HKD → S7-HKD
 */

// ============ COMMON TYPES ============
export interface ChungTu {
  soHieu: string;      // Số hiệu
  ngayThang: Date;     // Ngày, tháng
}

export interface LedgerHeader {
  tenHoKinhDoanh: string;           // HỘ, CÁ NHÂN KINH DOANH
  diaChi: string;                   // Địa chỉ
  tenDiaDiemKinhDoanh?: string;     // Tên địa điểm kinh doanh
  nam: number;                      // Năm
  mauSo: string;                    // Mẫu số (S1-HKD, S2-HKD, etc.)
}

// ============ S1-HKD: SỔ CHI TIẾT DOANH THU BÁN HÀNG HÓA, DỊCH VỤ ============
export interface S1_DoanhThu {
  id?: string;
  ngayThangGhiSo: Date;                        // Cột A: Ngày, tháng ghi sổ
  chungTu: ChungTu;                            // Cột B, C: Chứng từ
  dienGiai: string;                            // Cột D: Diễn giải
  // Doanh thu bán hàng hóa, dịch vụ:
  doanhThuPhanPhoi: number;                    // Phân phối, cung cấp hàng hóa
  doanhThuDichVu?: number;                     // Dịch vụ (optional)
  doanhThuSanXuat?: number;                    // Sản xuất (optional)
  doanhThuKhac: number;                        // Hoạt động kinh doanh khác
  ghiChu?: string;                             // Ghi chú
}

// ============ S2-HKD: SỔ CHI TIẾT VẬT LIỆU, DỤNG CỤ, SẢN PHẨM, HÀNG HÓA ============
export interface S2_VatLieu {
  id?: string;
  chungTu: ChungTu;                            // Chứng từ (Số hiệu, Ngày tháng)
  dienGiai: string;                            // Diễn giải
  donViTinh: string;                           // Đơn vị tính
  donGia: number;                              // Đơn giá
  // Nhập
  nhapSoLuong: number;                         // Số lượng nhập
  nhapThanhTien: number;                       // Thành tiền nhập
  // Xuất
  xuatSoLuong: number;                         // Số lượng xuất
  xuatThanhTien: number;                       // Thành tiền xuất
  // Tồn
  tonSoLuong: number;                          // Số lượng tồn
  tonThanhTien: number;                        // Thành tiền tồn
  ghiChu?: string;                             // Ghi chú
}

// ============ S3-HKD: SỔ CHI PHÍ SẢN XUẤT, KINH DOANH ============
export interface S3_ChiPhi {
  id?: string;
  ngayThangGhiSo: Date;                        // Cột A: Ngày, tháng ghi sổ
  chungTu: ChungTu;                            // Cột B, C: Chứng từ
  dienGiai: string;                            // Cột D: Diễn giải
  tongSoTien: number;                          // Tổng số tiền (cột E)
  // Chia ra (7 cột phân loại chi phí theo TT88):
  tienVatLieu: number;                         // Tiền vật liệu, dụng cụ, hàng hóa (cột 1)
  tienNhanCong: number;                        // Tiền nhân công (cột 2)
  chiPhiKhauHao: number;                       // Chi phí khấu hao TSCĐ (cột 3)
  chiPhiThueMatBang: number;                   // Chi phí thuê nhà, đất, mặt bằng SXKD (cột 4)
  chiPhiDienNuoc: number;                      // Chi phí điện, nước, nhiên liệu (cột 5)
  chiPhiVanChuyen: number;                     // Chi phí vận chuyển (cột 6)
  chiPhiMuaNgoaiKhac: number;                  // Chi phí mua ngoài khác (cột 7)
}

// ============ S4-HKD: SỔ THEO DÕI TÌNH HÌNH THỰC HIỆN NGHĨA VỤ THUẾ VỚI NSNN ============
export interface S4_NghiaVuThue {
  id?: string;
  chungTu: ChungTu;                            // Chứng từ (Số hiệu, Ngày tháng)
  dienGiai: string;                            // Diễn giải
  soThuePhaINop: number;                       // Số thuế phải nộp (cột 1)
  soThueDaNop: number;                         // Số thuế đã nộp (cột 2)
  ghiChu?: string;                             // Ghi chú
}

// ============ S5-HKD: SỔ THEO DÕI TÌNH HÌNH THANH TOÁN TIỀN LƯƠNG VÀ CÁC KHOẢN NỘP THEO LƯƠNG ============
export interface S5_TienLuong {
  id?: string;
  ngayThangGhiSo: Date;                        // Ngày, tháng ghi sổ
  chungTu: ChungTu;                            // Chứng từ (Số hiệu, Ngày tháng)
  dienGiai: string;                            // Diễn giải
  // Tiền lương (cột 1, 2, 3)
  luongPhaiTra: number;                        // Số phải trả
  luongDaTra: number;                          // Số đã trả
  luongConPhaiTra: number;                     // Số còn phải trả
  // BHXH (cột 4, 5, 6)
  bhxhPhaiNop: number;                         // Số phải nộp
  bhxhDaNop: number;                           // Số đã nộp
  bhxhConPhaiNop: number;                      // Số còn phải nộp
  // BHYT (cột 7, 8, 9)
  bhytPhaiNop: number;                         // Số phải nộp
  bhytDaNop: number;                           // Số đã nộp
  bhytConPhaiNop: number;                      // Số còn phải nộp
  // BHTN (cột 10, 11, 12)
  bhtnPhaiNop: number;                         // Số phải nộp
  bhtnDaNop: number;                           // Số đã nộp
  bhtnConPhaiNop: number;                      // Số còn phải nộp
  ghiChu?: string;                             // Ghi chú
}

// ============ S6-HKD: SỔ QUỸ TIỀN MẶT ============
export interface S6_QuyTienMat {
  id?: string;
  ngayThangGhiSo: Date;                        // Ngày, tháng ghi sổ (cột A)
  ngayThangChungTu: Date;                      // Ngày, tháng chứng từ (cột B)
  soHieuChungTu: string;                       // Số hiệu chứng từ (cột C)
  dienGiai: string;                            // Diễn giải (cột D)
  // Số tiền
  soTienThu: number;                           // Thu (cột 1)
  soTienChi: number;                           // Chi (cột 2)
  soTienTon: number;                           // Tồn (cột 3)
  ghiChu?: string;                             // Ghi chú (cột E)
}

// ============ S7-HKD: SỔ TIỀN GỬI NGÂN HÀNG ============
export interface S7_TienNganHang {
  id?: string;
  ngayThangGhiSo: Date;                        // Ngày, tháng ghi sổ (cột A)
  chungTu: ChungTu;                            // Chứng từ (Số hiệu B, Ngày tháng C)
  dienGiai: string;                            // Diễn giải (cột D)
  // Số tiền
  soTienGuiVao: number;                        // Gửi vào (cột 1)
  soTienRutRa: number;                         // Rút ra (cột 2)
  soTienConLai: number;                        // Còn lại (cột 3)
  ghiChu?: string;                             // Ghi chú (cột E)
}

// ============ FOOTER SUMMARY TYPES ============
export interface LedgerFooter {
  soDuDauKy?: number;
  soPhatSinhTrongKy?: number;
  congPhatSinhTrongKy?: number;
  soDuCuoiKy?: number;
  tongCong?: number;
}

// ============ BACKWARD COMPATIBILITY - OLD INTERFACES ============

export interface Ledger1DoanhThu {
  id?: string;
  ngayBan: Date;
  soHoaDon: string;
  hinhThucBan: 'TM' | 'CK';
  nhomHang: 'NuocNgot' | 'BanhKeo' | 'NhuYeuPham' | 'Khac';
  doanhThuChuaVAT: number;
  thueVAT: number;
  tongTienThanhToan: number;
  ghiChu?: string;
}

export interface Ledger2VatLieu {
  id?: string;
  ngay: Date;
  tenHang: string;
  donViTinh: string;
  tonDauKy: number;
  nhapTrongKy: number;
  xuatTrongKy: number;
  haoHutHuy?: number;
  tonCuoiKy: number;
  ghiChu?: string;
}

export interface Ledger3ChiPhi {
  id?: string;
  ngayChi: Date;
  noiDungChi: string;
  loaiChiPhi: 'GiaVon' | 'LuongCong' | 'ThueMBang' | 'DienNuoc' | 'VanChuyen' | 'Khac';
  soTienChuaVAT: number;
  vatKhauTru: number;
  tongTien: number;
  hinhThucThanhToan: 'TM' | 'CK';
  chungTuKemTheo?: string;
  ghiChu?: string;
}

export interface Ledger4ANhanVienChinhThuc {
  id?: string;
  thang: string;
  hoTen: string;
  luongCoBan: number;
  phuCap: number;
  tongLuong: number;
  bhxhNLD: number;
  bhxhChuHo: number;
  thucLinh: number;
  hinhThucTra: 'TM' | 'CK';
  kyNhan: boolean;
}

export interface Ledger4BNhanVienKhoan {
  id?: string;
  ngayChi: Date;
  hoTen: string;
  congViecKhoan: string;
  soTienKhoan: number;
  soCMND_CCCD: string;
  camKet08: boolean;
  thueTNCNKhauTru: number;
  soTienThucTra: number;
  kyNhan: boolean;
}

export interface Ledger5CongNo {
  id?: string;
  ngay: Date;
  doiTuong: string;
  loaiDoiTuong: 'NhaCungCap' | 'KhachHang';
  noiDung: string;
  phatsinhTang: number;
  phatsinhGiam: number;
  soDu: number;
  hanThanhToan: Date;
  ghiChu?: string;
}

export interface Ledger6QuyTienMat {
  id?: string;
  ngay: Date;
  noiDungThuChi: string;
  thu: number;
  chi: number;
  tonQuy: number;
  nguoiThuChi?: string;
  ghiChu?: string;
}

export interface Ledger7TienNganHang {
  id?: string;
  ngay: Date;
  soChungTu: string;
  noiDungGiaoDich: string;
  thu: number;
  chi: number;
  soDu: number;
  doiTuongLienQuan?: string;
  ghiChu?: string;
  highlight?: boolean;
}

export interface MonthYearFilter {
  month: number;
  year: number;
}

export interface LedgerStats {
  totalRows: number;
  sumByColumn?: { [key: string]: number };
}

export type AllLedgerTypes =
  | S1_DoanhThu
  | S2_VatLieu
  | S3_ChiPhi
  | S4_NghiaVuThue
  | S5_TienLuong
  | S6_QuyTienMat
  | S7_TienNganHang;
