import fetch from 'isomorphic-fetch'

export const REQUEST_DOCUMENTS = 'REQUEST_DOCUMENTS'
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'
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
  fetchDocuments,
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

export const fetchDocuments = () => {
  return (dispatch) => {
    dispatch(requestDocuments())
    return fetch(`${DRAWER_API_URL}/api/documents`, authHeaders())
    .then(checkStatus)
    .then((response) => response.json())
    .then((json) => dispatch(receiveDocuments(json.data)))
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
  [REQUEST_DOCUMENT]: (state) => {
    return Object.assign({}, state, {
      isFetchingDocument: true
    })
  },
  [RECEIVE_DOCUMENTS]: (state, { documents }) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: documents
    })
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
