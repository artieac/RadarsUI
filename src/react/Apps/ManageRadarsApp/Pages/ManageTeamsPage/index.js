'use strict'
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { addTeamsToState, addCurrentTeamToState, addMemberTeamsToState } from 'Redux/TeamReducer';
import { addUsersToState } from 'Redux/UserReducer';
import { TeamRepository } from 'Repositories/TeamRepository'
import { UserRepository } from 'Repositories/UserRepository'
import TableComponent from 'SharedComponents/TableComponent'
import DropdownComponent from "SharedComponents/DropdownComponent";
import { dropdownItem } from "SharedComponents/DropdownComponent/dropdownItem";

const ManageTeamsPage = () => {
    const [newTeamName, setNewTeamName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const allUsers = useSelector((state) => state.userReducer.users);
    const memberTeams = useSelector((state) => state.teamReducer.memberTeams);
    const currentTeam = useSelector((state) => state.teamReducer.currentTeam);

    useEffect(() => {
        if (currentUser && currentUser.id) {
            let teamRepository = new TeamRepository();
            teamRepository.getAllByUser(currentUser.id, handleGetAllTeamsResponse);
            teamRepository.getTeamsByMember(currentUser.id, handleGetMemberTeamsResponse);

            let userRepository = new UserRepository();
            userRepository.getAll(handleGetAllUsersResponse);
        }
    }, [currentUser]);

    const handleGetAllTeamsResponse = (wasSuccessful, teams) => {
        if (wasSuccessful === true) {
            dispatch(addTeamsToState(teams));
            if (teams && teams.length > 0) {
                dispatch(addCurrentTeamToState(teams[0]));
            } else {
                dispatch(addCurrentTeamToState(null));
            }
        }
    }

    const handleGetMemberTeamsResponse = (wasSuccessful, teams) => {
        if (wasSuccessful === true) {
            dispatch(addMemberTeamsToState(teams));
        }
    }

    const handleGetAllUsersResponse = (wasSuccessful, users) => {
        if (wasSuccessful === true) {
            dispatch(addUsersToState(users));
        }
    }

    const handleCreateTeam = (e) => {
        e.preventDefault();
        if (newTeamName.trim() === '') return;

        let teamRepository = new TeamRepository();
        teamRepository.addTeam(currentUser.id, newTeamName, (wasSuccessful, updatedTeams) => {
            if (wasSuccessful === true && updatedTeams && updatedTeams.length > 0) {
                dispatch(addTeamsToState(updatedTeams));
                dispatch(addCurrentTeamToState(updatedTeams[0]));
                setNewTeamName('');
            }
        });
    }

    const handleAddMember = (selectedUser) => {
        if (!currentTeam || !selectedUser) return;
        
        let teamRepository = new TeamRepository();
        teamRepository.addMember(currentTeam.id, selectedUser.id, (wasSuccessful, updatedTeam) => {
            if (wasSuccessful === true) {
                dispatch(addCurrentTeamToState(updatedTeam));
            }
        });
    }

    const handleInviteUser = (e) => {
        e.preventDefault();
        alert("Invitation feature is coming soon! Sending invite to: " + inviteEmail);
        setInviteEmail('');
    }

    const memberColumns = [
        { title: 'Name', key: 'name', render: rowData => <span>{rowData.name}</span> },
        { title: 'Email', key: 'email', render: rowData => <span>{rowData.email}</span> }
    ];

    const teamColumns = [
        { title: 'Team Name', key: 'name', render: rowData => <span>{rowData.name}</span> },
        { title: 'Owner', key: 'owner', render: rowData => <span>{rowData.owner ? rowData.owner.name : 'N/A'}</span> }
    ];

    const getAvailableUsers = () => {
        if (!currentTeam || !allUsers) return [];
        const memberIds = currentTeam.teamMembers ? currentTeam.teamMembers.map(m => m.id) : [];
        return allUsers.filter(u => u.id !== currentTeam.owner.id && !memberIds.includes(u.id));
    }

    const hasTeam = currentTeam && currentTeam.id;

    return (
        <div className="bodyContent">
            <div className="row">
                <div className="col-md-12">
                    <div className="contentPageTitle">
                        <label>Manage Your Team</label>
                    </div>
                </div>
            </div>

            {!hasTeam ? (
                <div className="row" style={{ marginBottom: '20px' }}>
                    <div className="col-md-6">
                        <p>You don't have a team yet. Create one to start collaborating.</p>
                        <form onSubmit={handleCreateTeam} className="form-inline">
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter team name" 
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    style={{ marginRight: '10px' }}
                                />
                                <button type="submit" className="btn btn-techradar">Create Team</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="row" style={{ marginBottom: '20px' }}>
                        <div className="col-md-12">
                            <h3>Team: {currentTeam.name}</h3>
                            <p>Owner: {currentTeam.owner.name}</p>
                        </div>
                    </div>

                    <div className="row" style={{ marginBottom: '20px' }}>
                        <div className="col-md-6">
                            <h4>Add Member</h4>
                            <div className="form-group">
                                <DropdownComponent 
                                    title="Select User to Add" 
                                    itemMap={ dropdownItem(handleAddMember, "email", "name") } 
                                    data={ getAvailableUsers() }
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h4>Invite New User</h4>
                            <form onSubmit={handleInviteUser} className="form-inline">
                                <div className="form-group">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="Enter email address" 
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    <button type="submit" className="btn btn-techradar">Invite</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="row" style={{ marginBottom: '40px' }}>
                        <div className="col-md-12">
                            <h4>Team Members</h4>
                            <TableComponent
                                data={ currentTeam.teamMembers || [] }
                                cols={ memberColumns }
                                hoverable
                                striped
                                bordered={false}/>
                        </div>
                    </div>
                </div>
            )}

            <hr/>

            <div className="row">
                <div className="col-md-12">
                    <div className="contentPageTitle">
                        <label>Teams You're A Member Of</label>
                    </div>
                    {memberTeams && memberTeams.length > 0 ? (
                        <TableComponent
                            data={ memberTeams }
                            cols={ teamColumns }
                            hoverable
                            striped
                            bordered={false}/>
                    ) : (
                        <p>You are not a member of any other teams.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageTeamsPage;
