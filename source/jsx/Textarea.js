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
		
		if(this.props.caretChangeHandler) {
			this.props.caretChangeHandler(event.target);
		}
	},

	resize() {
		const mirror = ReactDOM.findDOMNode(this).firstChild;

		if(mirror.offsetHeight != this.state.height) {
			const newHeight = Math.max(mirror.offsetHeight, this.props.minHeight);
			this.setState({
				height : newHeight
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
					onClick={this.handleChange}
					style={{height:`${this.state.height}px`}}
					value={this.props.value}
					placeholder={this.props.placeholder}
				/>
			</div>
		);

		return template;
	}
});
