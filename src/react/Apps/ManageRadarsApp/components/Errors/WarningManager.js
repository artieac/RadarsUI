import { Warning } from './Warning';

export default class WarningManager
{
    constructor()
    {
        this.warnings = [];
    }

    setWarnings(_warnings)
    {
        this.warnings = _warnings;
    }

    hasWarnings()
    {
        var retVal = false;

        if(this.warnings !== undefined && this.warnings.length > 0)
        {
            retVal = true;
        }

        return retVal;
    }

    addWarning(warningType)
    {
        // If the warning is already in the list don't add it again
        if(this.warnings[warningType]===undefined)
        {
            var newWarning = new Warning(warningType);
            this.warnings[warningType] = newWarning;
        }
    }

    removeWarning(warningType)
    {
        if(this.warnings[warningType]!==undefined)
        {
            delete this.warnings[warningType];
        }
    }
}