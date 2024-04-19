import { useEffect, useState } from 'react';
import Button from '../UI/Button';
import useAuthStore from '@/stores/authStore';
import menu from "@/data/menu.json";
import { updateUser } from '@/services/api/user.api';

const Profile = ({ accountInfo, key}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
  });
  const [keysatustate, setKeysatustate] = useState(key);
  const [userInfoBackup, setUserInfoBackup] = useState({});
  const { isLogged } = useAuthStore();
  const logout = useAuthStore(state => state.logout);
  const translations = {
    lastname: 'Nom',
    firstname: 'Prénom',
    mail: 'Email',
    address: 'Adresse',
    zipcode: 'Code postal',
    city: 'Ville',
    phone: 'Téléphone'
  }

  useEffect(() => {
    if (accountInfo) {
      // delete password
      delete accountInfo.password;
      delete accountInfo.isadmin;
      setUserInfo(accountInfo);
    }
  }, [accountInfo, key])

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Envoyer les informations mises à jour au backend
    const req = await updateUser(userInfo);
    console.log(req);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUserInfo(userInfoBackup);
  }

  return (
    <div className="p-4">
      {!isEditing ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mon profil</h2>
          <ul className="list-none list-inside mb-4">
            {Object.entries(userInfo).filter(([key]) => key !== 'id' && key !== 'isadmin' && key !== 'password').map(([key, value]) => (
              <li key={key} className="border-b border-gray-200 py-2">
                <span className="font-semibold capitalize">{translations[key]} :</span> {value}
              </li>
            ))}


          </ul>
          <div className="flex space-x-4">
            <Button onClick={() => handleEdit()}
              className='transition ease-in-out delay-150 inline-flex items-center px-4 py-3 text-sm border border-black-500 font-medium text-center text-black-500 ${} bg-white'>
              Modifier
            </Button>
            <button onClick={() => 
             { logout()
              // enlever le admin du navmenu si pas admin
              menu.splice(2, 1)}
            }
              className='transition ease-in-out delay-150 inline-flex items-center px-4 py-3 text-sm border border-red-500 font-medium text-center text-black-500 ${} bg-white'>
              Déconnexion
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(userInfo).filter(key => key !== 'id' && key !== 'isadmin').map(key => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="mb-2 capitalize">{translations[key]}</label>
              <input
                type={key === 'password' ? 'password' : 'text'}
                id={key}
                name={key}
                value={userInfo[key]}
                onChange={handleChange}
                required={key !== 'password'} // Rendre tous les champs sauf password requis
                className="p-2 border"
              />
            </div>
          ))}
          <div className="flex space-x-4">
            <Button
              className='transition ease-in-out delay-150 inline-flex items-center px-4 py-3 text-sm border border-black-500 font-medium text-center text-black-500 ${} bg-white'
              type="submit">
              Sauvegarder</Button>
            <Button className="text-sm" onClick={() => handleCancel()}>Annuler</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
