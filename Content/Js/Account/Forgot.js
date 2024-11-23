// Suggest Forgot password ?
const collectTip = $('.collect-tips');
const btnCloseCollectTips = $('.btn-close-collectTips');
// Button need help
const btnNeedHelp = $('.btn-needHelp');
const containerForgotPassword = $('.container-forgot-password');
const formForgotPassword = $('.container-forgot-password .form-account');
const inputEmailForgot = formForgotPassword.querySelector('input[name="emailForgot"]');
const inputOtpForgot = formForgotPassword.querySelector('input[name="otpForgot"]');
const inputPasswordForgot = formForgotPassword.querySelector('input[name="passwordForgot"]');
const inputReCaptcha = $('#g-groups-captcha');
// Title "Xác Thực" || "OTP"
const itemSwit = $$('.item-swit');
// Button submit form- forgot Password 
const btnForgotPassword = $('.btn-forgot-password');
const btnSubmitForgot = $('#btn-submit-forgot');
const btnResetForgot = $('.form-item-reset');

btnForgotPassword.disabled = true;
// Check whether the captcha has expired or not
let recaptchaExpired = false;
let inputForgotExpried = false;
let onClickSuggest = false;
let badInput = false;
// This email has been authenticated
let authenticated = false;
// otp encryption authentication
let authenticatedOTP = false;
let sendEmailForgotOTP = false;
let passwordHasBeen = false;
// Global 
var emailForgotValue;
// Email 
var randomForgotToken;
// Cctiontoken
var randomToken256;
// Token

// Function to check if a field is empty
const isEmpty = {
    check: (inputValue) => {
        return !inputValue.trim().length;
    }
}

// Function to check if a string contains only letters
// const isAlphabetic = {
//     check: (inputValue) => {
//         const regex = /^[\p{L}\s']+$/u;
//         return regex.test(inputValue);
//     }
// }

// Function to check if a string meets password criteria
const isPasswordValid = {
    check: (inputValue) => {
        const regex = /^[a-zA-Z0-9]{8,}$/;
        return regex.test(inputValue);
    }
}

const isEmailValid = {
    check: (inputValue) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        return regex.test(inputValue);
    }
}

const hasErrors = (errors) => {
    for (const key in errors) {
        if (Object.keys(errors[key]).length > 0) {
            return false;
        }
    }
    return true;
}

function onLoading() {
    TypeClass.class('add', loadingMain, 'loading');
}

function offLoading() {
    TypeClass.class('remove', loadingMain, 'loading');
}

const Messsage = {
    show: (element, content) => {
        const existingErrorMessage = element.parentElement.querySelector('.Form-message-error');

        if (existingErrorMessage) {
            element.parentElement.removeChild(existingErrorMessage);
        }

        const errorElement = document.createElement('div');
        TypeClass.class('add', errorElement, 'Form-message-error');
        errorElement.textContent = content;
        element.parentElement.appendChild(errorElement);
    },

    remove: (element) => {
        const existingErrorMessage = element.parentElement.querySelector('.Form-message-error');

        if (existingErrorMessage) {
            element.parentElement.removeChild(existingErrorMessage);
        }
    }
}

// Add border when errors happen 
const borderError = {
    create: () => {
        const errorElements = $$('.Form-message-error');
        errorElements.forEach((itemErr) => {
            let precedingElement = itemErr.previousSibling;
            while (precedingElement) {
                if (precedingElement.tagName === 'INPUT') {
                    precedingElement.style.border = '1.5px solid #f33a58';
                    break;
                }
                precedingElement = precedingElement.previousSibling;
            }
        });
    },

    remove: () => {
        const inputInFormControl = $$('.form-control .on-interact');
        inputInFormControl.forEach((element) => {
            element.style.border = '1.5px solid rgba(22,24,35,.06)';
        })
    }
}

// Clear previous error
const errorMessage = {
    clear: (element) => {
        const existingErrorMessage = element.parentElement.querySelector('.Form-message-error');
        if (existingErrorMessage)
            element.parentElement.removeChild(existingErrorMessage);
    }
}

const randomActiveToken = {
    create: () => {
        return Math.floor(100000 + Math.random() * 900000);
    }
}

function generateRandomToken() {
    const timestamp = new Date().getSeconds().toString();
    const randomString = CryptoJS.MD5(timestamp).toString();
    return randomString;
}

function closeContainerForgotPassword() {
    TypeClass.class('remove', containerForgotPassword, 'active');
    TypeClass.class('remove', $('body'), 'active');
    TypeClass.class('remove', $('html'), 'active');
}

function showForgotPassword() {
    TypeClass.class('add', containerForgotPassword, 'active');
    TypeClass.class('add', $('body'), 'active');
    TypeClass.class('add', $('html'), 'active');
    onClickSuggest = true;
}

function updatePassword() {
    const dataOtp = {
        'emailForgot': formValues['emailForgot'],
        'passwordForgot': btoa(formValues['passwordForgot']),
        'class': 'updatepassword'
    };

    CallAjax.send('POST', dataOtp, 'HandleDataForgot.php', function (response) {
        try {
            const dataJson = CallAjax.get(response).err_mess;
            cuteToast({
                type: "success",
                title: "Thành công",
                message: 'Cập nhật mật khẩu thành công',
                timer: 3500
            });
        }
        catch (err) { console.error(err.message) };
    });

    passwordHasBeen = true;
    btnForgotPassword.disabled = true;
    btnSubmitForgot.disabled = true;
    inputPasswordForgot.disabled = true;
    btnResetForgot.style.display = 'flex';

    offLoading();
}

function checkPasswordBefore() {
    if (hasErrors(errorMessages) && formValues['passwordForgot'] !== '') {
        authenticatedOTP = false;
        btnForgotPassword.disabled = false;
        return true;
    }
}

function processedBeforePassword() {
    TypeClass.class('remove', itemSwit[0], 'show');
    itemSwit[0].innerHTML = `<i class='bx bxs-badge-check'></i> Xác thực`;
    TypeClass.class('remove', itemSwit[1], 'show');
    itemSwit[1].innerHTML = `<i class='bx bxs-badge-check'></i> OTP`;
    // hidden input emailForgot & otpForgot
    TypeClass.class('add', inputEmailForgot, 'hidden');
    inputEmailForgot.readOnly = true;
    TypeClass.class('add', inputOtpForgot, 'hidden');
    inputOtpForgot.readOnly = true;
    // Show input passwordForgot
    TypeClass.class('remove', inputPasswordForgot, 'hidden');
    // update password 
}

function startCountdown() {
    let seconds = 15;
    const countdownDisplay = $('.clock-time-delay');
    countdownInterval = setInterval(function () {
        seconds--;
        if (seconds < 0) {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = '';
            btnForgotPassword.disabled = false;
            inputOtpForgot.readOnly = false;
            TypeClass.class('remove', btnForgotPassword, 'off');
        } else {
            countdownDisplay.textContent = `${'chờ ' + seconds + 's'}`;
        }
    }, 1000);
}

function toSendCodeOtp() {
    const dataOtp = {
        'forgot_token': formValues['otpForgot'],
        'emailForgot': formValues['emailForgot'],
        'class': 'checkforgottoken'
    };

    CallAjax.send('POST', dataOtp, 'HandleDataForgot.php', function (response) {
        const jsonData = CallAjax.get(response);
        try {
            if (jsonData == false) {
                const spanTime = document.createElement('span');
                TypeClass.class('add', spanTime, 'clock-time-delay');
                $('.form-item-forgot').appendChild(spanTime);
                startCountdown();
                TypeClass.class('add', btnForgotPassword, 'off');
                btnForgotPassword.disabled = true;
                inputOtpForgot.readOnly = true;
            }
            else {
                // Success 
                btnForgotPassword.style.display = 'none';
                btnSubmitForgot.style.display = 'block';
                btnForgotPassword.disabled = true;
                processedBeforePassword();
            }
        }
        catch (err) { }

        offLoading();
    });
}

function debounce(func, delay) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay);
}

function toSendOtpToken(email) {
    randomToken256 = generateRandomToken();
    randomForgotToken = randomActiveToken.create();
    let urlPresent = window.location.href;
    urlPresent = urlPresent.replace('#', '');

    const toSendDataOtpToken = {
        'emailForgot': email,
        'forgot_token': randomForgotToken,
        'token': randomToken256,
        'class': 'sendactivetoken',
    };

    CallAjax.send('POST', toSendDataOtpToken, 'HandleDataForgot.php', function (response) {
        const dataJson = CallAjax.get(response);
        try {
            cuteToast({
                type: "info",
                title: "Đã gửi",
                message: 'Mã xác thực đã gửi tới email của bạn',
                timer: 3500
            });
            TypeClass.class('remove', containerForgotPassword, 'alway');
            offLoading();
        }
        catch (err) {
            console.error(err.message);
        }
    });

    // Saved OTP 
    impotDataForgot()

    authenticatedOTP = true;
    sendEmailForgotOTP = true;
}

// If the email already exists, proceed to send the confirmation code and token
function emailAlreadyExists() {
    TypeClass.class('add', inputReCaptcha, 'active');
    // Hidden Recaptcha 
    TypeClass.class('add', inputEmailForgot, 'hidden');
    inputEmailForgot.readOnly = true;
    TypeClass.class('add', inputPasswordForgot, 'hidden');
    TypeClass.class('remove', inputOtpForgot, 'hidden');
    // add Box-shadow item title
    TypeClass.class('remove', itemSwit[0], 'show');
    itemSwit[0].innerHTML = `<i class='bx bxs-lock'></i> Xác thực`;
    TypeClass.class('add', itemSwit[1], 'show');
    itemSwit[1].textContent = 'OTP';
}

// recaptchaCallback has been called
function toSendAccuracyEmail() {
    // Saved data for database 
    const toDataSend = {
        'emailForgot': formValues['emailForgot'],
        'class': 'checkemailexists'
    };

    CallAjax.send('POST', toDataSend, 'HandleDataForgot.php', (response) => {
        const dataJson = CallAjax.get(response);
        try {
            if (dataJson.error)
                authenticated = true;
            emailAlreadyExists();
            onLoading();
            TypeClass.class('add', containerForgotPassword, 'alway');
            emailForgotValue = formValues['emailForgot'];
            toSendOtpToken(emailForgotValue);
        }
        catch (err) {
            btnForgotPassword.disabled = true;
            btnForgotPassword.disabled = false;
            offLoading();
        }
    });
}

function impotDataForgot() {
    // Saved data for database 
    const data = {
        'emailForgot': formValues['emailForgot'],
        'forgot_token': randomForgotToken,
        'token': randomToken256,
        'class': 'savedforgot'
    };

    CallAjax.send('POST', data, 'HandleDataForgot.php', function (response) {
        try {
            const dataJson = CallAjax.get(response);
        }
        catch (err) {
            console.error(err.message);
        }
    });
}

// API google output Captcha 
function checkRecaptcha() {
    const valueEmail = formElements['emailForgot'].value.trim();
    if (hasErrors(errorMessages['emailForgot']) && valueEmail !== '') {
        // This function will be called when the user confirms reCAPTCHA
        btnForgotPassword.disabled = false;
        btnForgotPassword.style.cursor = 'pointer';
    } else {
        btnForgotPassword.disabled = true;
        btnForgotPassword.style.cursor = 'not-allowed';
    }
    recaptchaExpired = true;
    return grecaptcha.getResponse().length !== 0;
}

function checkValueRecaptcha() {
    const valueEmail = formElements['emailForgot'].value.trim();
    if (hasErrors(errorMessages['emailForgot']) && checkRecaptcha() && valueEmail !== '') {
        // This function will be called when the user confirms reCAPTCHA
        btnForgotPassword.disabled = false;
        btnForgotPassword.style.cursor = 'pointer';
        return true;
    }
    btnForgotPassword.disabled = true;
    btnForgotPassword.style.cursor = 'not-allowed';
    return false;
}

const forgotJavascript = {
    handleEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.showCollectTip();
            this.setupFieldValidation();
            this.setupEventListeners();
        });
    },

    showCollectTip() {
        if (sessionStorage.getItem('collectTipShown') !== 'true') {
            TypeClass.class('add', collectTip, 'show');
            sessionStorage.setItem('collectTipShown', 'true');
            setTimeout(() => {
                TypeClass.class('remove', collectTip, 'show');
            }, 4000);
        }
    },

    setupFieldValidation() {
        for (const fieldName in formElements) {
            const field = formElements[fieldName];
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
            }
        }
    },

    validateField(field) {
        const value = field.value.trim();
        const name = field.getAttribute('name');

        switch (name) {
            case 'emailForgot':
                this.validateEmail(value, field);
                break;
            case 'passwordForgot':
                this.validatePassword(value, field);
                break;
        }

        // Update completion status and form values
        fieldCompletionStatus[name] = !isEmpty.check(value);
        formValues[name] = value;
    },

    validateEmail(value, field) {
        if (isEmpty.check(value)) {
            errorMessages['emailForgot']['empty'] = contentMessage.emailForgot.empty;
            Messsage.show(field, errorMessages['emailForgot']['empty']);
            borderError.create();
        } else if (!isEmailValid.check(value)) {
            errorMessages['emailForgot']['invalid'] = contentMessage.emailForgot.invalid;
            Messsage.show(field, errorMessages['emailForgot']['invalid']);
            borderError.create();
        } else {
            this.clearError('emailForgot', field);
        }
    },

    validatePassword(value, field) {
        if (isEmpty.check(value)) {
            errorMessages['passwordForgot']['empty'] = contentMessage.passwordForgot.empty;
            Messsage.show(field, errorMessages['passwordForgot']['empty']);
            borderError.create();
        } else if (!isPasswordValid.check(value)) {
            errorMessages['passwordForgot']['invalid'] = contentMessage.passwordForgot.invalid;
            Messsage.show(field, errorMessages['passwordForgot']['invalid']);
            borderError.create();
        } else {
            this.clearError('passwordForgot', field);
        }
    },

    clearError(name, field) {
        delete errorMessages[name]['empty'];
        delete errorMessages[name]['invalid'];
        Messsage.remove(field);
        removeBorderError();
    },

    setupEventListeners() {
        btnForgotPassword.addEventListener('click', (event) => this.handleForgotPassword(event));
        containerForgotPassword.addEventListener('click', (e) => this.closeContainer(e));
        btnNeedHelp.addEventListener('click', () => showForgotPassword());

        inputEmailForgot.addEventListener('input', () => {
            debounce(() => {
                if (!authenticated) {
                    checkValueRecaptcha();
                } else if (!passwordHasBeen) {
                    checkPasswordBefore();
                }
            }, 100);
        });

        btnResetForgot.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.reload();
        });

        btnForgotPassword.addEventListener('click', () => {
            onLoading();
            authenticatedOTP ? toSendCodeOtp() : !sendEmailForgotOTP ? toSendAccuracyEmail() : null;
        });

        btnSubmitForgot.addEventListener('click', (e) => {
            e.preventDefault();
            if (hasErrors(errorMessages.passwordForgot)) {
                updatePassword();
            }
        });
    },

    handleForgotPassword(event) {
        event.preventDefault();
        // Handle forgot password logic here
    },

    closeContainer(e) {
        if (e.target === containerForgotPassword) {
            closeContainerForgotPassword();
        }
    },

    start() {
        this.handleEvents();
    }
};

forgotJavascript.start();