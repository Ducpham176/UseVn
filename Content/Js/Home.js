// Slide swiper 
function swiperSettings() {
    var swiper = new Swiper(".mySwiper", {
        pagination: {
            el: ".swiper-pagination",
            dynamicBullets: true,
            clickable: true,
        },
        autoplay: {
            delay: 30000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}

// Set status element for storage
const contIcons = $('.cont-icons');
const btHideContIcons = $('.hide-icons-taskbar');
const btShowContIcons = $('.show-icon-taskbar');

// Storage Status
function storageHideConIcons() {
    RootlocalStorageCore.storage('hideConIcons-saved', 'true');
}

function hideConIcons() {
    RootTypeClass.class('add', contIcons, 'show');
    RootTypeClass.class('add', btShowContIcons, 'show');
    storageHideConIcons();
}

// Show taskbar
function renderShowConIcons(type) {
    const identifyAction = (type === 'yes') ? 'add' : 'remove';
    RootTypeClass.class(`${identifyAction}`, contIcons, 'show');
    RootTypeClass.class(`${identifyAction}`, btShowContIcons, 'show');
}

function showConIcons(nameStorage) {
    if (nameStorage) {
        localStorage.removeItem(nameStorage);
        renderShowConIcons('no');
    }
}

function handleStorageConIconsLeft() {
    renderShowConIcons('yes');
}

const homeJavascript = {
    handleEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeSwiper();
            this.setupStorageIcons();
            this.setupFirstLogin();
        });
    },

    initializeSwiper() {
        swiperSettings();
    },

    setupStorageIcons() {
        const onExistStorageConIcons = localStorage.getItem('hideConIcons-saved');
        if (onExistStorageConIcons) {
            handleStorageConIconsLeft();
        }

        btHideContIcons.onclick = () => this.hideConIcons();
        btShowContIcons.onclick = () => this.showConIcons('hideConIcons-saved');
    },

    setupFirstLogin() {
        const overviewFristLogin = $('.overview-first');
        if (overviewFristLogin) {
            NoScrollHTML.noScroll('yes');

            const btCloseFirstLogin = $('#btn-start');
            btCloseFirstLogin.onclick = (e) => {
                e.preventDefault();
                overviewFristLogin.hidden = true;
                NoScrollHTML.noScroll('no');
            };
        }
    },

    hideConIcons() {
        hideConIcons();
    },

    showConIcons(storageKey) {
        showConIcons(storageKey);
    },

    start() {
        this.handleEvents();
    }
};

homeJavascript.start();
