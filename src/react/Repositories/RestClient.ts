import jQuery from 'jquery';
import { isValid } from '../Apps/Common/Utilities'

export class RestClient {
    getXsrfToken(): string | undefined {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : undefined;
    }

    getXsrfHeaders(): Record<string, string> {
        const xsrfToken = this.getXsrfToken();
        return xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {};
    }

    getWebServiceUrlRoot() {
        let url = import.meta.env.REACT_APP_TECHNOLOGY_API_URL;
        return this.ensureHttpsIfRequired(url);
    }

    ensureHttpsIfRequired(url: string) {
        if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url && url.startsWith('http://')) {
            if (!url.includes('local') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
                url = url.replace('http://', 'https://');
            }
        }
        return url;
    }

     getRequest(url: string, responseHandler: Function) {
        jQuery.ajax({
             headers: {
                     'Accept': 'application/json',
             },
             type: "GET",
             url: this.getWebServiceUrlRoot() + url,
             xhrFields: {
                 withCredentials: true
             },
             async: true,
             dataType: 'json',
             success: function(data: any) {
                   responseHandler(true, data);
              },
             error: function(xhr: any, status: any, err: any) {
                   responseHandler(false, err);
             }
       });
    }

    postRequest(url: string, params: any, responseHandler: Function){
        let effectiveParams = params;
        let effectiveHandler = responseHandler;

        if (typeof params === 'function') {
            effectiveHandler = params;
            effectiveParams = {};
        }

        if(isValid(effectiveParams)){
            jQuery.ajax({
                  headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     ...this.getXsrfHeaders(),
                  },
                  type: "POST",
                  url: this.getWebServiceUrlRoot() + url,
                  xhrFields: {
                    withCredentials: true
                  },
                  data: JSON.stringify(effectiveParams),
                  success: function(data: any) {
                        effectiveHandler(true, data);
                   },
                  error: function(xhr: any, status: any, err: any) {
                        effectiveHandler(false);
                  }
            });
        }
        else {
            jQuery.ajax({
                  headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     ...this.getXsrfHeaders(),
                  },
                  type: "POST",
                  url: this.getWebServiceUrlRoot() + url,
                  xhrFields: {
                    withCredentials: true
                  },
                  success: function(data: any) {
                        effectiveHandler(true, data);
                   },
                  error: function(xhr: any, status: any, err: any) {
                        effectiveHandler(false);
                  }
            });
        }
    }

    putRequest(url: string, params: any, responseHandler: Function){
        let effectiveParams = params;
        let effectiveHandler = responseHandler;

        if (typeof params === 'function') {
            effectiveHandler = params;
            effectiveParams = {};
        }

        if(isValid(effectiveParams)){
            jQuery.ajax({
                  headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     ...this.getXsrfHeaders(),
                  },
                  type: "PUT",
                  url: this.getWebServiceUrlRoot() + url,
                  xhrFields: {
                    withCredentials: true
                  },
                  data: JSON.stringify(effectiveParams),
                  success: function(data: any) {
                        effectiveHandler(true, data);
                   },
                  error: function(xhr: any, status: any, err: any) {
                        effectiveHandler(false);
                  }
            });
        }
        else {
            jQuery.ajax({
                  headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     ...this.getXsrfHeaders(),
                  },
                  type: "PUT",
                  url: this.getWebServiceUrlRoot() + url,
                  xhrFields: {
                    withCredentials: true
                  },
                  success: function(data: any) {
                        effectiveHandler(true, data);
                   },
                  error: function(xhr: any, status: any, err: any) {
                        effectiveHandler(false);
                  }
            });
        }
    }

    deleteRequest(url: string, responseHandler: Function){
        jQuery.ajax({
              headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     ...this.getXsrfHeaders(),
              },
              type: "DELETE",
              url: this.getWebServiceUrlRoot() + url,
              xhrFields: {
                withCredentials: true
              },
              success: function(data: any) {
                    responseHandler(true, data);
               },
              error: function(xhr: any, status: any, err: any) {
                    responseHandler(false);
              }
        });
    }
}