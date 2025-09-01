import axios from 'axios'

declare const payamitoPlusJsObject: {
  rootapiurl: string
  nonce: string
}

export const axiosInstance = axios.create({
  baseURL: payamitoPlusJsObject.rootapiurl + 'wpstorm-clean-admin/v1/',
  headers: {
    'content-type': 'application/json',
    'X-WP-Nonce': payamitoPlusJsObject.nonce
  }
})
