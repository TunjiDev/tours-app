import { showAlert } from './alerts.js';

const login = async (email, password) => {
// console.log(email, password);
    const res = await fetch('http://127.0.0.1:8090/api/v1/users/login', {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            "Content-Type": "application/json; charset = UTF-8"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    if (res.status >= 200 && res.status <= 299) {
        const data = await res.json();
        console.log(data);
        if (data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } else {
        showAlert('error', 'Incorrect email or password');
    }
};

const loginForm = document.querySelector('.form--login');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

const logout = async () => {
    const res = await fetch('http://127.0.0.1:8090/api/v1/users/logout');
    if (res.status >= 200 && res.status <= 299) {
        const data = await res.json();

        if (data.status === 'success') {
            location.reload(true);
        }
    } else {
        console.log('ERROR!')
        showAlert('error', 'Error logging out! Try again');
    }

};

const logOutBtn = document.querySelector('.nav__el--logout');

if (logOutBtn) logOutBtn.addEventListener('click', logout);