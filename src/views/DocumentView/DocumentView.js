import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchDocument } from '../../redux/modules/documents'
import Document from 'components/Document'

function loadData (props) {
  const { documentId } = props
  props.fetchDocument(documentId)
}

class DocumentView extends React.Component {
  static propTypes = {
    document: PropTypes.object
  }

  componentWillMount () {
    loadData(this.props)
  }

  render () {
    // const { document } = this.props
    const { document } = this.props

    if (document) {
      return (
        <div className='container'>
          <Document key={document.id} doc={document} />
        </div>
      )
    }
    return (
      <div>
        loading document...
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  const { documentId } = ownProps.params
  const { items } = state.documents

  return {
    documentId,
    document: items.filter((doc) => doc.id === documentId)[0]
  }
}

export default connect(mapStateToProps, {
  fetchDocument
})(DocumentView)
