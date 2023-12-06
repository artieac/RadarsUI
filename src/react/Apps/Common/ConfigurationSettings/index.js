import jQuery from 'jquery';

export default class ConfigurationSettings {
    getMainSiteUrlRoot(){
        if(process.env.NODE_ENV=="development"){
            return process.env.REACT_APP_TECHNOLOGY_SITE_URL_DEV;
        }

        return process.env.REACT_APP_TECHNOLOGY_SITE_URL_PROD;
    }

    getWebServiceUrlRoot() {
        if(process.env.NODE_ENV=="development"){
            return process.env.REACT_APP_TECHNOLOGY_API_URL_DEV;
        }

        return process.env.REACT_APP_TECHNOLOGY_API_URL_PROD;
    }

    getManageRadarsUrlRoot() {
        if(process.env.NODE_ENV=="development"){
            return process.env.REACT_APP_TECHNOLOGY_MANAGE_RADARS_URL_DEV;
        }

        return process.env.REACT_APP_TECHNOLOGY_MANAGE_RADARS_URL_PROD;
    }

    getAdminRadarsUrlRoot() {
        if(process.env.NODE_ENV=="development"){
            return process.env.REACT_APP_TECHNOLOGY_ADMIN_URL_DEV;
        }

        return process.env.REACT_APP_TECHNOLOGY_ADMIN_URL_PROD;
    }
}