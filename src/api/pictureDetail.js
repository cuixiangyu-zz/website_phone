import request from '@/utils/request'

export function getDetil(params) {
  return request({
    url: '/picture/getDetil',
    method: 'get',
    params
  })
}

export function getNext(params) {
  return request({
    url: '/picture/getNext',
    method: 'get',
    params
  })
}