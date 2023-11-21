import React from 'react';
import PropTypes from 'prop-types'

const AppendableDivTableComponent = ({ cols, data, bordered, hoverable, striped, isDark, hideHeader, insertionCols, appendToBottom }) => {

    const renderHeader = () => {
        return (
            <div className={ `row ${hideHeader && 'hidden'}`}>
               {cols.map((headerItem, index) => (
                   <div className="col" key={index}>{headerItem.title}</div>
               ))}
            </div>
        );
    }

    const renderInsertionRow = (topRender) => {
        if(topRender && !appendToBottom){
            return(
                <div className="row" key="insertion">
                    {insertionCols.map((col, index) => (
                        <div className="col" key={index}>{col.render()}</div>
                    ))}
                </div>
            );
        }
    }

    const renderExistingRows = (rowData) => {
        if(rowData!=undefined){
            return (
                rowData.map((item, index) => (
                    <div className={ index % 2 > 0 ? "row alternatingRow" : "row"} key={index}>
                        {cols.map((col, subIndex) => (
                            <div key={subIndex} className="col">{ col.render(item) }</div>
                        ))}
                    </div>
                ))
            );
        }
    }

    return (
        <div className="container">
            <div className={ `row ${bordered ? 'table-bordered' : 'table-borderless'} ${hoverable && 'table-hover'}  ${striped && 'table-striped'} ${isDark && 'table-dark'}`}>
                <div className="col">
                    {renderHeader }
                    { renderInsertionRow(true)}
                    { renderExistingRows(data)}
                    { renderInsertionRow(false)}
                </div>
            </div>
        </div>
    );
}

AppendableDivTableComponent.propTypes = {
    cols: PropTypes.array,
    data: PropTypes.array,
    bordered: PropTypes.bool,
    hoverable: PropTypes.bool,
    striped: PropTypes.bool,
    isDark: PropTypes.bool,
    hideHeader: PropTypes.bool,
}

AppendableDivTableComponent.defaultProps = {
    bordered: false,
    hoverable: false,
    striped: true,
    isDark: false,
    hideHeader: false,
}

export default AppendableDivTableComponent;