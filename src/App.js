import './App.css';
import { useState, useEffect } from 'react';
import { useFormAndValidation } from './useFormAndValidation';

function App() {
  const [message, setMessage] = useState('');
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation();

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  function emulateServerResponse() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => ({
            message: 'Successfully logged in',
          }),
        });
      }, 1000);
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    emulateServerResponse()
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Server error');
        }
      })
      .then((data) => {
        setMessage(data.message);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='authForm'>
      <h1 className='authForm__title'>Login</h1>
      <form onSubmit={handleSubmit} className='authForm__form' noValidate>
        <input
          className='authForm__input'
          placeholder='Email'
          id='email'
          name='email'
          type='email'
          value={values.email || ''}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={30}
        />

        <span className='authForm__input-error'>{errors.email}</span>

        <input
          className='authForm__input'
          placeholder='Password'
          id='password'
          name='password'
          type='password'
          value={values.password || ''}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={30}
        />

        <span className='authForm__input-error'>{errors.password}</span>

        <button
          type='submit'
          onSubmit={handleSubmit}
          className='authForm__button'
          disabled={!isValid}>
          Login
        </button>

        <p className='authForm__message'>{message}</p>
      </form>
    </div>
  );
}

export default App;
