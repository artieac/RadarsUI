import React from 'react';
import PropTypes from 'prop-types'

const DivTableComponent = ({ cols, data, bordered, hoverable, striped, isDark, hideHeader }) => {
    if(data!=undefined){
        return (
            <div className="container">
                <div className={ `row ${bordered ? 'table-bordered' : 'table-borderless'} ${hoverable && 'table-hover'}  ${isDark && 'table-dark'}`}>
                    <div className="col-lg-12">
                        <div className={ `row ${hideHeader && 'hidden'}`}>
                            {cols.map((headerItem, index) => (
                                <div className="col-lg-3" key={index}>{headerItem.title}</div>
                            ))}
                        </div>
                        {data.map((item, index) => (
                            <div className={  index % 2 > 0 ? "row alternatingRow" : "row"} key={index}>
                                {cols.map((col, key) => (
                                    <div className="col-lg-3">{ col.render(item) }</div>
                                ))}
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
                            {cols.map((headerItem, index) => (
                                <div className="col-lg-3" key={index}>{headerItem.title}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

DivTableComponent.propTypes = {
    cols: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    bordered: PropTypes.bool,
    hoverable: PropTypes.bool,
    striped: PropTypes.bool,
    isDark: PropTypes.bool,
    hideHeader: PropTypes.bool,
}

DivTableComponent.defaultProps = {
    bordered: false,
    hoverable: false,
    striped: true,
    isDark: false,
    hideHeader: false,
}

export default DivTableComponent;