import fetch from 'isomorphic-fetch'
import { CALL_API } from 'middleware/api'

export const REQUEST_DOCUMENTS = 'REQUEST_DOCUMENTS'
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'
export const DOCUMENTS_FAILURE = 'DOCUMENTS_FAILURE'
export const REQUEST_DOCUMENT = 'REQUEST_DOCUMENT'
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT'
export const REQUEST_CREATE_DOCUMENT = 'REQUEST_CREATE_DOCUMENT'
export const CREATE_DOCUMENT_SUCCESS = 'CREATE_DOCUMENT_SUCCESS'

export const requestDocuments = () => ({
  type: REQUEST_DOCUMENTS
})

export const requestDocument = () => ({
  type: REQUEST_DOCUMENT
})

export const receiveDocuments = (json) => ({
  type: RECEIVE_DOCUMENTS,
  documents: json,
  receivedAt: Date.now()
})

export const receiveDocument = (json) => ({
  type: RECEIVE_DOCUMENT,
  document: json,
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

// TODO is this right? is this used?
export const actions = {
  loadDocuments,
  createDocument
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

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

export const fetchDocumentsOld = () => {
  return (dispatch) => {
    dispatch(requestDocuments())
    return fetch(`${DRAWER_API_URL}/api/documents`, authHeaders())
    .then(checkStatus)
    .then((response) => response.json())
    .then((json) => dispatch(receiveDocuments(json.data)))
  }
}

export const fetchDocuments = () => {
  return {
    [CALL_API]: {
      types: [ REQUEST_DOCUMENTS, RECEIVE_DOCUMENTS, DOCUMENTS_FAILURE ],
      endpoint: 'documents'
    }
  }
}

export const loadDocuments = () => {
  return (dispatch) => {
    dispatch(fetchDocuments())
  }
}

export const fetchDocument = (documentId) => {
  // TODO check if it's already loaded?
  return (dispatch) => {
    dispatch(requestDocument())
    return fetch(`${DRAWER_API_URL}/api/documents/${documentId}`, authHeaders())
    .then(checkStatus)
    .then((response) => response.json())
    .then((json) => dispatch(receiveDocument(json.data)))
  }
}

// TODO use some sort of api middleware
export const createDocument = (filename, s3Key, mimeType, fileSize) => {
  return (dispatch) => {
    dispatch(requestCreateDocument(filename, s3Key, mimeType, fileSize))
    return fetch(`${DRAWER_API_URL}/api/documents`,
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
            mimeType: mimeType,
            fileSize: fileSize
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
  [REQUEST_DOCUMENT]: (state) => {
    return Object.assign({}, state, {
      isFetchingDocument: true
    })
  },
  [RECEIVE_DOCUMENTS]: (state, { response }) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: response.data
    })
  },
  [DOCUMENTS_FAILURE]: (state) => {
    console.log(DOCUMENTS_FAILURE)
    return state
  },
  [RECEIVE_DOCUMENT]: (state, { document }) => {
    // TODO: make this replace the document if it
    //       already exists in items
    return Object.assign({}, state, {
      isFetchingDocument: false,
      items: [
        document,
        ...state.items
      ]
    })
  },
  [CREATE_DOCUMENT_SUCCESS]: (state, { document }) => {
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
  isFetchingDocument: false,
  items: []
}

export default function documentsReducer (state: Object = initialState, action: Action): number {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action): state
}
