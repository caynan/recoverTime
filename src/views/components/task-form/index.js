import React, { Component, PropTypes } from 'react';



class TaskForm extends Component {
  static propTypes = {
    createTask: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Initial state
    this.state = {title: '', duration: ''};

    // This has to be done FOR ALL methods, so we're binding them, google 'react method bing es6' to understand what is going on
    this.onChangeTitle = ::this.onChangeTitle;
    this.onChangeDuration = ::this.onChangeDuration;
    this.onKeyUp = ::this.onKeyUp;
    this.onSubmit = ::this.onSubmit;
  }

  // Whenever we need to clear the input
  clearInput() {
    this.setState({title: '', duration: ''});
  }

  // When we time anything on the title input, this method is triggered
  onChangeTitle(event) {
    event.preventDefault();
    const title = this.refs.title.value;
    this.setState({title: title});
  }

  // When we time anything on the duration input, this method is triggered
  onChangeDuration(event) {
    event.preventDefault();
    const duration = this.refs.duration.value;
    this.setState({duration: event.duration});
  }

  // As far as I know, this is only used by the tests
  onKeyUp(event) {
    if (event.keyCode === 27) {
      this.clearInput();
    }
  }

  // TODO: It's called when we submit the form, note that now it's only handling the title, you have to modify
  onSubmit(event) {
    event.preventDefault();
    const title = this.refs.title.value;
    const duration = this.refs.duration.value;

    if (title.length) this.props.createTask(title, duration);
    this.clearInput();
  }


  // TODO: We need to investigate what the `ref` attr is doing/used for.
  render() {
    return (

      <div>
        <form  className="task-form" noValidate>
          <div className="cell">

            <input
            autoComplete="on"
            autoFocus
            className="task-form__input"
            maxLength="64"
            onChange={this.onChangeTitle}
            onKeyUp={this.onKeyUp}
            placeholder="What are you working on?"
            ref="title"
            type="text"
            value={this.state.title}
          />
          </div>
          <div className="cell">
              <div className="cell">
                <input
                 autoComplete="on"
                 autoFocus
                 className="task-form__input"
                 maxLength="64"
                 onChange={this.onChangeDuration}
                 onKeyUp={this.onKeyUp}
                 placeholder="For How Long?"
                 ref="duration"
                 type="text"
                 value={this.state.duration}
                />
              </div>
              <div className="cell">
                <button
                  className="btn task-item__button"
                  onClick={this.onSubmit}
                  type="button">
                  <svg className="icon" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg>
            
                </button>
              </div>
          </div>
        </form>
      </div>
    );
  }
}

export default TaskForm;
