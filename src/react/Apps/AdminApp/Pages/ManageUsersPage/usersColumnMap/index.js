'use strict'
import React from 'react';
import { isValid } from 'Apps/Common/Utilities';

const getRadarUrl = (rowData) => {
    return "/admin/user/" + rowData.id + "/radars";
}

const userColumnMap = (roles) => {
    return [
    {
        title: 'Name',
        key: 'name',
        render: rowData => {
            return <span>{rowData.name}</span>;
        },
    },
    {
        title: 'Email',
        key: 'email',
        render: rowData => {
            return <span>{rowData.email}</span>;
        },
    },
    {
        title: 'Role',
        key: 'subscriptionRoleName',
        render: rowData => {
            return (
                <span>
                    {rowData.subscriptionRoleName || "N/A"}
                </span>
            );
        },
    },
    {
         title: 'Radars',
         key: 'radars',
         render: rowData => {
             return ( <a className="btn btn-techradar" href={ getRadarUrl(rowData)}>Radars</a>);
        }
    }
  ];
};

export default userColumnMap;