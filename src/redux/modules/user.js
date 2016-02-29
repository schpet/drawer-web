import { CALL_API } from 'middleware/api'

// ------------------------------------
// Constants
// ------------------------------------

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

// ------------------------------------
// Actions
// ------------------------------------

const signIn = () => ({
  type: SIGN_IN
})

const signOut = () => ({
  type: SIGN_OUT
})

export const signInWithJWT = (jwt) => {
  return (dispatch) => {
    localStorage.setItem('jwt', jwt)
    dispatch(signIn())
  }
}

// is this needed? can i combine it with signOut?
export const signOutAndClearJWT = () => {
  return (dispatch) => {
    localStorage.removeItem('jwt')
    dispatch(signOut())
  }
}

const fetchUser = () => {
  return {
    [CALL_API]: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: 'user'
    }
  }
}

export const loadUser = () => {
  return (dispatch, getState) => {
    if (getState().user.id && getState().user.handle) {
      return null
    }
    dispatch(fetchUser())
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [USER_REQUEST]: (state) => {
    return Object.assign({}, state, {
      isFetching: true
    })
  },
  [USER_SUCCESS]: (state, { response }) => {
    return Object.assign({}, state, {
      isFetching: false,
      id: response.data.id,
      handle: response.data.attributes.handle
    })
  },
  [USER_FAILURE]: (state) => {
    return Object.assign({}, state, {
      isFetching: false
    })
  },
  [SIGN_IN]: (state) => {
    return Object.assign({}, state, {
      loggedIn: true
    })
  },
  [SIGN_OUT]: (state) => {
    return Object.assign({}, state, {
      loggedIn: false
    })
  }
}

const initialState = {
  loggedIn: !!localStorage.getItem('jwt'),
  isFetching: false,
  id: null,
  handle: null
}

// ------------------------------------
// Reducer
// ------------------------------------

export default function authReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action): state
}
