
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("form_dang_ky");
    const hoTen = document.getElementById("ho_ten");
    const email = document.getElementById("email");
    const matKhau = document.getElementById("mat_khau");
    const nhapLaiMatKhau = document.getElementById("nhap_lai_mat_khau");
    const dieuKhoan = document.getElementById("dong_y_dieu_khoan");
    const thongBao = document.getElementById("hop_thong_bao");

    // Kiểm tra form có tồn tại không
    if (!form || !thongBao) {
        console.error("Không tìm thấy form đăng ký hoặc hộp thông báo!");
        return;
    }

    // Hàm hiển thị thông báo
    function hienThiThongBao(noiDung, loai) {
        thongBao.textContent = noiDung;
        thongBao.className = "hop_thong_bao " + loai;
    }

    // Hiện / ẩn mật khẩu
    const cacNutMatKhau = document.querySelectorAll(".nut_an_hien_mk");

    cacNutMatKhau.forEach(function (nut) {
        nut.addEventListener("click", function () {
            const idInput = nut.getAttribute("data-target");
            const input = document.getElementById(idInput);
            const icon = nut.querySelector("i");

            if (input.type === "password") {
                input.type = "text";
                icon.className = "fa-regular fa-eye";
            } else {
                input.type = "password";
                icon.className = "fa-regular fa-eye-slash";
            }
        });
    });

    // Xử lý đăng ký
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const ten = hoTen.value.trim();
        const mail = email.value.trim().toLowerCase();
        const mk = matKhau.value;
        const nhapLaiMk = nhapLaiMatKhau.value;

        // Kiểm tra họ tên
        if (ten === "") {
            hienThiThongBao("Vui lòng nhập họ và tên!", "loi");
            hoTen.focus();
            return;
        }

        // Kiểm tra email
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(mail)) {
            hienThiThongBao("Email không hợp lệ!", "loi");
            email.focus();
            return;
        }

        // Kiểm tra mật khẩu
        if (mk.length < 8) {
            hienThiThongBao(
                "Mật khẩu phải có ít nhất 8 ký tự!",
                "loi"
            );
            matKhau.focus();
            return;
        }

        // Kiểm tra nhập lại mật khẩu
        if (mk !== nhapLaiMk) {
            hienThiThongBao(
                "Mật khẩu nhập lại không khớp!",
                "loi"
            );
            nhapLaiMatKhau.focus();
            return;
        }

        // Kiểm tra điều khoản
        if (!dieuKhoan.checked) {
            hienThiThongBao(
                "Vui lòng đồng ý với điều khoản sử dụng!",
                "loi"
            );
            return;
        }

        // Kiểm tra email trùng và lưu thông tin
        try {
            const emailDaTonTai = localStorage.getItem(
                "taiKhoan_" + mail
            );

            if (emailDaTonTai !== null) {
                hienThiThongBao(
                    "Email này đã được đăng ký!",
                    "loi"
                );
                email.focus();
                return;
            }

            // Lưu thông tin đăng ký demo
            localStorage.setItem("taiKhoan_" + mail, ten);

            // Hiển thị thông báo thành công
            hienThiThongBao(
                "Đăng ký thành công! Đang chuyển đến trang Về chúng tôi...",
                "thanh_cong"
            );

            // Xóa dữ liệu form
            form.reset();

            // Chuyển sang About Us sau 1,5 giây
            setTimeout(function () {
                window.location.href = form.dataset.redirect;
            }, 1500);

        } catch (error) {
            console.error("Lỗi đăng ký:", error);

            hienThiThongBao(
                "Không thể lưu thông tin đăng ký!",
                "loi"
            );
        }
    });

});
