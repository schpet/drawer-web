import fetch from 'isomorphic-fetch'

/* @flow */
// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_DOCUMENTS = 'REQUEST_DOCUMENTS'
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'
export const REQUEST_CREATE_DOCUMENT = 'REQUEST_CREATE_DOCUMENT'
export const CREATE_DOCUMENT_SUCCESS = 'CREATE_DOCUMENT_SUCCESS'

export const requestDocuments = () : Action => ({
  type: REQUEST_DOCUMENTS
})

export const receiveDocuments = (json) => ({
  type: RECEIVE_DOCUMENTS,
  documents: json,
  receivedAt: Date.now()
})

export const requestCreateDocument = (filename, s3Key, mimeType, fileSize) => ({
  type: REQUEST_CREATE_DOCUMENT,
  filename,
  s3Key,
  mimeType,
  fileSize
})

export const createDocumentSuccess = (json) => ({
  type: CREATE_DOCUMENT_SUCCESS,
  document: json
})

export const actions = {
  fetchDocuments,
  createDocument
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export const fetchDocuments = () => {
  return (dispatch) => {
    dispatch(requestDocuments())
    return fetch('http://localhost:3000/api/documents', {
      headers: { 'Authorization': localStorage.getItem('jwt') }
    })
    .then(checkStatus)
    .then((response) => response.json())
    .then((json) => dispatch(receiveDocuments(json.data)))
  }
}

// TODO use some sort of api middleware
export const createDocument = (filename, s3Key, mimeType, fileSize) => {
  return (dispatch) => {
    dispatch(requestCreateDocument(filename, s3Key, mimeType, fileSize))
    return fetch('http://localhost:3000/api/documents',
      {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('jwt'),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          document: {
            filename: filename,
            s3_key: s3Key,
            mime_type: mimeType,
            file_size: fileSize
          }
        })
      })
      .then(checkStatus)
      .then((response) => response.json())
      .then((json) => dispatch(createDocumentSuccess(json.data)))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_DOCUMENTS]: (state) => {
    return Object.assign({}, state, {
      isFetching: true
    })
  },
  [RECEIVE_DOCUMENTS]: (state, { documents }) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: documents
    })
  },
  [CREATE_DOCUMENT_SUCCESS]: (state, { document }) => {
    console.log("hi")
    return Object.assign({}, state, {
      isFetching: false,
      items: [
        document,
        ...state.items
      ]
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isFetching: false,
  items: []
}

export default function documentsReducer (state: Object = initialState, action: Action): number {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action): state
}
