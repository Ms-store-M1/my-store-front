import { useState } from 'react';
import Button from '../UI/Button';

const SignupForm = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
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
      formData.wishlist = [];
      onSignupSuccess(true, formData);
    } else {
      onSignupSuccess(false, {});
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-2">Nom</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Nom" required className="p-2 border " />
      </div>
      <div className="flex flex-col">
        <label htmlFor="surname" className="mb-2">Prénom</label>
        <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} placeholder="Prénom" required className="p-2 border " />
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-2">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="p-2 border " />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="mb-2">Mot de passe</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" required className="p-2 border " />
      </div>
      <div className="flex flex-col">
        <label htmlFor="address" className="mb-2">Adresse</label>
        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" required className="p-2 border " />
      </div>
      <div className="flex flex-col">
        <label htmlFor="postalCode" className="mb-2">Code postal</label>
        <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Code postal" required className="p-2 border " />
      </div>
      <div className="flex flex-col">
        <label htmlFor="city" className="mb-2">Ville</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Ville" required className="p-2 border " />
      </div>
      <div className="flex flex-col">
        <label htmlFor="phone" className="mb-2">Téléphone</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" required className="p-2 border " />
      </div>
      <Button type="submit">S'inscrire</Button>
    </form>
  );

};

export default SignupForm;
