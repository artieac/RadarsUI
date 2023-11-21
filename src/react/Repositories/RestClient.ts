import jQuery from 'jquery';
import { isValid } from '../Apps/Common/Utilities'

export class RestClient {
     webServiceUrlRoot = "http://technologyradar.amflocal.com:8081";

     getRequest(url: string, responseHandler: Function) {
        jQuery.ajax({
             headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     'credentials': 'include',
             },
             type: "GET",
             url: this.webServiceUrlRoot + url,
             async: true,
             dataType: 'json',
             success: function(data: any) {
                   responseHandler(true, data);
              },
             error: function(xhr: any, status: any, err: any) {
                   responseHandler(false);
             }
       });
    }

    postRequest(url: string, params: any, responseHandler: Function){
        if(isValid(params)){
            jQuery.ajax({
                  headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     'credentials': 'include',
                  },
                  type: "POST",
                  url: this.webServiceUrlRoot + url,
                  data: JSON.stringify(params),
                  success: function(data: any) {
                        responseHandler(true, data);
                   },
                  error: function(xhr: any, status: any, err: any) {
                        responseHandler(false);
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
                  url: this.webServiceUrlRoot + url,
                  success: function(data: any) {
                        responseHandler(true, data);
                   },
                  error: function(xhr: any, status: any, err: any) {
                        responseHandler(false);
                  }
            });
        }
    }

    putRequest(url: string, params: any, responseHandler: Function){
        if(isValid(params)){
            jQuery.ajax({
                  headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     'credentials': 'include',
                  },
                  type: "PUT",
                  url: this.webServiceUrlRoot + url,
                  data: JSON.stringify(params),
                  success: function(data: any) {
                        responseHandler(true, data);
                   },
                  error: function(xhr: any, status: any, err: any) {
                        responseHandler(false);
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
                  success: function(data: any) {
                        responseHandler(true, data);
                   },
                  error: function(xhr: any, status: any, err: any) {
                        responseHandler(false);
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
              url: this.webServiceUrlRoot + url,
              success: function(data: any) {
                    responseHandler(true, data);
               },
              error: function(xhr: any, status: any, err: any) {
                    responseHandler(false);
              }
        });
    }
}