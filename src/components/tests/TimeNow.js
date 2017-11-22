import { PureComponent } from 'react';

class TimeNow extends PureComponent {
  state = {
    time: new Date(),
  };

  componentDidMount = () => {
    this.updateTime();
  };

  componentWillUnmount = () => {
    clearTimeout(this.state.timeout);
  };

  updateTime = () => {
    this.setState({
      time: new Date(),
      timeout: setTimeout(this.updateTime, 1000),
    });
  };

  render() {
    if (this.props.yearOnly) {
      return this.state.time.getFullYear().toString();
    }
    return this.state.time.toString();
  }
}

export default TimeNow;
