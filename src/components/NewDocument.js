import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import request from 'superagent'
import unorm from 'unorm'
import latinize from 'latinize'
import { createDocument } from 'redux/modules/documents'

class NewDocument extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
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
        this.setState({ progress: e.percent })
      })
      .end((err, res) => {
        if (err) {
          console.log(err.stack)
        }
        this.setState({ progress: null })

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
      fetch('http://localhost:3000/api/upload_keys',
        {
          method: 'POST',
          headers: { 'Authorization': localStorage.getItem('jwt') }
        })
        .then((response) => response.json())
        .then((json) => { this.uploadFile(json, file) })
    })
  }

  onOpenClick = () => {
    this.refs.dropzone.open()
  }

  render () {
    if (this.state.progress) {
      return (
        <div>
          {this.state.progress}
        </div>
      )
    }

    return (
      <div>
        <Dropzone ref='dropzone' onDrop={this.onDrop} />
        <button type='button' onClick={this.onOpenClick}>
          Open Dropzone
        </button>
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
