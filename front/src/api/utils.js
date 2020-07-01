import axios from "axios";
import jwt from "jwt-decode";

const ENDPOINT = process.env.VUE_APP_API_URL;
const AUTH_TOKEN_KEY = "authToken";
const ROLE = "role";
const USERID = "userId";

// LOGIN FUNCTION
export function loginUser(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/users/login`, //AUTH URL
        method: "POST", //AUTH METHOD
        data: {
          email: email, //USER
          password: password, //PASSWORD
        }, //AUTH DATA
      });
      setAuthToken(res.data.data.token);

      const { userId, role } = jwt(res.data.data.token);

      setUserId(userId);

      setRole(role);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

//SAVE TOKEN TO LOCALSTORAGE
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

//GET TOKEN
export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

//GET TOKEN EXPIRATION TIME
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

//CHEK IF TOKEN IS EXPIRED
export function isTokenExpired(token) {
  let expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}

//CHECK IF USER IS LOGGED
export function isLoggedIn() {
  let authToken = getAuthToken();

  return !!authToken && !isTokenExpired(authToken);
}

////// FUNCTIONS TO GET USER ROLE

//SAVE ROLE TO LOCAL STORAGE
export function setRole(role) {
  localStorage.setItem(ROLE, role);
}

//REMOVE ROLE FROM LOCAL STORAGE
export function clearRole() {
  return localStorage.removeItem(ROLE);
}

//GET ROLE FROM LOCAL STORAGE
export function getRole() {
  return localStorage.getItem(ROLE);
}

//CHECK ROLE
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

////// FUNCTIONS TO CHECK USER ID

//SAVE ID TO LOCAL STORAGE
export function setUserId(id) {
  localStorage.setItem(USERID, id);
}

//DELETE ID FROM LOCAL STORAGE
export function clearUserId() {
  return localStorage.removeItem(USERID);
}

//GET ID FROM LOCAL STORAGE
export function getUserId() {
  return localStorage.getItem(USERID);
}
