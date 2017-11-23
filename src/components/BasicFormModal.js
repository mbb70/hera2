import React, { PureComponent } from 'react';
import classNames from 'classnames';
import {
  ModalBody,
  ModalHeader,
  ModalFooter,
  Modal,
  Form,
  Button,
} from 'reactstrap';

class BasicFormModal extends PureComponent {
  state = {
    open: false,
  };

  toggleForm = () => {
    this.props.resetForm();
    this.setState({ open: !this.state.open });
  };

  handleFormSubmit = e => {
    this.toggleForm();
    this.props.onFormSubmit();
    e.preventDefault();
  };

  handleLoadForm = () => {
    this.toggleForm();
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  };

  render() {
    const entryPoint = React.cloneElement(this.props.entryPoint, {
      onClick: this.handleLoadForm,
    });
    let submitButton = this.props.submitText && (
      <Button
        color="primary"
        type="submit"
        disabled={this.props.invalid}
        onClick={this.handleFormSubmit}
      >
        {this.props.submitText}
      </Button>
    );
    if (this.props.submitButton) {
      submitButton = React.cloneElement(this.props.submitButton, {
        onClick: () => {
          this.props.submitButton.props.onClick();
          this.toggleForm();
        },
      });
    }
    return (
      <div>
        {entryPoint}
        <Modal
          {...this.props.additionalModalParams}
          autoFocus={false}
          isOpen={this.state.open}
          toggle={this.toggleForm}
          onExit={this.props.onExit}
        >
          <ModalHeader toggle={this.toggleForm}>
            {this.props.header}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleFormSubmit}>{this.props.children}</Form>
          </ModalBody>
          <ModalFooter>
            {this.props.leftButton && this.props.leftButton}
            <Button
              className={classNames({
                'hidden-xxs-down': this.props.leftButton,
              })}
              onClick={this.toggleForm}
            >
              {this.props.cancelText || 'Cancel'}
            </Button>
            {submitButton}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default BasicFormModal;
