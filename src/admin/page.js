"use client"
import React, { useEffect, useState } from 'react';
import { updateUser } from '@/services/api/user.api';
import { fetchUsers } from '@/services/api/user.api';
import useAuthStore from "@/stores/authStore";
import './page.css';

const Page = () => {
    const { isLogged } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editedUserData, setEditedUserData] = useState({});

    useEffect(() => {
        if (!users) {
            return window.location.replace('/account');
        }else {
            console.log('isLogged:', users);
        }
        setLoading(true);
        fetchUsers().then((response) => {
            setUsers(response);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }, []); 

    const handleEditUser = (user) => {
        setEditingUser(user);
        setEditedUserData({ ...user });
    };

    const handleSaveUser = async () => {
        try {
            setLoading(true);
            await updateUser(editedUserData);
            const updatedUsers = users.map(u => (u.id === editedUserData.id ? editedUserData : u));
            setUsers(updatedUsers);
            setEditingUser(null);
            setEditedUserData({});
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (user) => {
        const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer l'utilisateur ${user.lastname} ${user.firstname} ?`);

        if (confirmDelete) {
            try {
                setLoading(true);
                await deleteUser(user.id);
                const updatedUsers = users.filter(u => u.id !== user.id);
                setUsers(updatedUsers);
            } catch (error) {
                console.error('Error deleting user:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Voici la liste de vos utilisateurs</h1>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Adresse</th>
                        <th>Code Postal</th>
                        <th>Ville</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map(user => (
                        <tr key={user.mail}>
                            <td>
                                {editingUser === user ? (
                                    <input
                                        type="text"
                                        value={editedUserData.lastname}
                                        onChange={(e) => setEditedUserData({ ...editedUserData, lastname: e.target.value })}
                                    />
                                ) : (
                                    <>{user.lastname}</>
                                )}
                            </td>
                            <td>
                                {editingUser === user ? (
                                    <input
                                        type="text"
                                        value={editedUserData.firstname}
                                        onChange={(e) => setEditedUserData({ ...editedUserData, firstname: e.target.value })}
                                    />
                                ) : (
                                    <>{user.firstname}</>
                                )}
                            </td>
                            <td>
                                {editingUser === user ? (
                                    <input
                                        type="text"
                                        value={editedUserData.address}
                                        onChange={(e) => setEditedUserData({ ...editedUserData, address: e.target.value })}
                                    />
                                ) : (
                                    <>{user.address}</>
                                )}
                            </td>
                            <td>
                                {editingUser === user ? (
                                    <input
                                        type="text"
                                        value={editedUserData.zipcode}
                                        onChange={(e) => setEditedUserData({ ...editedUserData, zipcode: e.target.value })}
                                    />
                                ) : (
                                    <>{user.zipcode}</>
                                )}
                            </td>
                            <td>
                                {editingUser === user ? (
                                    <input
                                        type="text"
                                        value={editedUserData.city}
                                        onChange={(e) => setEditedUserData({ ...editedUserData, city: e.target.value })}
                                    />
                                ) : (
                                    <>{user.city}</>
                                )}
                            </td>
                            <td>
                                {editingUser === user ? (
                                    <input
                                        type="text"
                                        value={editedUserData.phone}
                                        onChange={(e) => setEditedUserData({ ...editedUserData, phone: e.target.value })}
                                    />
                                ) : (
                                    <>{user.phone}</>
                                )}
                            </td>
                            <td>
                                {editingUser === user ? (
                                    <input
                                        type="text"
                                        value={editedUserData.mail}
                                        onChange={(e) => setEditedUserData({ ...editedUserData, mail: e.target.value })}
                                    />
                                ) : (
                                    <>{user.mail}</>
                                )}
                            </td>
                            <td>
                                {editingUser === user ? (
                                    <button className="user-actions-button save" onClick={handleSaveUser}>
                                        Sauvegarder
                                    </button>
                                ) : (
                                    <>
                                        <button className="user-actions-button" onClick={() => handleEditUser(user)}>
                                            Editer
                                        </button>
                                        <button className="user-actions-button delete" onClick={() => handleDeleteUser(user)}>
                                            Supprimer
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Page;
