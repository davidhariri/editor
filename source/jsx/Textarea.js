const Textarea = React.createClass({
	getDefaultProps() {
		return {
			minHeight : 0,
			autofocus : false,
			key : Math.random().toString(36).substring(7),
			className: '',
			changeHandler : false,
			value : '',
			content_id : ""
		}
	},

	getInitialState() {
		return {
			height: 0
		}
	},

	componentDidMount() {
		window.addEventListener('resize', this.resize);

		this.setState({
			height : this.props.minHeight
		});
	},

	componentDidUpdate() {
		this.resize();
	},

	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
	},

	handleChange(event) {
		this.props.changeHandler(event.target.value);
	},

	resize() {
		const mirror = ReactDOM.findDOMNode(this).firstChild;

		if(mirror.offsetHeight != this.state.height) {
			this.setState({
				height : Math.max(mirror.offsetHeight, this.props.minHeight)
			});
		}
	},

	render() {
		const template = (
			<div
				className={`textarea ${this.props.className}`}
				style={{fontSize : this.props.fontSize}}
			>
				<pre className="textarea__mirror"><span>{this.props.value}</span><br/></pre>
				<textarea
					onChange={this.handleChange}
					style={{height:`${this.state.height}px`}}
					value={this.props.value}
					placeholder={this.props.placeholder}
				/>
			</div>
		);

		return template;
	}
});
