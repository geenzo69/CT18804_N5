
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form_dang_ky");
    const ho = document.getElementById("lastName");
    const ten = document.getElementById("firstName");
    const soDienThoai = document.getElementById("numberPhone");
    const matKhau = document.getElementById("password");
    const nhapLaiMatKhau = document.getElementById("confirmPassword");
    const dieuKhoan = document.getElementById("dong_y_dieu_khoan");
    const thongBao = document.getElementById("hop_thong_bao");

    // hien thi thong bao
    function hienThiThongBao(noiDung, loai) {
        thongBao.textContent = noiDung;
        thongBao.className = "hop_thong_bao " + loai;
    }

    // hien an mat khau
    const cacNutMatKhau = document.querySelectorAll(".nut_an_hien_mk");

    cacNutMatKhau.forEach(function (nut) {
        nut.addEventListener("click", function () {
            const input = document.getElementById(
                nut.getAttribute("data-target")
            );
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
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const lastName = ho.value.trim();
        const firstName = ten.value.trim();
        const numberPhone = soDienThoai.value.trim();
        const password = matKhau.value;
        const confirmPassword = nhapLaiMatKhau.value;

        if (lastName === "") {
            hienThiThongBao("Vui lòng nhập họ và tên đệm!", "loi");
            ho.focus();
            return;
        }

        if (firstName === "") {
            hienThiThongBao("Vui lòng nhập tên!", "loi");
            ten.focus();
            return;
        }

        // ktra sdt
        const regexSdt = /^0[0-9]{9}$/;

        if (!regexSdt.test(numberPhone)) {
            hienThiThongBao(
                "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0!",
                "loi"
            );
            soDienThoai.focus();
            return;
        }
        if (password.length < 8) {
            hienThiThongBao(
                "Mật khẩu phải có ít nhất 8 ký tự!",
                "loi"
            );
            matKhau.focus();
            return;
        }

        // nhap pass lan 2
        if (password !== confirmPassword) {
            hienThiThongBao(
                "Mật khẩu nhập lại không khớp!",
                "loi"
            );
            nhapLaiMatKhau.focus();
            return;
        }

        // dieu khoan
        if (!dieuKhoan.checked) {
            hienThiThongBao(
                "Vui lòng đồng ý với điều khoản sử dụng!",
                "loi"
            );
            return;
        }

        try {
            // ktra sdt
            const account = JSON.parse(localStorage.getItem("account"));

            if (account && account.numberPhone === numberPhone) {
                hienThiThongBao(
                    "Số điện thoại này đã được đăng ký!",
                    "loi"
                );
                soDienThoai.focus();
                return;
            }


            // ghi đè lên k cần xóa
            localStorage.setItem("account", JSON.stringify({
                numberPhone: numberPhone,
                firstName: firstName,
                lastName: lastName,
                password: password
            }));

            // tb dki tcong
            hienThiThongBao(
                "Đăng ký thành công! Chào mừng " +
                lastName + " " + firstName +
                " đến với BadmintonPlus!",
                "thanh_cong"
            );

            // delete form date
            form.reset();

            // chuyen sang trang gioi thieu
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
