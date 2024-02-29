import { useState } from 'react';
import Button from '../UI/Button';
import { createUser } from '@/services/api/user.api';

const SignupForm = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    mail: '',
    password: '',
    address: '',
    zipcode: '',
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
      const create = createUser(formData);
      console.log(create);
      // formData.wishlist = [];
      onSignupSuccess(true, formData);
    } else {
      onSignupSuccess(false, {});
    }
  };


  return (
    <form onSubmit={handleSubmit} className="">
      <div className="flex w-full my-5">
        <div className='w-1/2 mr-5'>
          <div className="flex flex-col">
            <label htmlFor="lastname" className="mb-2">Nom</label>
            <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Nom" required className="p-2 border " />
          </div>
          <div className="flex flex-col">
            <label htmlFor="firstname" className="mb-2">Prénom</label>
            <input type="text" id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} placeholder="Prénom" required className="p-2 border " />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2">Email</label>
            <input type="email" id="mail" name="mail" value={formData.mail} onChange={handleChange} placeholder="Email" required className="p-2 border " />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2">Mot de passe</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" required className="p-2 border " />
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex flex-col">
            <label htmlFor="address" className="mb-2">Adresse</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" required className="p-2 border " />
          </div>
          <div className="flex flex-col">
            <label htmlFor="zipcode" className="mb-2">Code postal</label>
            <input type="text" id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} placeholder="Code postal" required className="p-2 border " />
          </div>
          <div className="flex flex-col">
            <label htmlFor="city" className="mb-2">Ville</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Ville" required className="p-2 border " />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-2">Téléphone</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" required className="p-2 border " />
          </div>
        </div>
      </div>
      <Button type="submit">S&apos;inscrire</Button>
    </form>
  );

};

export default SignupForm;
