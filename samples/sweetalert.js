import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

ReactDOM.render(
	<SweetAlert
		custom
		showCancel
		confirmBtnText="Yes"
		cancelBtnText="No"
		confirmBtnBsStyle="primary"
		cancelBtnBsStyle="default"
		customIcon="thumbs-up.jpg"
		title="Do you like thumbs?"
		onConfirm={this.hideAlert}
		onCancel={this.hideAlert}
	>
		You will find they are up!
	</SweetAlert>,
	document.getElementById("content")
);
