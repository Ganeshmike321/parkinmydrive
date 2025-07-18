import AxiosClient from './AxiosClient';

export const loginUser = (email: string, password: string) => {
  return AxiosClient.post('/login', { email, password });
};

export const registerUser = (data: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  password_confirmation: string;
}) => {
  return AxiosClient.post('/register', data);
};