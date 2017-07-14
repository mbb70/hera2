import React, { Component } from 'react';
import classNames from 'classnames';
import { ModalBody, ModalHeader, ModalFooter, Modal, Form, Button } from 'reactstrap';

class BasicFormModal extends Component {
  state = {
    open: false,
  }

  toggleForm = () => {
    this.props.resetForm();
    this.setState({ open: !this.state.open });
  }

  handleFormSubmit = (e) => {
    this.toggleForm();
    this.props.onFormSubmit();
    e.preventDefault();
  }

  render() {
    const entryPoint = React.cloneElement(this.props.entryPoint, {
      onClick: this.toggleForm,
    });
    return (
      <div>
        {entryPoint}
        {this.state.open && (
          <Modal autoFocus={false} isOpen={this.state.open} toggle={this.toggleForm}>
            <ModalHeader toggle={this.toggleForm}>
              {this.props.header}
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={this.handleFormSubmit}>
                {this.props.children}
              </Form>
            </ModalBody>
            <ModalFooter>
              {this.props.leftButton && (
                  this.props.leftButton
              )}
              <Button className={classNames({'hidden-xxs-down' : this.props.leftButton})} onClick={this.toggleForm}>{this.props.cancelText || 'Cancel'}</Button>
              {this.props.submitText && (
                <Button color="primary" type="submit" disabled={this.props.invalid} onClick={this.handleFormSubmit}>{this.props.submitText}</Button>
              )}
            </ModalFooter>
          </Modal>
        )}
      </div>
    );
  }
}

export default BasicFormModal;
