import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-accountant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './accountant-layout.component.html',
  styleUrl: './accountant-layout.component.css',
})
export class AccountantLayoutComponent {
  downloadReport() {
    alert('📊 Tính năng xuất báo cáo sẽ được cập nhật sớm');
  }

  clearData() {
    alert(
      '⚠️ Xóa tất cả dữ liệu không thể hoàn tác. Vui lòng sao lưu trước.'
    );
  }
}
