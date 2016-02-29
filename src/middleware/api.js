import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'

const API_ROOT = `${DRAWER_API_URL}/api/`

const authHeaders = () => {
  const jwtToken = localStorage.getItem('jwt')
  if (jwtToken) {
    return {
      headers: { 'Authorization': localStorage.getItem('jwt') }
    }
  } else {
    return { headers: {} }
  }
}

function callApi (endpoint) {
  console.log("callApi")
  const fullUrl = API_ROOT + endpoint

  // TODO auth!
  return fetch(fullUrl, authHeaders())
    .then((response) =>
      response.json().then((json) => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }

      const camelizedJson = camelizeKeys(json)

      return camelizedJson

      // TODO use normalize, like redux realworld example
      // return Object.assign({},
      //   normalize(camelizedJson, schema),
      //   { nextPageUrl }
      // )
    })
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const { types } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every((type) => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith (data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint).then(
    (response) => next(actionWith({
      response,
      type: successType
    })),
    (error) => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
