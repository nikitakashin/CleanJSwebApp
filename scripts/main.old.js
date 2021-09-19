// const sendResponse = async (url) => {
//     const obj = await fetch(url)
//     const result = await obj.json()
//     const res = await result
//     console.log(res)
// };

console.log(localStorage.getItem('state'));

Object.defineProperty(this, 'a', {
    set: function(v) {console.log('Изменяют!'); this.value = v;},
    value: 'QnA.habr.com'
});

let user_list
const sendResponse = async (url) => {
    const obj = await fetch(url)
    .then(response => {return response.json()})
    .then(data => {
        user_list = data
        this.a = data
    })
};
sendResponse('https://json.medrating.org/users/')

setTimeout(() => {
    console.log(user_list)
}, 2000)
// const getUserList = async () => {
//     let users = await sendResponse('https://json.medrating.org/users/','','')
//     console.log(sendResponse('https://json.medrating.org/users/','',''))
// }

// getUserList()




// document.addEventListener("DOMContentLoaded", async () => {
//     let user_list = sendResponse('https://json.medrating.org/users/')
//     console.log(await user_list)
// });

