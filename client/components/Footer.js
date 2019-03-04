import React, { Component } from "react";
import { Versions } from "../helpers/versions";
import { withRouter } from "react-router";

class Footer extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {};
    this.handleVersions = this.handleVersions.bind(this);
    this.setTitle = this.setTitle.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    this.handleVersions();
    this.setTitle();
  }

  setTitle() {
    if (this.props.location.pathname.indexOf("sofa") > -1) {
      this.setState({
        foottitle: (
          <div>
            S alesForce
            <br />
            O pportunity
            <br />
            F iltering for
            <br />A rchitectures
          </div>
        )
      });
    } else {
      this.setState({ foottitle: "" });
    }
  }
  handleVersions() {
    if (this._isMounted) {
      Versions()
        .then(response => {
          console.log(response);
          this.setState({
            appVersion: response.data.appVersion,
            backendVersion: response.data.backendVersion,
            frontendVersion: response.data.frontendVersion
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  render() {
    // TODO: display of data
    return (
      <div style={{ height: "100px", backgroundColor: "#1b65f6" }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col mt-1" style={{ color: "#DCDCDC" }}>
              {this.state.foottitle}
            </div>
            <div
              className="col text-center"
              style={{ color: "#C0C0C0", marginTop: "40px" }}
            >
              copyright
            </div>
            <div
              className="col mt-4 text-right"
              style={{ color: "#DCDCDC", fontSize: "0.75rem" }}
            >
              {this.state.appVersion}: <b>App Version</b>
              <br />
              {this.state.backendVersion}: <b>API Version</b>
              <br />
              {this.state.frontendVersion}: <b>Interface Version</b>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Footer);
