"use client"
import React, {useEffect, useState} from 'react';
import { updateUser } from '@/services/api/user.api';
import { fetchUsers } from '@/services/api/user.api';

const Page = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers().then((response) => {
            console.log('Response from fetchUsers:', response);
            setUsers(response.data);
        });
    }, [users]);

    console.log('Users array before render:', users); // Ajoutez cette ligne

    return (
        <div>
            <h1>voici la liste de vos utilisateurs</h1>
                <ul>
                    {users?.map((user) => (
                        <li key={user.id}>{user.email}</li>
                    ))}
                </ul>
        </div>
    );
}

export default Page;