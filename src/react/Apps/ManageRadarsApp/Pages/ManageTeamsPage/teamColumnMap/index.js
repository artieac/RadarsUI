'use strict'
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom';

export const teamColumnMap = (currentUser) => {
    const getTeamMembersLink = (userId, teamId) => {
        return '/manageradars/user/' + userId + '/team/' + teamId + '/members';
    }

    const getTeamRadarsLink = (userId, teamId) => {
        return '/manageradars/user/' + userId + '/team/' + teamId + '/radars';
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
      title: 'Members',
      key: 'members',
      render: rowData => {
        return (
            <Link to={ this.getTeamMembersLink(currentUser.id, rowData.id)}>
                <button className="btn btn-techradar">Members</button>
            </Link>
        );
      },
    },
    {
      title: 'Radars',
      key: 'radars',
      render: rowData => {
        return (
            <Link to={ this.getTeamRadarsLink(currentUser.id, rowData.id)}>
                <button className="btn btn-techradar">Radars</button>
            </Link>
            );},
        },
    ];
};

export default teamColumnMap;