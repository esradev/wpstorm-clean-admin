import axios from 'axios';

declare const wpstormCleanAdminJsObject: {
  rootapiurl: string;
  nonce: string;
};

export const axiosInstance = axios.create({
  baseURL: wpstormCleanAdminJsObject.rootapiurl + 'wpstorm-clean-admin/v1/',
  headers: {
    'content-type': 'application/json',
    'X-WP-Nonce': wpstormCleanAdminJsObject.nonce,
  },
});
