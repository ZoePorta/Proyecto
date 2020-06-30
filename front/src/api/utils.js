import axios from "axios";
import jwt from "jwt-decode";

const ENDPOINT = process.env.VUE_APP_API_URL;
const AUTH_TOKEN_KEY = "authToken";
const ROLE = "role";
const USERID = "userId";

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

      const { userId, role } = jwt(res.data.data.token);

      setUserId(userId);

      setRole(role);

      console.log(userId, role);
      resolve();
    } catch (error) {
      console.log(error.response);
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
  clearRole();
  clearUserId();
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

//GUARDAR ROL EN LOCAL STORAGE
export function setRole(role) {
  localStorage.setItem(ROLE, role);
}

//BORRAR ROL DEL USER EN LOCAL STORAGE
export function clearRole() {
  return localStorage.removeItem(ROLE);
}

//RECUPERAR ROL DESDE EL LOCAL STORAGE
export function getRole() {
  return localStorage.getItem(ROLE);
}

//COMPROBAR ROL
export function checkAdmin() {
  let role = getRole();
  let isAdmin = false;

  if (role === "admin") {
    isAdmin = true;
  } else {
    isAdmin = false;
  }

  return isAdmin;
}

//FUNCIONES PARA COMPROBAR EL ID DEL USER ===============

//GUARDAR ID EN LOCAL STORAGE
export function setUserId(id) {
  localStorage.setItem(USERID, id);
}

//BORRAR ID DEL USER EN LOCAL STORAGE
export function clearUserId() {
  return localStorage.removeItem(USERID);
}

//RECUPERAR ID DESDE EL LOCAL STORAGE
export function getUserId() {
  return localStorage.getItem(USERID);
}
