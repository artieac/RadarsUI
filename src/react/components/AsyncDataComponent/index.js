import React from 'react';
import "./component.css"

const AsyncDataComponent = ({ isLoading, targetComponent }) => {
    if(isLoading==true){
        return(
            <div className="">
                <img src=""/>
            </div>
        )
    } else {
        return ( targetComponent );
    }
}