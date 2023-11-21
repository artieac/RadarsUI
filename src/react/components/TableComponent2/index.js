import React from 'react';
import PropTypes from 'prop-types'
import LoadingComponent from '../LoadingComponent'

const TableComponent2 = ({ rowDefinition, data, bordered, hoverable, striped, isDark, hideHeader, isLoading }) => {
    if(isLoading==true){
        return ( <LoadingComponent/> );
    } else {
        return (
            <div className="table-responsive">
                <table className={`table ${bordered ? 'table-bordered' : 'table-borderless'} ${hoverable && 'table-hover'} ${striped && 'table-striped'} ${isDark && 'table-dark'}`}>
                     <thead>
                         <tr className={ `${hideHeader && 'hidden'}`}>
                             {rowDefinition.metadata.map((headerItem, index) => (
                                 <th key={index}>{headerItem.title}</th>
                             ))}
                         </tr>
                     </thead>
                     <tbody>
                        {data.map((item, index) => (
                            rowDefinition.render(item)
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

TableComponent2.propTypes = {
    rowDefinition: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    bordered: PropTypes.bool,
    hoverable: PropTypes.bool,
    striped: PropTypes.bool,
    isDark: PropTypes.bool,
    hideHeader: PropTypes.bool,
    isLoading: PropTypes.bool,
}

TableComponent2.defaultProps = {
    bordered: true,
    hoverable: false,
    striped: false,
    isDark: false,
    hideHeader: false,
    isLoading: false
}

export default TableComponent2;