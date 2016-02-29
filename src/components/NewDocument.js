import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import request from 'superagent'
import unorm from 'unorm'
import latinize from 'latinize'
import { createDocument } from 'redux/modules/documents'
import classes from './NewDocument.scss'

// TODO
// Consider doing all the uploads, thru redux

class NewDocument extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inProgress: false,
      progress: null
    }
  }

  buildFormData (fields, file) {
    let data = new FormData()
    for (var prop in fields) {
      if (fields.hasOwnProperty(prop)) {
        data.append(prop, fields[prop])
      }
    }
    data.append('file', file)
    return data
  }

  uploadFile = (keys, file) => {
    // copied from react s3 uploader
    const normalizedFileName = unorm.nfc(file.name.replace(/\s+/g, '_'))
    const fileName = latinize(normalizedFileName)

    let formData = this.buildFormData({
      ...keys.fields,
      'Content-Type': file.type,
      'Content-Disposition': `inline; filename=${fileName}`
    }, file)

    request
      .post(keys.url)
      .send(formData)
      .set('Accept', 'XML')
      .on('progress', (e) => {
        // TODO handle multiple uploads
        this.setState({ inProgress: true, progress: e.percent })
      })
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        this.setState({ inProgress: false, progress: null })

        this.setState

        let data = res.xhr.responseXML

        let key = data.getElementsByTagName('Key')[0]
                      .childNodes[0]
                      .nodeValue

        this.props.createDocument(fileName, key, file.type, file.size)
      })
  }

  onDrop = (files) => {
    files.forEach((file) => {
      fetch(`${DRAWER_API_URL}/api/upload_keys`,
        {
          method: 'POST',
          headers: { 'Authorization': localStorage.getItem('jwt') }
        })
        .then((response) => response.json())
        .then((json) => { this.uploadFile(json, file) })
    })
  }

  render () {
    const { progress, inProgress } = this.state

    return (
      <div className={classes['new-document-container']}>
        <Dropzone ref='dropzone'
          onDrop={this.onDrop}
          className={classes.dropzone}
          activeClassName={classes['dropzone-active']}>

          <p>
            Try dropping some files here, or click to select files to upload.
          </p>
          {inProgress && (
            <div className={classes['progress-container']}>
              <div className={classes['progress-icon']} style={{ left: `${progress}%` }}>
                🏇
              </div>
            </div>
          )}

        </Dropzone>
        <br />
      </div>
    )
  }
}

NewDocument.propTypes = {
  createDocument: PropTypes.func.isRequired
}

export default connect(null, {
  createDocument
})(NewDocument)
