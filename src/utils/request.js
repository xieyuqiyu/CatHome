import axios from 'axios'

// 创建axios实例
const request = axios.create({
    //   baseURL: 'http://localhost:3001/api', //本地 基础URL
    // baseURL: 'api.zqytime.cn/api', // 服务器 基础URL
    baseURL: 'http://43.143.90.251:3001/api', // 服务器 基础URL


  timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 可以在这里添加token等认证信息
        return config
    },
    error => {
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        // 可以在这里统一处理响应
        return response
    },
    error => {
        console.error('响应错误:', error)
        return Promise.reject(error)
    }
)

// 封装GET请求
export const get = (url, params = {}) => {
    return request({
        method: 'get',
        url,
        params
    })
}

// 封装POST请求
export const post = (url, data = {}) => {
    return request({
        method: 'post',
        url,
        data
    })
}

// 封装PUT请求
export const put = (url, data = {}) => {
    return request({
        method: 'put',
        url,
        data
    })
}

// 封装DELETE请求
export const del = (url, params = {}) => {
    return request({
        method: 'delete',
        url,
        params
    })
}

// 导出API路径常量
export const API = {
    WHISPERS: '/whispers',
    WHISPER_LIKE: (id) => `/whispers/${id}/like`
}

export default request