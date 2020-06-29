import axios from "axios";
import jwt from "jwt-decode";

const ENDPOINT = process.env.VUE_APP_API_URL;
const AUTH_TOKEN_KEY = "authToken";
const ROLE = "admin";
const USERNAME = "userName";

// FUNCION DE LOGIN
export function loginUser(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/users/login`, //URL DE LA AUTENTICACIÓN
        method: "POST", //MÉTODO DE LA AUTENTICACIÓN
        data: {
          email: email, //USUARIO
          password: password, //CONTRASEÑA
        }, //DATOS DE LA AUTENTICACIÓN
      });
      setAuthToken(res.data.data.token);
      /* 
      setIsAdmin(res.data.isAdmin);

      setName(res.data.name);
*/
      console.log(jwt(res.data.data.token));
      resolve();
    } catch (error) {
      console.log(error.response.status, error.response.data.message);
      reject(error);
    }
  });
}

//GUARDAR TOKEN EN LOCALSTORAGE
export function setAuthToken(token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

//LOGOUT
export function clearLogin() {
  axios.defaults.headers.common["Authorization"] = "";
  localStorage.removeItem(AUTH_TOKEN_KEY);
  clearAdmin();
  clearName();
}

//COGER EL TOKEN
export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

//CONSIGUIENDO FECHA DE EXPIRACIÓN DEL TOKEN
export function getTokenExpirationDate(encodedToken) {
  let token = jwt(encodedToken);
  //si no hay, no sigue
  if (!token.exp) {
    return null;
  }

  let date = new Date(0);
  date.setUTCSeconds(token.exp);
  return date;
}

//COMPROBANDO SI LA FECHA SIGUE VIGENTE O NO
export function isTokenExpired(token) {
  let expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}

//COMPROBAR SI EL USUARIO ESTÁ LOGUEADO O NO
export function isLoggedIn() {
  let authToken = getAuthToken();

  return !!authToken && !isTokenExpired(authToken);
}

//FUNCIONES PARA COMPROBAR EL ROL DEL USER ===============

//GUARDAR SI ES ADMIN EN LOCAL STORAGE
export function setIsAdmin(isAdmin) {
  localStorage.setItem(ROLE, isAdmin);
}

//BORRAR ROL DEL USER EN LOCAL STORAGE
export function clearAdmin() {
  return localStorage.removeItem(ROLE);
}

//RECUPERAR ROL DESDE EL LOCAL STORAGE
export function getIsAdmin() {
  return localStorage.getItem(ROLE);
}

//COMPROBAR ROL
export function checkAdmin() {
  let role = false;
  let isAdmin = getIsAdmin();

  if (isAdmin === "true") {
    role = true;
  } else {
    role = false;
  }

  return role;
}

//FUNCIONES PARA COMPROBAR EL NOMBRE DEL USER ===============

//GUARDAR NOMBRE EN LOCAL STORAGE
export function setName(name) {
  localStorage.setItem(USERNAME, name);
}

//BORRAR NOMBRE DEL USER EN LOCAL STORAGE
export function clearName() {
  return localStorage.removeItem(USERNAME);
}

//RECUPERAR NOMBRE DESDE EL LOCAL STORAGE
export function getName() {
  return localStorage.getItem(USERNAME);
}
