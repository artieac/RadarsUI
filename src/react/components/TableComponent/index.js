import React from 'react';
import PropTypes from 'prop-types'
import LoadingComponent from '../LoadingComponent'

const TableComponent = ({ cols, data, bordered, hoverable, striped, isDark, hideHeader, isLoading }) => {
    if(isLoading==true){
        return ( <LoadingComponent/> );
    } else {
        return (
            <div className="table-responsive">
                <table className={`table ${bordered ? 'table-bordered' : 'table-borderless'} ${hoverable && 'table-hover'} ${striped && 'table-striped'} ${isDark && 'table-dark'}`}>
                    <thead>
                        <tr className={ `${hideHeader && 'hidden'}`}>
                            {cols.map((headerItem, index) => (
                                <th key={index}>{headerItem.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {cols.map((col, key) => (
                                    <td key={key}>{col.render(item)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

TableComponent.propTypes = {
    cols: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    bordered: PropTypes.bool,
    hoverable: PropTypes.bool,
    striped: PropTypes.bool,
    isDark: PropTypes.bool,
    hideHeader: PropTypes.bool,
    isLoading: PropTypes.bool,
}

TableComponent.defaultProps = {
    bordered: true,
    hoverable: false,
    striped: false,
    isDark: false,
    hideHeader: false,
    isLoading: false
}

export default TableComponent;