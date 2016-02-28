/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { increment, doubleAsync } from '../../redux/modules/counter'
import { fetchDocuments } from '../../redux/modules/documents'
import { fetchUser } from '../../redux/modules/user'
import DuckImage from './Duck.jpg'
import classes from './HomeView.scss'
import Document from 'components/Document'
import NewDocument from 'components/NewDocument'
import Uri from 'jsuri'

// todo: look at this more
// https://github.com/reactjs/react-router/blob/master/examples/auth-flow/app.js

// We avoid using the `@connect` decorator on the class definition so
// that we can export the undecorated component for testing.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
export class HomeView extends React.Component {
  static propTypes = {
    counter: PropTypes.number.isRequired,
    documents: PropTypes.object.isRequired,
    doubleAsync: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired,
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
    const { counter, documents } = this.props
    return (
      <div>
        <div className='container'>
          <NewDocument />
          <ul>
            {documents.items.map((doc) =>
              <Document key={doc.id} doc={doc} />
            )}
          </ul>
        </div>
        <hr></hr>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return ({
    counter: state.counter,
    documents: state.documents,
    user: state.user,
    dispatch: ownProps.dispatch
  })
}

export default connect((mapStateToProps), {
  increment: () => increment(1),
  doubleAsync,
  fetchDocuments,
  fetchUser
})(HomeView)
