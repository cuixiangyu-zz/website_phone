import request from '@/utils/request'

export function getVideoDetil(params) {
  return request({
    url: '/video/getDetile',
    method: 'get',
    params
  })
}
export function changelevel(params) {
  return request({
    url: '/video/changelevel',
    method: 'get',
    params
  })
}
