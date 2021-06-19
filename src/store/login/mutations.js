export function login (state, userData) {
  state.login.message = userData.message
  state.login.isLogged = userData.isLogged
}

export function user (state, userData) {
  state.user = userData
}

export function apps (state, userData) {
  state.apps = userData
}

export function colunas (state, userData) {
  state.colunas = userData
}

export function newUser (state, userData) {
  state.newUser = userData
}

export function redirect (state, userData) {
  state.redirect = userData
}
