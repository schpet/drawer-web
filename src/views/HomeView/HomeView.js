/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchDocuments } from '../../redux/modules/documents'
import { fetchUser } from '../../redux/modules/user'
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
    fetchDocuments: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.props.fetchDocuments()

    let jwt = new Uri(location.search).getQueryParamValue('jwt')
    if (jwt) {
      localStorage.setItem('jwt', jwt)
    }

    if (!this.props.user.loggedIn) {
      this.props.fetchUser()
    }
  }

  render () {
    const { documents } = this.props
    return (
      <div className='container'>
        <h3>Upload a new document:</h3>
        <NewDocument />
        <hr />
        <ul className='list-group'>
          {documents.items.map((doc) =>
            <li key={doc.id} className='list-group-item'>
              <Link to={`/document/${doc.id}`}>View in app</Link>
              <Document doc={doc} />
            </li>
          )}
        </ul>
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
  fetchDocuments,
  fetchUser
})(HomeView)
