import React, { Component } from 'react';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import TabA from './TabA';

class ErrorBoundary extends Component {
  state = {
    error: false,
    info: false,
  };

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      const trace = this.state.info.componentStack
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.match(/\.js/))
        .slice(0, 10);
      trace.push('...');
      return (
        <Container>
          <Col>
            <Row>
              <h3>Err, this is embarrasing... we crashed.</h3>
            </Row>
            <Row>
              Please consider filing an issue
              <TabA href="https://github.com/mbb70/hera2/issues">
                &nbsp;here&nbsp;
              </TabA>
              with the following information:
            </Row>
            <Row>{this.state.error.toString()}</Row>
            {trace.map(line => <Row key={line}>{line}</Row>)}
          </Col>
        </Container>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
