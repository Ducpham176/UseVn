const btnSubmit = $('.btn-gradient');
const inputOtp = $("input[name='otp']");
const btnOtp = $('.btn-otp');

const btnAccuracy = $('.btn-accuracy');
// class add -> otpsend
const formControl = $$('.form-control');

// Effect loading when sender email 
const loadingTopEmail = $('.loading-effect-top');
const loadingMain  = $('.loading-ss');

// btn when not completed
let preventDefaultRequired = true;
let submitPreventDefault = true;

// flag variable checks if email has been sent
let sendEmailBool = true;

// code OTP global
var codeActiveToken;

// email + Random global
var emailPrepare;

// Prevent default 
btnSubmit.disabled = true;

// debounding
let debounceTimeout;

function onClickCheckCompleted(flagVariable, event) {
    if (flagVariable) {
        event.preventDefault();
    }
}

// Loading
function handleLoading(type = 'off') {
    (type === 'off') ? TypeClass.class('remove', loadingMain, 'loading') : TypeClass.class('add', loadingMain, 'loading');
}

// Function to check if a string contains only letters
function isAlphabetic(inputValue) {
    const regex = /^[\p{L}\s']+$/u;
    return regex.test(inputValue);
}

// Get form elements
const formElements = {
    firstname: $("input[name='firstname']"),
    lastname: $("input[name='lastname']"),
    email: $("input[name='email']"),
    emailForgot: $("input[name='emailForgot']"),
    password: $("input[name='password']"),
    passwordForgot: $("input[name='passwordForgot']"),
    otpForgot: $("input[name='otpForgot']"),
};

// variable tracking
const fieldCompletionStatus = {
    firstname: false,
    lastname: false,
    email: false,
    emailForgot: false,
    password: false,
    passwordForgot: false,
    otpForgot: false
};


// Object to store error messages
const errorMessages = {
    firstname: {},
    lastname: {},
    email: {},
    emailForgot: {},
    password: {},
    passwordForgot: {},
    otpForgot: {}
};

const contentMessage = {
    firstname: {
        empty: 'Trường này đang để trống!',
        invalid: 'Tên của bạn không hợp lệ',
    },
    email: {
        empty: 'Trường này đang để trống!',
        invalid: 'Email của bạn không hợp lệ',
    },
    emailForgot: {
        empty: 'Trường này đang để trống!',
        invalid: 'Email của bạn không hợp lệ',
    },
    password: {
        empty: 'Trường này đang để trống!',
        invalid: 'Mật khẩu của bạn không hợp lệ',
    },
    passwordForgot: {
        empty: 'Trường này đang để trống!',
        invalid: 'Mật khẩu của bạn không hợp lệ',
    },
    otpForgot: {
        empty: 'Trường này đang để trống!',
    }
};

const formValues = {};

// Random value loading progress
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Set effect loading loadingTopEmail 
let loadingProgress = 0;
let loadingInterval;

function incrementLoading() {
    loadingTopEmail.style.width = '0%'; 
    loadingTopEmail.style.visibility = 'unset'; 
    if (loadingProgress < 100) {
        loadingProgress += getRandomInt(6);
        if(loadingInterval >= 99)
        {
            Object.assign(loadingTopEmail.style, {
                width: `100%`,
            });
        }
        Object.assign(loadingTopEmail.style, {
            width: `${loadingProgress}%`,
        });
    } else {
        clearInterval(loadingInterval); // Stop when 100%
        loadingTopEmail.style.visibility = 'hidden'; // Hidden
    }
}

// prevent changes to entered information
function preventChangeInput() {
    for (let inputName in formElements) {
        // hasOwnProperty check exists object 
        if (formElements.hasOwnProperty(inputName)) {
            formElements[inputName].setAttribute('readonly', 'readonly');
        }
    }
}

// Function Sending Email 
function sendEmail(codeOTP) {
    var toFirstname = formValues['firstname'];
    var toEmail = formValues['email'];
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'Sendemail.php', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            TypeClass.class('remove', btnOtp, 'otpsend');
            TypeClass.class('add', btnOtp, 'FormInput_disabled');
            btnOtp.disabled = true;
            // Avoid changing data at first               
            inputOtp.removeAttribute('readonly');
            TypeClass.class('remove', inputOtp, 'not-interact');

            loadingTopEmail.style.width = '100%';
            loadingTopEmail.style.visibility = 'hidden'; 
            clearInterval(loadingInterval); 
            // Stop the interval if it has not ended
        
            cuteAlert({
                type: "info",
                title: "Đã gửi",
                message: "Mã xác thực đã gửi tới email của bạn",
                buttonText: "Okay"
            });

            preventChangeInput();
        } 
    };
    xhr.send("email=" + toEmail + "&firstname=" + toFirstname + 
    "&active_token=" + codeOTP + "&class=sendemail");

    // Start intervals to increase progress
    loadingInterval = setInterval(incrementLoading, 400); // Delay 400ms
}

// Remove border when no errors
function removeBorderError() {
    const inputInFormControl = $$('.form-control .on-interact');
    inputInFormControl.forEach((element) => {
        element.style.border = '1.5px solid rgba(22,24,35,.06)';
    })
}

function resetValueInput() {
    const inputField = $$('.input-field');
    inputField.forEach((element) => {
        element.value = '';
    })
}

function setStatusResiter() {
    const data = {
        'email_prepare': emailPrepare, 
        'status': 1,
        'email': formValues['email'],
        'class': 'setstatus'
    }
    CallAjax.send('POST', data, 'HandleDataRegister.php', function(response) {
        const dataJson = CallAjax.get( response, 'off' );
        if(dataJson) {
            if (dataJson.code === 1) {
                cuteAlert({
                    type: "success",
                    title: "Thành công",
                    message: "Đăng nhập và trải nghiệm thôi🎉",
                    buttonText: "OKay"
                });
                handleLoading('off');
                btnSubmit.disabled = true;
                btnSubmit.style.cursor = 'default';
                TypeClass.class('remove', btnSubmit, 'on');
                TypeClass.class('remove', btnOtp, 'otpsend');
                TypeClass.class('remove', btnOtp, 'FormInput_disabled');
                TypeClass.class('remove', btnAccuracy, 'on-show');

                resetValueInput();
            }
        }
    });
}

// Check Once the otp code has been successfully sent
function successOtp(value) {
    btnOtp.disabled = true;
    // Disable the button to prevent multiple clicks
    handleLoading('on');
    
    const dataToSend = {
        'email_prepare': emailPrepare,
        'active_token': value,
        'class': 'checkotp' 
    }
    
    CallAjax.send('POST', dataToSend, 'HandleDataRegister.php', function(response) {
        handleLoading('off');
        const dataJson = CallAjax.get( response, 'off' );

        if (dataJson) {
            if (dataJson.code === 1) {
                cuteToast({
                    type: "success",
                    title: "Thành công",
                    message: dataJson.err_mess,
                    timer: 3500
                })
                    
                sendEmailBool = false

                // Button submit OTP
                btnAccuracy.style.cursor = 'default';
                btnAccuracy.disabled = true;

                // input value OTP
                inputOtp.setAttribute('readonly', 'readonly');

                btnSubmit.disabled = false;
                TypeClass.class('add', btnSubmit, 'on');
                
                btnSubmit.addEventListener('click', (event) => {
                    event.preventDefault();
                    setStatusResiter();
                })
            } 
            else {
                cuteToast({
                    type: "error",
                    title: "Thất bại",
                    message: dataJson.err_mess,
                    timer: 3500
                })
            }
        }
    });
}

let valueOTP = ''; 
let accuracyClickHandler = null;

let isAccuracyEventRegistered = false;

function handleInputChange(event) {
    let maxInputValue = 6;
    // Value max our maximum value 
    valueOTP = event.target.value;
    if (valueOTP.length === maxInputValue) 
    {
        btnAccuracy.disabled = false;
        TypeClass.class('add', btnAccuracy, 'on-show');
        if (accuracyClickHandler) 
        {
            btnAccuracy.removeEventListener('click', accuracyClickHandler);
        }
        accuracyClickHandler = (e) => {
            e.preventDefault();
            successOtp(valueOTP);
        };
        btnAccuracy.addEventListener('click', accuracyClickHandler);
        isAccuracyEventRegistered = true; 
    } else {
        btnAccuracy.disabled = true;
        TypeClass.class('remove', btnAccuracy, 'on-show');
        if (accuracyClickHandler) 
        {
            btnAccuracy.removeEventListener('click', accuracyClickHandler);
            accuracyClickHandler = null;
        }
        isAccuracyEventRegistered = false; 
    }
}
// Add blur event listeners to form elements

// Handle blur event for data fields
for (const fieldName in formElements) {
    const field = formElements[fieldName];
    if (field) {
        field.addEventListener('blur', () => {
            const value = field.value.trim();
            const name = field.getAttribute('name');
            // Check value object formElements
            switch (name) {
                case 'firstname':
                case 'lastname':
                    if (isEmpty.check(value)) 
                    {
                        errorMessages[name]['empty'] = contentMessage.firstname.empty;
                        Messsage.show(field, errorMessages[name]['empty']);
                        borderError.create();
                    } else if (!isAlphabetic(value)) 
                    {
                        errorMessages[name]['invalid'] = contentMessage.fieldName.invalid;
                        Messsage.show($(`input[name='${name}']`), errorMessages[name]['invalid']);
                        borderError.create();
                    } else 
                    {
                        delete errorMessages[name]['empty'];
                        delete errorMessages[name]['invalid'];
                        Messsage.remove(field);
                        borderError.remove();
                    }
                    break;

                case 'password':
                    if (isEmpty.check(value)) 
                    {
                        errorMessages[name]['empty'] = contentMessage.password.empty;
                        Messsage.show(field, errorMessages[name]['empty']);
                        borderError.create();
                    } else if (!isPasswordValid.check(value)) 
                    {
                        errorMessages[name]['invalid'] = contentMessage.password.invalid;
                        Messsage.show($(`input[name='${name}']`), errorMessages[name]['invalid']);
                        borderError.create();
                    } else 
                    {
                        delete errorMessages[name]['empty'];
                        delete errorMessages[name]['invalid'];
                        Messsage.remove(field);
                        borderError.remove();
                    }
                    break;

                case 'email':
                    if (isEmpty.check(value)) 
                    {
                        errorMessages[name]['empty'] = contentMessage.email.empty;
                        Messsage.show(field, errorMessages[name]['empty']);
                        borderError.create();
                    } else if (!isEmailValid.check(value)) 
                    {
                        errorMessages[name]['invalid'] = contentMessage.email.invalid;
                        Messsage.show($(`input[name='${name}']`), errorMessages[name]['invalid']);
                        borderError.create();
                    } else 
                    {
                        delete errorMessages[name]['empty'];
                        delete errorMessages[name]['invalid'];
                        Messsage.remove(field);
                        borderError.remove();
                    }
                    break;
            }
            // Processed after run one 
            if (!isEmpty.check(value)) 
            {
                fieldCompletionStatus[name] = true;
            } else {
                fieldCompletionStatus[name] = false;
            }

            formValues[name] = value;
        });
    }
}

// The function checks all fields for completion or not 
function checkAllFieldsComplete() {
    return Object.values(fieldCompletionStatus).every((status) => status);
}

function handleFieldChange(event) {
    btnOtp.disabled = true;
    const value = event.target.value.trim();
    const name = event.target.getAttribute('name');

    delete fieldCompletionStatus.emailForgot;
    delete fieldCompletionStatus.otpForgot;
    delete fieldCompletionStatus.passwordForgot;

    fieldCompletionStatus[name] = !isEmpty.check(value);
    if(checkAllFieldsComplete())
    {
        // && hasErrors(!errorMessages) No messages error
        btnOtp.disabled = false;
        TypeClass.class('add', btnOtp, 'otpsend');
    } else {
        TypeClass.class('remove', btnOtp, 'otpsend');
    }
}

const fields = $$('.data-On');
fields.forEach(field => {
    field.addEventListener('input', handleFieldChange);
});

// Create string random 
function generateRandomString() {
    const timestamp = new Date().getSeconds().toString();
    const randomString = CryptoJS.MD5(timestamp).toString();
    const halfLength = Math.ceil(randomString.length / 2);
    const halfRandomString = randomString.slice(0, halfLength);
    return halfRandomString;
}

/* This function will add a random segment to 
 avoid users from trying to enter their email */
function reduceEmailTheft(toEmail) {
    const email = toEmail;
    const arrayEmail = email.split('@');
    const nameEmail = arrayEmail[0]; 
    const randomString = generateRandomString();
    const pathEmailAddRandomNumber = `${nameEmail + '||'  + randomString + '@' + arrayEmail[1]}`;
    return pathEmailAddRandomNumber;
}

inputOtp.addEventListener('input', handleInputChange);  
btnOtp.addEventListener('click', () => {
    btnOtp.disabled = true;
    if(sendEmailBool)
    {
        codeActiveToken = randomActiveToken.create();
        // Send Data 
        emailPrepare = reduceEmailTheft(formValues['email']);

        const data = {
            'firstname' : formValues['firstname'],
            'lastname' : formValues['lastname'],
            'email' : emailPrepare,
            'password' : btoa(formValues['password']),
            'active_token' : codeActiveToken,
            'class': 'importeddata' 
        }

        handleLoading('on');
        CallAjax.send('POST', data, 'HandleDataLogind.php', function (response) {
            try {
                const dataJson = CallAjax.get( response );

                if (dataJson) {
                    incrementLoading(); 
                    sendEmail(codeActiveToken);
                } 
                handleLoading('off');
            }
            catch (error) {};
        });                       
    }
});

const registerJavascript = {
    handleEvents: () => {
        // Check to see if the data meets standards
        btnOtp.addEventListener('click', function(event) {
            onClickCheckCompleted(preventDefaultRequired, event);
        });

        btnSubmit.addEventListener('click', function(event) {
            onClickCheckCompleted(submitPreventDefault, event);
        });
    },

    start: () => {
        registerJavascript.handleEvents();
    }
};

registerJavascript.start();