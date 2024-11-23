const btnLogin = $('#btn-logind');
let submitPreventDefault = true;
btnLogin.disabled = true;

const loadingTopEmail = $('.loading-effect-top');
const loadingMain = $('.loading-ss');

const loginJavaScript = {
    element: () => {
        return {
            email: $('input[name="email"]'),
            password: $('input[name="password"]'),
        };
    },

    checkInput: (input, type = null) => {
        const elements = loginJavaScript.element();
        let message = null;

        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value))
                    message = "Địa chỉ email không hợp lệ.";

            case 'pass':
                if (input.value.length < 8)
                    message = "Mật khẩu cần ít nhất 8 ký tự.";
        }

        if (!input.value.trim())
            message = 'Không được để trống';

        const parent = input.parentNode;
        const existingAlert = parent.querySelector('.Form-message-error');

        if (message) {
            if (existingAlert) existingAlert.remove();
            const alert = `
                <span class="Form-message-error">
                    ${message}
                </span>`;
            parent.insertAdjacentHTML('beforeend', alert);
        }
        else if (existingAlert) {
            existingAlert.remove();
        }

        if (loginJavaScript.checkLogin()) {
            btnLogin.disabled = false;
            RootTypeClass.class('add', btnLogin, 'on');
        }
        else {
            btnLogin.disabled = true;
            RootTypeClass.class('remove', btnLogin, 'on');
        }
    },

    checkLogin: () => {
        const elements = loginJavaScript.element();

        const email = elements.email.value.trim();
        const password = elements.password.value.trim();

        if (!email || !password) { return false; }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { return false; }

        if (password.length < 8) { return false; }

        return true;
    },

    loginAccept: () => {
        const elements = loginJavaScript.element();
        const data = {
            'email': elements.email.value,
            'password': elements.password.value,
        };

        RootCallAjax.post('/Account/LoginAccept', data)
        .then(response => {
            if (response && response.code === 1) {
                loginJavaScript.loginRedirect();
            }
            else {
                cuteAlert({
                    type: "error",
                    title: "Thất bại",
                    message: response.message,
                    timer: 3500
                });
            }
        })
        .catch(error => {
            cuteAlert({
                type: "error",
                title: "Lỗi",
                message: `Đã xảy ra lỗi: ${error.message}`,
                buttonText: "Đóng",
            });
        });
    },

    loginRedirect: () => {
        if (document.referrer) {
            window.location.href = document.referrer;
        } else {
            window.location.href = '/Home/Index';
        }
    },

    handleEvents: () => {
        const elements = loginJavaScript.element();

        document.addEventListener('DOMContentLoaded', () => {
            btnLogin.addEventListener('click', function (event) {
                event.preventDefault();
                loginJavaScript.loginAccept();
            });

            elements.email.addEventListener('blur', () => {
                loginJavaScript.checkInput(elements.email, 'email');
            });

            elements.password.addEventListener('blur', () => {
                loginJavaScript.checkInput(elements.password, 'pass');
            });
        });
    },

    start: () => {
        loginJavaScript.handleEvents();
    }
};

loginJavaScript.start();