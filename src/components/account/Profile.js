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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">monprofil.</h2>
        <ul className="list-disc list-inside bg-white rounded-lg p-4 shadow-md mb-4">
          {Object.entries(userInfo).map(([key, value]) => (
            <li key={key} className="border-b border-gray-200 py-2">
              <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
            </li>
          ))}
        </ul>
        <div className="flex space-x-4">
          <Button onClick={() => handleEdit()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Modifier
          </Button>
          <button onClick={() => logout()} className="hover:bg-rose-100 text-black font-bold py-2 px-4 border border-rose-600 focus:outline-none focus:shadow-outline">
            Déconnexion
          </button>
        </div>
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