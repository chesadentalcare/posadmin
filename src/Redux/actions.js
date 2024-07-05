import history from "@/utils/history";


export const loginSuccess = (token) => ({
    type: 'LOGIN_SUCCESS',
    payload: { token },
  });
  history.push("/home");
  
  export const logout = () => ({
    type: 'LOGOUT',
  });
  