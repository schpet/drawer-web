import { CALL_API } from 'middleware/api'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

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
    if (getState().user.loggedIn) {
      return null
    }
    dispatch(fetchUser())
  }
}

const ACTION_HANDLERS = {
  [USER_REQUEST]: (state) => {
    return Object.assign({}, state, {
      isFetching: true
    })
  },
  [USER_SUCCESS]: (state, { response }) => {
    return Object.assign({}, state, {
      loggedIn: true,
      isFetching: false,
      id: response.data.id,
      handle: response.data.attributes.handle
    })
  },
  [USER_FAILURE]: (state) => {
    return Object.assign({}, state, {
      isFetching: false,
      loggedIn: false
    })
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
