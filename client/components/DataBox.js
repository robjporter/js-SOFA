import React from "react";

class DataBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        VALUE: {this.props.value}
        <br />
        MESSAGE: {this.props.message}
      </div>
    );
  }
}

export default DataBox;
