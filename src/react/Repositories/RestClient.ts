import jQuery from 'jquery';
import { isValid } from '../Apps/Common/Utilities'

export class RestClient {
    getWebServiceUrlRoot() {
        return import.meta.env.REACT_APP_TECHNOLOGY_API_URL;
    }

     getRequest(url: string, responseHandler: Function) {
        jQuery.ajax({
             headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     'credentials': 'include',
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
                     'credentials': 'include',
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
                     'credentials': 'include',
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
                     'credentials': 'include',
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
                     'credentials': 'include',
                  },
                  type: "PUT",
                  url: url,
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
                     'credentials': 'include',
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