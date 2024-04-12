import { useState } from 'react';
import Button from '../UI/Button';
import { loginUser } from '@/services/api/user.api';
import { useRouter } from 'next/navigation';

const LoginForm = ({ onTyping, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    mail: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    onTyping();
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
      console.log(req);
      // stock token in localstorage
      if (req.auth && req.token) {
        localStorage.setItem('token', req.token);
        onLoginSuccess(true, req.data);
      } else {
        onLoginSuccess(false, {});
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
      <Button 
      className='transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-black-500 font-medium text-center text-black-500 ${} bg-white'
      type="submit">Se Connecter</Button>
    </form>
  );

};

export default LoginForm;
