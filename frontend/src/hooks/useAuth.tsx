import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

export interface IUser {
  name?: string;
  email?: string;
  password?: string;
  token?: string;
}

export interface IAuthContext {
  user?: IUser | null;
  login: (user: IUser) => void;
  logout: () => void;
}

const apiBaseUrl = process.env.REACT_APP_API_URL;

const AuthContext = createContext<IAuthContext>({} as IAuthContext);
AuthContext.displayName = 'AuthContext';

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useLocalStorage<IUser | null>(
    'music-list:user',
    null
  );
  const navigate = useNavigate();

  const login = async (user: IUser) => {
    const { email, password } = user;
    axios
      .post(`${apiBaseUrl}/auth/signin`, {
        email,
        password,
      })
      .then((response) => {
        const { token } = response.data;
        const newUser = { email, token };
        setUser(newUser);
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logout = () => {
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
