'use strict'
import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom';
import DropdownComponent from "SharedComponents/DropdownComponent";
import dropdownItem from "SharedComponents/DropdownComponent/dropdownItem";

const userColumnMap = (roles) => {
    const [dropdownSelection, setDropdownSelection] = useState({});
    const dispatch = useDispatch();

    const handleDropdownSelectionChange = (selectedItem) => {
        setDropdownSelection(selectedItem);
    }

    const getDropdownSelection = (selectedItem) => {
        if(dropdownSelection!=undefined && dropdownSelection.name !== undefined){
            return dropdownSelection.name;
        }

        return "Select";
    }

    const getRadarUrl = (rowData) => {
        return "/home/user/" + rowData.id + "/radars";
    }

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
                    <DropdownComponent title= { getDropdownSelection() }  itemMap= { dropdownItem(handleDropdownSelectionChange, "description", "name") } data={roles}/>
                </span>
            );
        },
    },
    {
         title: 'UserType',
         key: 'userType',
         render: rowData => {
             return <span>{rowData.userType.name}</span>;
         }
    },
    {
         title: 'Radars',
         key: 'radars',
         render: rowData => {
             return ( <a className="btn btn-techradar" href={ this.getRadarUrl()}>Radars</a>);
        }
    }
  ];
};