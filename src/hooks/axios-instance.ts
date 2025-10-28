import axios from 'axios';

declare const stormCleanAdminJsObject: {
  rootapiurl: string;
  nonce: string;
};

export const axiosInstance = axios.create({
  baseURL: stormCleanAdminJsObject.rootapiurl + 'storm-clean-admin/v1/',
  headers: {
    'content-type': 'application/json',
    'X-WP-Nonce': stormCleanAdminJsObject.nonce,
  },
});
