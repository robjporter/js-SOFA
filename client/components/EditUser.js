import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import SweetAlert from "react-bootstrap-sweetalert";
import { SECURITY_ENCRYPTION_KEY } from "../../common/constants";
import { sha256 } from "js-sha256";
import { TiEdit } from "react-icons/ti";
import { loadUser } from "../helpers/loaduser";
import { updateUser } from "../helpers/updateuser";

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      alert: null,
      id: this.props.pos,
      isUpdatingUser: false,
      show: false,
      accessLevels: "",
      changed: false,
      user: {
        id: "",
        username: "",
        password: "",
        firstname: "",
        lastname: "",
        admin: false,
        logo: "",
        role: "",
        access: "col"
      }
    };
    this._handleEdit = this._handleEdit.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._handleAlertClose = this._handleAlertClose.bind(this);
    this._handleAdmin = this._handleAdmin.bind(this);
    this._getAccessLevels = this._getAccessLevels.bind(this);
    this._handleFormSubmission = this._handleFormSubmission.bind(this);
    this._handleEditUsername = this._handleEditUsername.bind(this);
    this._handleEditFirstname = this._handleEditFirstname.bind(this);
    this._handleEditLastname = this._handleEditLastname.bind(this);
    this._handleEditPassword = this._handleEditPassword.bind(this);
    this._handleEditTechnology = this._handleEditTechnology.bind(this);
    this._handleTechnologyCheck = this._handleTechnologyCheck.bind(this);
    this._successPasswordChange = this._successPasswordChange.bind(this);
    this._failPasswordChange = this._failPasswordChange.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    this._getAccessLevels();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  _handleEditUsername(event) {
    let state = Object.assign({}, this.state);
    state.user.username = event.target.value;
    state.changed = true;
    this.setState(state);
  }
  _handleEditPassword(event) {
    let state = Object.assign({}, this.state);
    state.user.password = sha256.hmac(
      SECURITY_ENCRYPTION_KEY,
      event.target.value
    );
    state.changed = true;
    this.setState(state);
  }
  _handleEditFirstname(event) {
    let state = Object.assign({}, this.state);
    state.user.firstname = event.target.value;
    state.changed = true;
    this.setState(state);
  }
  _handleEditLastname(event) {
    let state = Object.assign({}, this.state);
    state.user.lastname = event.target.value;
    state.changed = true;
    this.setState(state);
  }
  _handleEditTechnology(event) {
    if (this._isMounted) {
      let state = Object.assign({}, this.state);
      state.user.access = event.target.id;
      state.changed = true;
      this.setState(state);
    }
  }
  _handleEdit(pos) {
    this.setState({ show: true, isUpdatingUser: false });
    this._getAccessLevels();
    loadUser(localStorage.getItem("sofatoken"), pos)
      .then(response => {
        let state = Object.assign({}, this.state);
        state.user.id = response.data.id;
        state.user.username = response.data.username;
        state.user.firstname = response.data.firstname;
        state.user.lastname = response.data.lastname;
        state.user.role = response.data.role;
        state.user.logo = response.data.logo;
        if (response.data.role === "admin") {
          state.user.admin = true;
          state.user.access = "";
        } else {
          state.user.admin = false;
          state.user.access = response.data.access[0];
        }
        this.setState(state);
        this._getAccessLevels();
      })
      .catch(err => {
        console.log(err);
      });
  }
  _handleAlertClose() {
    this.setState({
      alert: null
    });
  }
  _handleClose() {
    if (this._isMounted) {
      this.setState({
        show: false,
        isUpdatingUser: false,
        show: false,
        accessLevels: "",
        changed: false,
        user: {
          username: "",
          password: "",
          firstname: "",
          lastname: "",
          admin: false,
          logo: "",
          role: "",
          access: "col"
        }
      });
    }
  }
  _successPasswordChange(title, message, callBack, style) {
    this.setState({
      alert: (
        <SweetAlert
          success
          title={title}
          onCancel={this._handleAlertClose}
          onConfirm={callBack()}
        >
          {message}
        </SweetAlert>
      )
    });
  }
  _failPasswordChange(title, message, callBack, style) {
    this.setState({
      alert: (
        <SweetAlert
          danger
          title={title}
          onCancel={this._handleAlertClose}
          onConfirm={callBack()}
        >
          {message}
        </SweetAlert>
      )
    });
  }
  _handleTechnologyCheck(event) {
    let state = Object.assign({}, this.state);
    state.user.access = event.target.id;
    state.changed = true;
    this.setState(state);
    this._getAccessLevels();
  }
  _handleFormSubmission(event) {
    event.preventDefault();
    this.setState({ isUpdatingUser: true });
    if (this.state.changed) {
      updateUser(localStorage.getItem("sofatoken"), this.state.user)
        .then(response => {
          if (response.data.UpdateUser) {
            this.setState({ isUpdatingUser: false });
            this._successPasswordChange(
              "User Updated Successfully",
              "",
              () => this._handleAlertClose,
              null
            );
          } else {
            throw "User update failed.";
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({ isUpdatingUser: false });
          this._failPasswordChange(
            "User Update Failed",
            "",
            () => this._handleAlertClose,
            null
          );
        });
    }
    this._handleClose();
  }
  _handleAdmin(event) {
    let state = Object.assign({}, this.state);
    state.user.admin = event.target.checked;
    state.user.role = "admin";
    if (event.target.checked === false) {
      state.user.access = "col";
      state.user.role = "user";
    }
    state.changed = true;
    this.setState(state);
    this._getAccessLevels();
  }
  _getAccessLevels() {
    let accessLevels = "";
    if (this._isMounted) {
      if (this.state.user.admin) {
        let state = Object.assign({}, this.state);
        state.user.access = "*";
        this.setState(state);
      } else {
        accessLevels = (
          <Form.Group
            key="new_technology"
            onChange={this._handleTechnologyCheck}
          >
            <Form.Check
              inline
              checked={this.state.user.access === "col"}
              type="radio"
              id="col"
              name="new_technology"
              label="Collaboration"
            />
            <Form.Check
              inline
              checked={this.state.user.access === "dc"}
              type="radio"
              id="dc"
              name="new_technology"
              label="DataCenter"
            />
            <Form.Check
              inline
              checked={this.state.user.access === "en"}
              type="radio"
              id="en"
              name="new_technology"
              label="Enterprise Networks"
            />
            <Form.Check
              inline
              checked={this.state.user.access === "sec"}
              type="radio"
              id="sec"
              name="new_technology"
              label="Security"
            />
          </Form.Group>
        );
      }
    }
    this.setState({ accessLevels: accessLevels });
  }
  render() {
    return (
      <>
        <Button
          variant="warning"
          key={"e" + this.state.id}
          style={{ padding: "2px !important", minWidth: "20px" }}
          onClick={this._handleEdit.bind(this, this.state.id)}
        >
          <TiEdit size="25px" color="white" />
        </Button>
        {this.state.alert}
        <Modal
          show={this.state.show}
          size="md"
          onHide={this._handleClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <b>Change Password</b>
            </Modal.Title>
          </Modal.Header>
          <form onSubmit={this._handleFormSubmission}>
            <Modal.Body>
              <Form.Group as={Row} controlId="username">
                <Form.Label column sm="2">
                  Username
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    className="form-control"
                    name="new_username"
                    placeholder="Username"
                    onChange={this._handleEditUsername}
                    value={this.state.user.username}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="firstname">
                <Form.Label column sm="2">
                  firstname
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    className="form-control"
                    name="new_firstname"
                    placeholder="First Name"
                    onChange={this._handleEditFirstname}
                    value={this.state.user.firstname}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="lastname">
                <Form.Label column sm="2">
                  lastname
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    className="form-control"
                    name="new_lastname"
                    placeholder="lastname"
                    onChange={this._handleEditLastname}
                    value={this.state.user.lastname}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="password">
                <Form.Label column sm="2">
                  Password
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="password"
                    placeholder="password"
                    onChange={this._handleEditPassword}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                  />
                  <Form.Text className="text-muted">
                    1 x Capital - 1 x lower - 1 x digit - minimum 6 characters
                  </Form.Text>
                </Col>
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Admin User"
                  onChange={this._handleAdmin}
                  checked={this.state.user.admin}
                />
              </Form.Group>
              {this.state.accessLevels}
              {this.state.error}
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#f5f5f5" }}>
              <Button variant="secondary" onClick={this._handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={this.state.isUpdatingUser}
              >
                {this.state.isUpdatingUser ? "Saving Changes" : "Save Changes"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </>
    );
  }
}

export default EditUser;
