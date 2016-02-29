import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadDocument } from '../../redux/modules/documents'
import Document from 'components/Document'

function loadData (props) {
  const { documentId } = props
  props.loadDocument(documentId)
}

class DocumentView extends React.Component {
  static propTypes = {
    document: PropTypes.object,
    params: PropTypes.object.isRequired,
    isFetchingDocument: PropTypes.bool.isRequired
  }

  componentWillMount () {
    loadData(this.props)
  }

  render () {
    const { document, isFetchingDocument } = this.props
    const { documentId } = this.props.params

    if (isFetchingDocument) {
      return (
        <div className='container'>
          Fetching document {documentId}...
        </div>
      )
    }

    if (document) {
      return (
        <div className='container'>
          <Document key={document.id} doc={document} />
        </div>
      )
    }

    return (
      <div>
        there is no document :-(
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  const { documentId } = ownProps.params
  const { items, isFetchingDocument } = state.documents

  return {
    documentId,
    document: items.filter((doc) => doc.id === documentId)[0],
    isFetchingDocument
  }
}

export default connect(mapStateToProps, {
  loadDocument
})(DocumentView)
