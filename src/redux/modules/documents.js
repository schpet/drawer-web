import { CALL_API } from 'middleware/api'

export const DOCUMENTS_REQUEST = 'DOCUMENTS_REQUEST'
export const DOCUMENTS_SUCCESS = 'DOCUMENTS_SUCCESS'
export const DOCUMENTS_FAILURE = 'DOCUMENTS_FAILURE'

export const DOCUMENT_REQUEST = 'DOCUMENT_REQUEST'
export const DOCUMENT_SUCCESS = 'DOCUMENT_SUCCESS'
export const DOCUMENT_FAILURE = 'DOCUMENT_FAILURE'

export const CREATE_DOCUMENT_REQUEST = 'CREATE_DOCUMENT_REQUEST'
export const CREATE_DOCUMENT_SUCCESS = 'CREATE_DOCUMENT_SUCCESS'
export const CREATE_DOCUMENT_FAILURE = 'CREATE_DOCUMENT_FAILURE'

// unused:
// export const actions = {
//   loadDocuments,
//   createDocument
// }

const fetchDocuments = () => {
  return {
    [CALL_API]: {
      types: [ DOCUMENTS_REQUEST, DOCUMENTS_SUCCESS, DOCUMENTS_FAILURE ],
      endpoint: 'documents'
    }
  }
}

const fetchDocument = (documentId) => {
  return {
    [CALL_API]: {
      types: [ DOCUMENT_REQUEST, DOCUMENT_SUCCESS, DOCUMENT_FAILURE ],
      endpoint: `documents/${documentId}`
    }
  }
}

export const loadDocuments = () => {
  return (dispatch) => {
    // TODO maybe don't always get all the documents?
    dispatch(fetchDocuments())
  }
}

export const loadDocument = (documentId) => {
  return (dispatch, getState) => {
    // bail out early if we have the document
    let docs = getState().documents.items
    if (docs.filter((doc) => doc.id === documentId).length) {
      return null
    }

    dispatch(fetchDocument(documentId))
  }
}

const postDocument = (filename, s3Key, mimeType, fileSize) => {
  return {
    [CALL_API]: {
      types: [ CREATE_DOCUMENT_REQUEST, CREATE_DOCUMENT_SUCCESS,
               CREATE_DOCUMENT_FAILURE ],
      endpoint: 'documents',
      method: 'POST',
      data: {
        document: {
          filename,
          s3Key,
          mimeType,
          fileSize
        }
      }
    }
  }
}

export const createDocument = (filename, s3Key, mimeType, fileSize) => {
  return (dispatch) => {
    dispatch(postDocument(filename, s3Key, mimeType, fileSize))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [DOCUMENTS_REQUEST]: (state) => {
    return Object.assign({}, state, {
      isFetching: true
    })
  },
  [DOCUMENTS_SUCCESS]: (state, { response }) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: response.data
    })
  },
  [DOCUMENTS_FAILURE]: (state) => {
    console.log(DOCUMENTS_FAILURE)
    return Object.assign({}, state, {
      isFetching: false
    })
  },
  [DOCUMENT_REQUEST]: (state) => {
    return Object.assign({}, state, {
      isFetchingDocument: true
    })
  },
  [DOCUMENT_SUCCESS]: (state, { response }) => {
    console.log(response.data)
    return Object.assign({}, state, {
      isFetchingDocument: false,
      items: [
        response.data,
        ...state.items
      ]
    })
  },
  [DOCUMENT_FAILURE]: (state) => {
    console.log(DOCUMENT_FAILURE)
    return Object.assign({}, state, {
      isFetchingDocument: false
    })
  },
  [CREATE_DOCUMENT_SUCCESS]: (state, { response }) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: [
        response.data,
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
