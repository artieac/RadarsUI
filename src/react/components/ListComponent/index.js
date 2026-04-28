import React from 'react';
import PropTypes from 'prop-types'

const ListComponent = ({ id, itemMap, data }) => {
    const renderOptions = () => {
        if(data!='undefined' && data!=null && data.length > 0){
            return(
                data.map((item, index) => (
                    itemMap.render(item)
               ))
            );
        }
    }

    return (
        <div>
            <ul id={ id } className="list-group">
                  { renderOptions() }
            </ul>
        </div>
    )
}

ListComponent.propTypes = {
    data: PropTypes.array.isRequired,
    itemMap: PropTypes.object.isRequired,
    id: PropTypes.string
}

export default ListComponent;