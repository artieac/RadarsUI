import React, { useState } from 'react';
import PropTypes from 'prop-types'
import LoadingComponent from '../LoadingComponent'

const AppendableTableComponent = ( { cols, data, bordered, hoverable, striped, isDark, hideHeader, insertionCols, appendToBottom, isLoading } ) => {
    const renderHeader = () =>{
        return(
            <thead>
                <tr className={ `${hideHeader && 'hidden'}`}>
                    {cols.map((headerItem, index) => (
                        <th key={index}>{headerItem.title}</th>
                    ))}
                </tr>
            </thead>
        )
    }

    const renderInsertionRow = (topRender) => {
        if(topRender && !appendToBottom){
            return(
                <tr>
                    {insertionCols.map((col, index) => (
                        <td key={index}>{col.render()}</td>
                    ))}
                </tr>
            );
        }
    }

    const renderExistingRows = (rowData) => {
        if(rowData!=undefined){
            return(
                rowData.map((item, index) => (
                    <tr key={index}>
                        {cols.map((col, key) => (
                            <td key={key}>{col.render(item)}</td>
                        ))}
                    </tr>
                ))
            );
        }
    }

    if(isLoading==true){
        return ( <LoadingComponent/> );
    } else {
        return(
            <div className="table-responsive">
                <table className={`table ${bordered ? 'table-bordered' : 'table-borderless'} ${hoverable && 'table-hover'} ${striped && 'table-striped'} ${isDark && 'table-dark'}`}>
                    { renderHeader()}
                    <tbody>
                        { renderInsertionRow(true)}
                        { renderExistingRows(data) }
                        { renderInsertionRow(false)}
                    </tbody>
                </table>
            </div>
       );
    }
}

AppendableTableComponent.propTypes = {
    cols: PropTypes.array,
    insertionCols: PropTypes.array,
    data: PropTypes.array,
    bordered: PropTypes.bool,
    hoverable: PropTypes.bool,
    striped: PropTypes.bool,
    isDark: PropTypes.bool,
    hideHeader: PropTypes.bool,
    appendToBottom: PropTypes.bool,
    isLoading: PropTypes.bool,
}

AppendableTableComponent.defaultProps = {
    bordered: true,
    hoverable: false,
    striped: false,
    isDark: false,
    hideHeader: false,
    appendToBottom: false,
    isLoading: false,
}

export default AppendableTableComponent;