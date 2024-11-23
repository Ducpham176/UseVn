const btnSubmit = $('.btn-gradient');
const inputOtp = $("input[name='otp']");
const btnOtp = $('.btn-otp');

const btnAccuracy = $('.btn-accuracy');
const formControl = $$('.form-control');

const loadingTopEmail = $('.loading-effect-top');
const loadingMain  = $('.loading-ss');

const registerJavascript = {
    element: () => {
        return {
            firstName: $('input[name="firstname"]'),
            lastName: $('input[name="lastname"]'),
            email: $('input[name="email"]'),
            password: $('input[name="password"]'),
            otp: $('input[name="otp"]')
        };
    },

    loadding: (type) => {
        const loadingMain = $('.loading-ss');
        RootTypeClass.class(type === 'off' ? 'remove' : 'add', loadingMain, 'loading');
    },

    checkInput: (input, type = null) => {
        const elements = registerJavascript.element();
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

        if (registerJavascript.checkRegister()) {
            elements.otp.readOnly = false;
            RootTypeClass.class('remove', elements.otp, 'not-interact');
            btnOtp.disabled = false;
            RootTypeClass.class('remove', btnOtp, 'FormInput_disabled');
        }
        else {
            elements.otp.readOnly = true;
            RootTypeClass.class('add', elements.otp, 'not-interact');
            btnOtp.disabled = true;
            RootTypeClass.class('add', btnOtp, 'FormInput_disabled');
        }
    },

    checkRegister: () => {
        const elements = registerJavascript.element();

        const firstName = elements.firstName.value.trim();
        const lastName = elements.lastName.value.trim();
        const email = elements.email.value.trim();
        const password = elements.password.value.trim();

        if (!firstName || !lastName || !email || !password) { return false; }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { return false; }

        if (password.length < 8) { return false; }

        return true;
    },

    registerMail: () => {
        registerJavascript.loadding('on');
        const elements = registerJavascript.element();
        const data = {
            'email': elements.email.value,
            'password': elements.password.value,
            'fullName': `${elements.firstName.value} ${elements.lastName.value}`,
        };

        RootCallAjax.post('/Account/RegisterMail', data)
        .then(response => {
            if (response && response.code === 1)
            cuteAlert({
                type: "info",
                title: "Đã gửi",
                message: response.message,
                buttonText: "Okay"
            });

            RootTypeClass.class('add', btnAccuracy, 'on-show');
            registerJavascript.loadding('off');
        })
        .catch(error => {
            cuteAlert({
                type: "error",
                title: "Lỗi",
                message: `Đã xảy ra lỗi: ${error.message}`,
                buttonText: "Đóng",
            });
            registerJavascript.loadding('off');
        });
    },

    sendOTP: () => {
        const elements = registerJavascript.element();
        const data = {
            'email': elements.email.value,
            'fullName': `${elements.firstName.value} ${elements.lastName.value}`,
            'activeToken': elements.otp.value,
        };

        RootCallAjax.post('/Account/RegisterMail', data)
        .then(response => {
            if (response && response.code === 1)
                cuteAlert({
                    type: "info",
                    title: "Đã gửi",
                    message: response.message,
                    buttonText: "Okay"
                });

                RootTypeClass.class('add', btnAccuracy, 'on-show');
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

    accpectOTP: () => {
        const elements = registerJavascript.element();
        const data = {
            'email': elements.email.value,
            'activeToken': elements.otp.value,
        };

        RootCallAjax.post('/Account/RegisterOTP', data)
        .then(response => {
            if (response && response.code === 1) {
                cuteAlert({
                    type: "success",
                    title: "Thành công",
                    message: response.message,
                    buttonText: "OKay"
                });

                registerJavascript.registerAccpect();
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

    registerAccpect: () => {
        if (document.referrer)
        {
            window.location.href = document.referrer; 
        } else {
            window.location.href = '/Account/Login'; 
        }
    },
            
    handleEvents: () => {
        const elements = registerJavascript.element();

        btnOtp.addEventListener('click', function (event) {
            event.preventDefault();
            registerJavascript.registerMail();
        });

        btnAccuracy.addEventListener('click', (event) => {
            event.preventDefault();
            registerJavascript.accpectOTP();
        });

        elements.firstName.addEventListener('blur', () => {
            registerJavascript.checkInput(elements.firstName);
        });

        elements.lastName.addEventListener('blur', () => {
            registerJavascript.checkInput(elements.lastName);
        });

        elements.email.addEventListener('blur', () => {
            registerJavascript.checkInput(elements.email, 'email');
        });

        elements.password.addEventListener('blur', () => {
            registerJavascript.checkInput(elements.password, 'pass');
        });
    },

    start: () => {
        registerJavascript.handleEvents();
    }
};

registerJavascript.start();