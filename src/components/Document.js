import React from 'react'
import { connect } from 'react-redux'

class Document extends React.Component {
  render () {
    const { id } = this.props.doc
    const { filename, mime_type, file_size, url } = this.props.doc.attributes


    switch(mime_type) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/svg+xml':
        return (
          <div>
            <a href={url}>
              <img src={url} title={filename} width="200" />
            </a>
          </div>
        )
      case 'video/quicktime':
        return (
          <div>
            <div>
              <a href={url}>{filename}</a>
            </div>
            <video width='400' height='300' preload controls>
              <source src={url} />
            </video>
          </div>
        )
      default:
        return (
          <div>
            <a href={url}>{filename}</a>
            ({mime_type})
          </div>
        )
    }
  }
}

Document.propTypes = {
  doc: React.PropTypes.object.isRequired
}

export default connect()(Document)
