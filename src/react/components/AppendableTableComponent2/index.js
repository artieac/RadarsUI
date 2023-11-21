import React, { useState } from 'react';
import PropTypes from 'prop-types'
import LoadingComponent from '../LoadingComponent'

const AppendableTableComponent2 = ( { rowDefinition, data, bordered, hoverable, striped, isDark, hideHeader, insertionCols, appendToBottom, isLoading } ) => {
    const renderHeader = () =>{
        return(
            <thead>
                <tr className={ `${hideHeader && 'hidden'}`}>
                    {rowDefinition.metadata.map((headerItem, index) => (
                        <th key={index}>{headerItem.title}</th>
                    ))}
                </tr>
            </thead>
        )
    }

    const renderInsertionRow = (topRender) => {
        if(topRender && !appendToBottom){
            return(
                rowDefinition.renderInsert(true)
            );
        }
    }

    const renderExistingRows = (rowData) => {
        if(rowData!=undefined){
            return(
                rowData.map((item, index) => (
                    rowDefinition.render(item)
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

AppendableTableComponent2.propTypes = {
    rowDefinition: PropTypes.object,
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

AppendableTableComponent2.defaultProps = {
    bordered: true,
    hoverable: false,
    striped: false,
    isDark: false,
    hideHeader: false,
    appendToBottom: false,
    isLoading: false,
}

export default AppendableTableComponent2;