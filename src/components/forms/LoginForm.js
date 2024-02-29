import { useState } from 'react';
import Button from '../UI/Button';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
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
      // backend...
      onLoginSuccess(true, formData);
    } else {
      onLoginSuccess(false, {});
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-2">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="p-2 border " />
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
