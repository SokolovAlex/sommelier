import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import getContext from './context';
import Notifier from '../components/Notifier/Notifier';
import Header from '../components/Header/Header';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export default function withLayout(BaseComponent, { noHeader = false } = {}) {
  class App extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.pageContext = this.props.pageContext || getContext();
    }

    componentDidMount() {
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    pageContext = null;

    render() {
      return (
        <MuiThemeProvider
          theme={this.pageContext.theme}
          sheetsManager={this.pageContext.sheetsManager}
        >
          <CssBaseline />
          <div>
            {noHeader ? null : <Header {...this.props} />}
            <BaseComponent {...this.props} />
            <Notifier />
          </div>
        </MuiThemeProvider>
      );
    }
  }

  App.propTypes = {
    pageContext: PropTypes.object,
  };

  App.defaultProps = {
    pageContext: null,
  };

  App.getInitialProps = (ctx) => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx);
    }

    return {};
  };

  return App;
}