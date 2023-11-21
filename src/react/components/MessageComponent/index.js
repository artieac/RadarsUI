import React from 'react';
import "./component.css"

const MessageComponent = ({ messageType, message, show}) => {
    const styleMessage = (messageType) => {
        if(messageType=="warning"){
            return "warning-text";
        } else {
            if(messageType=="error"){
                return "error-text";
            }
        }

        return "";
    }

    if(show==false){
        return ( <div/> );
    } else {
        return(
            <div className={ this.show==true ? "col-md-6" : "hidden"}>
                <div className={this.styleMessage(messageType)}>{ message }</div>
            </div>
        );
    }
}

export default MessageComponent;