import { loginSuccess, logout } from '../reducers/authReducer';

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await fetch('https://api.chesadentalcare.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.status === 'success') {
      if (data.user === 'manoj') {
        const currentTime = Math.floor(Date.now() / 1000);
        const sessionExpiry = currentTime + 60 * 60;

        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('sessionExpiry', sessionExpiry);

        dispatch(loginSuccess(data.token));
      } else {
        throw new Error('Only "production" user can login.');
      }
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('login error:', error);
    throw new Error('Only "production" user can login.');
  }
};

export const logoutUser = () => (dispatch) => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('sessionExpiry');
  dispatch(logout());
};
