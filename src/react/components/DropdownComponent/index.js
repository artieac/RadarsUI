import React from 'react';
import PropTypes from 'prop-types'
import { isValid } from 'Apps/Common/Utilities'

import "./component.css"

const DropdownComponent = ({ title, itemMap, data }) => {
    const renderSelectionButton = () =>{
        return(
            <button className="btn btn-techradar dropdown-toggle" type="button" id="dropdownContainer" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                { title } <span className="caret"></span>
            </button>
        );
    }

    const renderOptions = () => {
        if(isValid(data) && data.length > 0){
            return(
                data.map((item, index) => (
                    <li key={index}>
                        { itemMap.map((itemMapElement, subIndex) => (
                            itemMapElement.render(item, subIndex)
                        ))}
                     </li>
                ))
            );
        }
    }

    return (
        <div className="dropdown">
            { renderSelectionButton() }
            <ul className="dropdown-menu" aria-labelledby="dropdownContainer">
                 { renderOptions() }
            </ul>
        </div>
    );
}

DropdownComponent.propTypes = {
    title: PropTypes.string,
    itemMap: PropTypes.array,
    data: PropTypes.array
}

export default DropdownComponent;
