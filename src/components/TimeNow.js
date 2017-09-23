import React, { PureComponent } from 'react';
class TimeNow extends PureComponent {
  state = {
    time: new Date(),
  }

  updateTime = (stop) => {
    this.setState({
      time: new Date(),
      timeout: setTimeout(this.updateTime, 1000),
    });
  }

  componentDidMount = () => {
    this.updateTime();
  }

  componentWillUnmount = () => {
    clearTimeout(this.state.timeout);
  }

  render() {
    if (this.props.yearOnly) {
      return <span>{this.state.time.getFullYear()}</span>;
    } else {
      return <span>{this.state.time.toString()}</span>;
    }
  }
}

export default TimeNow;
