export const REQUEST_USER = 'REQUEST_USER'
export const RECEIVE_USER = 'RECEIVE_USER'

export const requestUser = () => ({
  type: REQUEST_USER
})

export const receiveUser = (json) => ({
  type: RECEIVE_USER,
  user: json
})

export const actions = {
  requestUser,
  receiveUser
}

const ACTION_HANDLERS = {
  [REQUEST_USER]: (state, { payload }) => {
    return Object.assign({}, state, {
      isFetching: true
    })
  },
  [RECEIVE_USER]: (state, { user }) => {
    return Object.assign({}, state, {
      loggedIn: true,
      isFetching: false,
      id: user.id,
      handle: user.handle
    })
  }
}

export const fetchUser = () => {
  return (dispatch) => {
    dispatch(requestUser())
    return fetch('http://localhost:3000/api/user',
      {
        headers: { 'Authorization': localStorage.getItem('jwt') }
      })
      .then((response) => response.json())
      .then((json) => dispatch(receiveUser(json)))
  }
}

const initialState = {
  loggedIn: false,
  isFetching: false,
  id: null,
  handle: null
}

export default function authReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action): state
}
