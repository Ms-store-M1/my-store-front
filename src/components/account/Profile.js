import { useEffect, useState } from 'react';
import Button from '../UI/Button';
import useAuthStore from '@/stores/authStore';

const Profile = ({accountInfo}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
  });
  const [userInfoBackup, setUserInfoBackup] = useState({});
  const { isLogged } = useAuthStore();
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    if (accountInfo) {
      setUserInfo(accountInfo);
    }
  }, [accountInfo])

  const handleEdit = () => {
    setIsEditing(true);
    setUserInfoBackup(userInfo);
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Envoyer les informations mises à jour au backend
    console.log(userInfo);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUserInfo(userInfoBackup);
  }

  return (
    <div className="p-4">
      {!isEditing ? (
        <>
          <h2>Mon Profil</h2>
          <ul>
            {Object.entries(userInfo).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>
          <Button onClick={() => handleEdit()}>Modifier</Button>
          <Button onClick={() => logout()}>Déconnexion</Button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(userInfo).map(key => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="mb-2 capitalize">{key}</label>
              <input
                type="text"
                id={key}
                name={key}
                value={userInfo[key]}
                onChange={handleChange}
                required
                className="p-2 border"
              />
            </div>
          ))}
          <Button type="submit">Sauvegarder</Button>
          <Button onClick={() => handleCancel()}>Annuler</Button>
        </form>
      )}
    </div>
  );
};

export default Profile;
