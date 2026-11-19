import { createContext, useContext, useReducer } from "react";

const initialState = {
  user: null,
  isAuthenticated: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "user/login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "user/logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      return { ...state };
  }
};
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const login = (email, password) => {
    if (FAKE_USER.email === email && FAKE_USER.password === password) {
      dispatch({ type: "user/login", payload: FAKE_USER });
    }
  };
  const logout = () => {
    dispatch({ type: "user/logout" });
  };
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthContext was used outside AuthProvider");
  }
};

export { AuthProvider, useAuth };
