import { showAlert } from './alerts.js';
// import axios from './../../node_modules/axios';

//type is either 'data' or 'password'
// export const updateSettings = async (data, type) => {
//     try {
//         const url = (type === 'password') ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword' : 'http://127.0.0.1:3000/api/v1/users/updateMe';

//         const res = await axios({
//         method: 'PATCH',
//         url,
//         data
//         });

//         if (res.data.status === 'success') {
//         showAlert('success', `${type.toUpperCase()} updated successfully!`);
//         }
//     } catch (err) {
//         showAlert('error', err.response.data.message);
//     }
// };

//UPDATE USER DATA
// const userDataForm = document.querySelector('.form-user-data');
// const formData = new FormData();
// const name = document.getElementById('name').value;
// const email = document.getElementById('email').value;

// const updateData = async () => {
//     //     const res = await fetch('http://127.0.0.1:8090/api/v1/users/updateMe', {
//     //     method: 'PATCH',
//     //     headers: {
//     //         'Accept': 'application/json',
//     //         "Content-Type": "application/json; charset = UTF-8"
//     //     },
//     //     body: JSON.stringify({
//     //         name,
//     //         email
//     //     })
//     // });
//     formData.append('name', document.getElementById('name').value);
//     formData.append('email', document.getElementById('email').value);
//     formData.append('photo', document.getElementById('photo').files[0]);

//     const res = await fetch('http://127.0.0.1:8090/api/v1/users/updateMe', {
//         method: 'PATCH',
//         body: formData
//     });

//     if (res.status >= 200 && res.status <= 299) {
//         const data = await res.json();
//         console.log(data);
//         if (data.status === 'success') {
//             showAlert('success', 'Data updated successfully!');
//             // window.setTimeout(() => {
//             //     location.assign('/me');
//             // }, 1500);
//         }
//     } else {
//         showAlert('error', 'Something went wrong');
//     }
// };

// if (userDataForm) {
//     userDataForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         //SENDING MULTIPART FORM DATA
//         // form.append('photo', document.getElementById('photo').files[0]);
//         // console.log(form);
//         // const name = document.getElementById('name').value;
//         // const email = document.getElementById('email').value;
//         await updateData();
//     });
// }

//UPDATING PASSWORD
const userPasswordForm = document.querySelector('.form-user-password');

const updatePassword = async () => {
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    const res = await fetch('http://127.0.0.1:8090/api/v1/users/updateMyPassword', {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json; charset = UTF-8"
        },
        body: JSON.stringify({
            passwordCurrent,
            password,
            passwordConfirm
        })
    });

    if (res.status >= 200 && res.status <= 299) {
        const data = await res.json();
        console.log(data);
        if (data.status === 'success') {
            showAlert('success', 'Password updated successfully!');
            // window.setTimeout(() => {
            //     location.assign('/me');
            // }, 1500);
        }
    } else {
        showAlert('error', 'Something went wrong');
    }
};

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';

        await updatePassword();

        document.querySelector('.btn--save-password').textContent = 'Save Password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}