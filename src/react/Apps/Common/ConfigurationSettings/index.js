import jQuery from 'jquery';

export default class ConfigurationSettings {
    getMainSiteUrlRoot(){
        return import.meta.env.REACT_APP_TECHNOLOGY_SITE_URL;
    }

    getWebServiceUrlRoot() {
        return import.meta.env.REACT_APP_TECHNOLOGY_API_URL;
    }

    getManageRadarsUrlRoot() {
        return import.meta.env.REACT_APP_TECHNOLOGY_MANAGE_RADARS_URL;
    }

    getAdminRadarsUrlRoot() {
        return import.meta.env.REACT_APP_TECHNOLOGY_ADMIN_URL;
    }
}