// references:
// - https://github.com/reactjs/redux/blob/v3.3.1/examples/real-world/middleware/api.js

import { camelizeKeys, decamelizeKeys } from 'humps'
import 'isomorphic-fetch'

const API_ROOT = `${DRAWER_API_URL}/api/`

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

// TODO: move authentication into state.
const headers = () => {
  const jwtToken = localStorage.getItem('jwt')
  if (jwtToken) {
    return Object.assign({}, DEFAULT_HEADERS, {
      'Authorization': localStorage.getItem('jwt')
    })
  } else {
    return DEFAULT_HEADERS
  }
}

function callApi (endpoint, method = 'GET', data = null) {
  const fullUrl = API_ROOT + endpoint

  let options = {
    headers: headers(),
    method
  }
  if (data !== null) {
    options.body = JSON.stringify(decamelizeKeys(data))
  }

  return fetch(fullUrl, options)
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
export default (store) => (next) => (action) => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const { types, method, data } = callAPI

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

  return callApi(endpoint, method, data).then(
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
