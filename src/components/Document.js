import React from 'react'
import { connect } from 'react-redux'
import bytes from 'bytes'

const maxImagePreviewFileSize = bytes('2MB')

class Document extends React.Component {

  render () {
    const { attributes } = this.props.doc
    const { fileSize, url, filename } = attributes

    const formattedFileSize = bytes(fileSize)

    return (
      <div className='clearfix'>
        <a href={url} className='btn btn-primary'>
          Download
        </a>
        <div>
          {filename} ({formattedFileSize})
        </div>
        {this.renderPreview()}
      </div>
    )
  }

  renderPreview = () => {
    const { filename, mimeType, url, fileSize } = this.props.doc.attributes

    switch (mimeType) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/svg+xml':

        if (fileSize > maxImagePreviewFileSize) {
          return (
            <div>
              no preview for images larger than {bytes(maxImagePreviewFileSize)}
            </div>
          )
        }
        return (
          <img src={url} title={filename} width='200' />
        )
      case 'video/quicktime':
        return (
          <video width='400' height='300' preload controls>
            <source src={url} />
          </video>
        )
      default:
        return (
          <div>
            (no preview for {mimeType})
          </div>
        )
    }
  }
}

Document.propTypes = {
  doc: React.PropTypes.object.isRequired
}

export default connect()(Document)
