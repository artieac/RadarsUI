export const Error_NoRadarRings = "You must add a radar ring in before saving.";

export class Error
{
    constructor(type)
    {
        this.type = type;
    }

    getType() { return this.type;}

    getMessage()
    {
        var retVal = "";

        switch(this.type)
        {
            case Error_NoRadarRings:
                retVal = "You must add a radar ring in before saving.";
                break;
            default:
                break;
        }

        return retVal;
    }
}