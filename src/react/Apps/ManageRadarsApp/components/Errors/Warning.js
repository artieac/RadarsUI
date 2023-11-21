export const Warning_NoRadarRings = 1;

export class Warning
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
            case Warning_NoRadarRings:
                retVal = "You must add a radar ring in before saving.";
                break;
            default:
                break;
        }

        return retVal;
    }
}