import { Error } from './Error';

export default class ErrorManager
{
    constructor()
    {
        this.errors = [];
    }

    setErrors(_errors)
    {
        this.errors = _errors;
    }

    hasErrors()
    {
        var retVal = false;

        if(this.errors !== undefined && this.errors.length > 0)
        {
            retVal = true;
        }

        return retVal;
    }

    addError(errorType)
    {
        // If the warning is already in the list don't add it again
        if(this.errors[errorType]===undefined)
        {
            var newError = new Error(errorType);
            this.errors[errorType] = newError;
        }
    }

    removeError(errorType)
    {
        if(this.errors[errorType]!==undefined)
        {
            delete this.errors[errorType];
        }
    }
}