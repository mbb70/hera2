import React, { PureComponent } from 'react';
import classNames from 'classnames';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import Modal from 'reactstrap/lib/Modal';
import Form from 'reactstrap/lib/Form';
import Button from 'reactstrap/lib/Button';

class BasicFormModal extends PureComponent {
  state = {
    open: false,
  };

  closeForm = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
    this.setState({ open: false });
  };

  handleFormSubmit = e => {
    this.closeForm();
    this.props.onFormSubmit();
    e.preventDefault();
  };

  handleLoadForm = () => {
    this.props.resetForm();
    this.setState({ open: true });
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
          this.closeForm();
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
          toggle={this.closeForm}
        >
          <ModalHeader toggle={this.closeForm}>
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
              onClick={this.closeForm}
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
