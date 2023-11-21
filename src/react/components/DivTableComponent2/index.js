import React from 'react';
import PropTypes from 'prop-types'

const DivTableComponent2 = ({ rowDefinition, data, bordered, hoverable, striped, isDark, hideHeader }) => {
    if(data!=undefined){
        return (
            <div className="container">
                <div className={ `row ${bordered ? 'table-bordered' : 'table-borderless'} ${hoverable && 'table-hover'}  ${isDark && 'table-dark'}`}>
                    <div className="col-lg-12">
                        <div className={ `row ${hideHeader && 'hidden'}`}>
                             {rowDefinition.metadata.map((headerItem, index) => (
                                <div className="col" key={index}>{headerItem.title}</div>
                             ))}
                        </div>
                        {data.map((item, index) => (
                            <div className={  index % 2 > 0 ? "row alternatingRow" : "row"} key={index}>
                               { rowDefinition.render(item, index % 2 > 0 ? "row alternatingRow" : "row") }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container">
                <div className={ `row ${bordered ? 'table-bordered' : 'table-borderless'} ${hoverable && 'table-hover'}  ${isDark && 'table-dark'}`}>
                    <div className="col-lg-12">
                        <div className={ `row ${hideHeader && 'hidden'}`}>
                             {rowDefinition.metadata.map((headerItem, index) => (
                                <div className="col-lg-3" key={index}>{headerItem.title}</div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

DivTableComponent2.propTypes = {
    rowDefinition: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    bordered: PropTypes.bool,
    hoverable: PropTypes.bool,
    striped: PropTypes.bool,
    isDark: PropTypes.bool,
    hideHeader: PropTypes.bool,
}

DivTableComponent2.defaultProps = {
    bordered: false,
    hoverable: false,
    striped: true,
    isDark: false,
    hideHeader: false,
}

export default DivTableComponent2;