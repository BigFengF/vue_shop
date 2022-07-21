/* eslint-disable eqeqeq */
// import axios from 'axios'
export const getUserInfo = () => {
    const loginsInfo = localStorage.getItem('loginInfos')
    if (loginsInfo != null && loginsInfo != undefined) {
        return loginsInfo
    } else {
        return null
    }
}
export const setUserInfo = (data) => {
    localStorage.setItem('loginInfos', data)
}
// export const getRoleInfo = async () => {
//     // const { data: res } = await this.$http.get('users')
//     axios({
//         method: 'GET',
//         url: 'http://127.0.0.1:8888/api/private/v1/users'
//        }).then(response => {
//            console.log('response', response)
//        })
// }
