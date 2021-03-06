import request from '@/utils/request'
// import Layout from '@/layout'

export function login(params) {
  return request({
    url: '/loginMain',
    method: 'post',
    params
  })
}

export function getName() {
  return request({
    url: '/getUserName',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/loginOut',
    method: 'get'
  })
}

export function getRoutes() {
  return request({
    url: '/admin/getMenu',
    method: 'get'
  })
}
export function updatePswd(params) {
  return request({
    url: '/admin/changePassword',
    method: 'post',
    params
  })
}
