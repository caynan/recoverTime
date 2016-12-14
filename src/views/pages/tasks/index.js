import { List } from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { getNotification, notificationActions } from 'src/core/notification';
import { getTaskFilter, getVisibleTasks, tasksActions } from 'src/core/tasks';
import Notification from '../../components/notification';
import TaskFilters from '../../components/task-filters';
import TaskForm from '../../components/task-form';
import TaskList from '../../components/task-list';
import {Chart} from 'react-google-charts';


export class Tasks extends Component {
  static propTypes = {
    createTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    dismissNotification: PropTypes.func.isRequired,
    filterTasks: PropTypes.func.isRequired,
    filterType: PropTypes.string.isRequired,
    loadTasks: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    tasks: PropTypes.instanceOf(List).isRequired,
    undeleteTask: PropTypes.func.isRequired,
    unloadTasks: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {page: "allTasks"};
    this.changeAllTasks = this.changeAllTasks.bind(this);
    this.changeCurrentWeek = this.changeCurrentWeek.bind(this);
    this.changeLast3Weeks = this.changeLast3Weeks.bind(this);


  }


  componentWillMount() {
    this.props.loadTasks();
    this.props.filterTasks(this.props.location.query.filter);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.query.filter !== this.props.location.query.filter) {
      this.props.filterTasks(nextProps.location.query.filter);
    }
  }

  componentWillUnmount() {
    this.props.unloadTasks();

  }

  renderNotification() {
    const { notification } = this.props;
    return (
      <Notification
        action={this.props.undeleteTask}
        actionLabel={notification.actionLabel}
        dismiss={this.props.dismissNotification}
        display={notification.display}
        message={notification.message}
      />
    );
  }

  changeAllTasks() {
    this.setState({page: "allTasks"});
    console.log(this.state.page);
  };

  changeCurrentWeek() {
    this.setState({page: "currentWeek"});
    console.log(this.state.page);
  };

  changeLast3Weeks() {
    this.setState({page: "last3Weeks"});
    console.log(this.state.page);
  };



  render() {

     let { tasks } = this.props;

     tasks.map(task => {
        console.log('WORKED!!');
        console.log(task.title);
     });

    const page = this.state.page;

    var currentWeekData = [['Tasks', 'Hour Per Day'],
                [ "Task1", 3.5],
                [ "Task2", 12],
                [ "Task3",  1],
                [ "Task4", 2]];

    var currentWeekOptions = {
          title: 'My Daily Activities',
          pieHole: 0.6
        };

    var last3WeeksData = [['Weeks', 'Two Weeks Ago', 'Last Week', 'Current Week'],
                          [ "Task1", 3.5, 0, 4],
                          [ "Task2", 5, 12, 7],
                          [ "Task3", 1, 5.5, 1],
                          [ "Task4", 10, 0, 2]]

    var last3WeeksOptions = {
          title: 'Last 3 Weeks'
        };

    let partial = null;
    if (page == "allTasks") {
      partial = <div className="g-row">
        <TaskForm createTask={this.props.createTask} />
        <div className="g-col">
          <TaskFilters filter={this.props.filterType} />
          <TaskList
            deleteTask={this.props.deleteTask}
            tasks={this.props.tasks}
            updateTask={this.props.updateTask}
          />
        </div>

        {this.props.notification.display ? this.renderNotification() : null}
      </div>;
    } else if (page == "currentWeek"){
      partial =
      <div className={"my-pretty-chart-container"}>
        <div>Total in hours: {} </div>
        <Chart
           chartType="PieChart"
           options = {currentWeekOptions}
           data={currentWeekData}
           graph_id="CurrenteWeekChart"
           width={"100%"}
           height={"400px"}
           legend_toggle={true}
        />
      </div>;

    } else if (page == "last3Weeks"){
      partial =
      <div className={"my-pretty-chart-container"}>
        <Chart
           chartType="ColumnChart"
           options = {last3WeeksOptions}
           data={last3WeeksData}
           graph_id="ScatterChart"
           width={"100%"}
           height={"400px"}
           legend_toggle={true}
        />
      </div>;
    }


    return (
      <div className="g-row">
        <ul className="task-filters">
          <li onClick = {this.changeAllTasks.bind(this)}>All Tasks</li>
          <li onClick = {this.changeCurrentWeek.bind(this)}>Current Week</li>
          <li onClick = {this.changeLast3Weeks.bind(this)}>Last 3 Weeks</li>
        </ul>
        {partial}
      </div>
    );
  }
}


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = createSelector(
  getNotification,
  getTaskFilter,
  getVisibleTasks,
  (notification, filterType, tasks) => ({
    notification,
    filterType,
    tasks
  })
);

const mapDispatchToProps = Object.assign(
  {},
  tasksActions,
  notificationActions
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tasks);
