import React from "react";

class DataBoxes extends React.Component {
	constructor(props) {
		super(props);
	}
	formatValue(value) {
		// TODO:
		return value;
	}
	render() {
		return (
			<div>
				<div className="col-sm-12 col-lg-12">
					<div className="brand-card">
						<div className="brand-card-header bg-vk text-white display-4">
							{this.props.title}
						</div>
						<div className="brand-card-body">
							<div>
								<div className="text-value">
									{this.formatValue(this.props.counter)}
								</div>
								<div className="text-uppercase text-muted small">
									{this.props.counterMessage}
								</div>
							</div>
							<div>
								<div className="text-value">
									${this.formatValue(this.props.value)}
								</div>
								<div className="text-uppercase text-muted small">
									{this.props.valueMessage}
								</div>
							</div>
							<div>
								<div className="text-value">
									{this.formatValue(this.props.opps)}
								</div>
								<div className="text-uppercase text-muted small">
									{this.props.oppsMessage}
								</div>
							</div>
							<div>
								<div className="text-value">
									${this.formatValue(this.props.average)}
								</div>
								<div className="text-uppercase text-muted small">
									{this.props.avgMessage}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default DataBoxes;
