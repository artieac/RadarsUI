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
        title: 'Roles',
        key: 'role',
        render: rowData => {
            return (
                <span>
                    {isValid(rowData.role) ? rowData.role.name : "N/A"}
                </span>
            );
        },
    },
    {
         title: 'UserType',
         key: 'userType',
         render: rowData => {
             return <span>{isValid(rowData.userType) ? rowData.userType.name : "N/A"}</span>;
         }
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