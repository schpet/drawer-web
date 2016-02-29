/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadDocuments } from 'redux/modules/documents'
import { signInWithJWT } from 'redux/modules/user'
// import DuckImage from './Duck.jpg'
// import classes from './HomeView.scss'
import Document from 'components/Document'
import NewDocument from 'components/NewDocument'
import Uri from 'jsuri'
import { Link } from 'react-router'

// todo: look at this more
// https://github.com/reactjs/react-router/blob/master/examples/auth-flow/app.js

// We avoid using the `@connect` decorator on the class definition so
// that we can export the undecorated component for testing.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
export class HomeView extends React.Component {
  static propTypes = {
    documents: PropTypes.object.isRequired,
    loadDocuments: PropTypes.func.isRequired,
    signInWithJWT: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  componentDidMount () {
    // if the jwt param is present, sign in and strip
    // it from the url.
    let jwt = new Uri(location.search).getQueryParamValue('jwt')
    if (jwt) {
      this.props.signInWithJWT(jwt)
      history.replaceState({}, null, '/')
    }

    // seems like user.loggedIn isn't set immediately if
    // just signed in via jwt.
    if (jwt || this.props.user.loggedIn) {
      this.props.loadDocuments()
    }
  }

  loggedInRender = () => {
    const { documents } = this.props
    return (
      <div>
        <h3>Upload a new document:</h3>
        <NewDocument />
        <hr />
        <ul className='list-group'>
          {documents.items.map((doc) =>
            <li key={doc.id} className='list-group-item'>
              <Link to={`/document/${doc.id}`}>View</Link>
              <Document doc={doc} />
            </li>
          )}
        </ul>
      </div>
    )
  }

  render () {
    const { user } = this.props

    return (
      <div className='container'>
        {!user.loggedIn && (
          <div>A place to upload your files</div>
        )}

        {user.loggedIn && this.loggedInRender()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return ({
    documents: state.documents,
    user: state.user,
    dispatch: ownProps.dispatch
  })
}

export default connect((mapStateToProps), {
  loadDocuments,
  signInWithJWT
})(HomeView)
