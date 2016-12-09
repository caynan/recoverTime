import React, { Component, PropTypes } from 'react';


class TaskForm extends Component {
  static propTypes = {
    createTask: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Initial state
    this.state = {title: '', duration: 0};

    // This has to be done FOR ALL methods, so we're binding them, google 'react method bing es6' to understand what is going on
    this.onChangeTitle = ::this.onChangeTitle;
    this.onChangeDuration = ::this.onChangeDuration;
    this.onKeyUp = ::this.onKeyUp;
    this.onSubmit = ::this.onSubmit;
  }

  // Whenever we need to clear the input
  clearInput() {
    this.setState({title: '', duration: 0});
  }

  // When we time anything on the title input, this method is triggered
  onChangeTitle(event) {
    this.setState({title: event.target.value});
  }

  // When we time anything on the duration input, this method is triggered
  onChangeDuration(event) {
    this.setState({duration: event.target.value});
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
    const title = this.state.title.trim();
    if (title.length) this.props.createTask(title);
    this.clearInput();
  }


  // TODO: We need to investigate what the `ref` attr is doing/used for.
  render() {
    return (
        <div>
        <form className="task-form"  noValidate>
          <input
            autoComplete="off"
            autoFocus
            className="task-form__input"
            maxLength="64"
            onChange={this.onChangeTitle}
            onKeyUp={this.onKeyUp}
            placeholder="What are you working on?"
            ref={c => this.titleInput = c}
            type="text"
            value={this.state.title}
          />
          <input
           autoComplete="off"
           autoFocus
           className="task-form__input"
           maxLength="64"
           onChange={this.onChangeDuration}
           onKeyUp={this.onKeyUp}
           placeholder="For How Long?"
           ref={c => this.titleInput = c}
           type="text"
           value={this.state.duration}
          />
        </form>
        <div className="text" color = "green" onClick={this.onSubmit}>Add Task</div>
      </div>
    );
  }
}

export default TaskForm;
