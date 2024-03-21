import { useState } from 'react';
import Button from '../UI/Button';
import { loginUser } from '@/services/api/user.api';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    mail: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = Object.values(formData).every(value => value.trim() !== '');

    if (isFormValid) {
      console.log(formData);
      const req = await loginUser(formData);
      // check promise result
      if(req.message !== "User not found"){
        // stock token in localstorage
        console.log('ojkoejzomreguhiekblhei', req)
        localStorage.setItem('token', req.token);
        onLoginSuccess(true, req.user);
      }else{
        onLoginSuccess(false, {message : 'User not found'});

      }
    } else {
      onLoginSuccess(false, {});
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-2">Email</label>
        <input type="email" id="mail" name="mail" value={formData.mail} onChange={handleChange} placeholder="Email" required className="p-2 border " />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="mb-2">Mot de passe</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" required className="p-2 border " />
      </div>
      <Button type="submit">Se Connecter</Button>
    </form>
  );

};

export default LoginForm;
