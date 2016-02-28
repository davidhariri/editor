const Textarea = React.createClass({
	getDefaultProps() {
		return {
			minHeight : 0,
			autofocus : false,
			key : Math.random().toString(36).substring(7),
			className: '',
			changeHandler : false,
			value : ''
		}
	},

	getInitialState() {
		return {
			height: 0
		}
	},

	componentDidMount() {
		// Listen for
		window.addEventListener('resize', this.resize);

		this.setState({
			height : this.props.minHeight
		});

		this.resize();
	},

	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
	},

	componentWillReceiveProps() {
		this.resize();
	},

	handleChange(event) {
		this.props.changeHandler(event.target.value);
	},

	resize() {
		const text = ReactDOM.findDOMNode(this).firstChild;

		this.setState({
			height : "auto"
		}, () => {
			this.setState({
				height : `${Math.max(text.scrollHeight, this.props.minHeight)}px`
			});
		});
	},

	delayedResize() {
		window.setTimeout(this.resize(), 0);
	},

	render() {
		const template = (
			<div
				className={`textarea ${this.props.className}`}
				style={{fontSize : this.props.fontSize}}
			>
				<textarea
					onChange={this.handleChange}
					onPaste={this.delayedResize}
					onCut={this.delayedResize}
					onDrop={this.delayedResize}
					style={{height:this.state.height}}
					value={this.props.value}
					placeholder={this.props.placeholder}
				/>
			</div>
		);

		return template;
	}
});
