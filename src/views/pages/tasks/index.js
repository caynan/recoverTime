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
  };

  changeCurrentWeek() {
    this.setState({page: "currentWeek"});
  };

  changeLast3Weeks() {
    this.setState({page: "last3Weeks"});
  };

  getWeekNum(timestamp) {
      // Copy date so don't modify original
      let d = new Date(timestamp);
      d.setHours(0,0,0,0);
      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setDate(d.getDate() + 4 - (d.getDay()||7));
      // Get first day of year
      var yearStart = new Date(d.getFullYear(),0,1);
      // Calculate full weeks to nearest Thursday
      var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
      // Return array of year and week number
      return {'currentYear': d.getFullYear(), 'weekNumber': weekNo};
  };

  currentWeekTasks(tasks) {
      let currentWeek = this.getWeekNum(new Date().getTime());
      let filteredTasks = tasks.filter(task => {
      let taskWeekNumber = this.getWeekNum(task.date);
      return (
         taskWeekNumber.currentYear === currentWeek.currentYear &&
         taskWeekNumber.weekNumber === currentWeek.weekNumber
      );
   });

   return filteredTasks;
  };

  formatCurrentWeekData(tasks) {
     let currentWeekData = [['Tasks', 'Hour Per Day']]
     tasks.map(task => {
       currentWeekData.push([task.title, +task.duration]);
     })

     return currentWeekData;
  }

    formatCurrentWeekDataPriority(tasks) {
     let myPriority = [['Priority', 'Hour Per Day'], ["Low", 0], ["Medium", 0], ["High", 0]]
     let currentWeekData = []
     tasks.map(task => {
       currentWeekData.push([task.priority, +task.duration]);
     })
     for(var i = 0; i < currentWeekData.length; i++){
      if(currentWeekData[i][0]==="0"){
        myPriority[1][1] += currentWeekData[i][1]
      }
      else if(currentWeekData[i][0]==="1"){
        myPriority[2][1] += currentWeekData[i][1]
      }
      else if(currentWeekData[i][0]==="2"){
        myPriority[3][1] += currentWeekData[i][1]
      }
    }
     return myPriority;
  }


  formatLastWeeksData(tasks) {
    var myTasks = []
    var myValues = []

    let currentWeek = this.getWeekNum(new Date().getTime()).weekNumber;

     let currentWeekData = []
     tasks.map(task => {
       currentWeekData.push([task.title, +task.duration, this.getWeekNum(task.date).weekNumber]);
     })
     for(var i = 0; i < currentWeekData.length; i++){
      
      if(currentWeekData[i][2] <= currentWeek || currentWeekData[i][2] >= (currentWeek - 2)){

        if(!myTasks.includes(currentWeekData[i][0])){
          myTasks.push(currentWeekData[i][0])
          myValues.push([0,0,0])
        }
        var index = myTasks.indexOf(currentWeekData[i][0])
        if(currentWeekData[i][2] == (currentWeek - 2)){
          myValues[index][0] += currentWeekData[i][1]
        }
        else if(currentWeekData[i][2] == (currentWeek - 1)){
          myValues[index][1] += currentWeekData[i][1]
        }
        else{
          myValues[index][2] += currentWeekData[i][1]
        }
      }
    }

    var myWeek = [['Weeks', 'Two Weeks Ago', 'Last Week', 'Current Week']]
    for(var i = 0; i < myTasks.length; i++){
      var temp = [myTasks[i]]
      temp.push(myValues[i][0])
      temp.push(myValues[i][1])
      temp.push(myValues[i][2])
      myWeek.push(temp)
    }
    return myWeek
  }
    
  formatLastWeeksDataPriority(tasks) {

    var myPriority = [["Low", 0, 0, 0], ["Medium", 0, 0, 0], ["High", 0, 0, 0]]

    let currentWeek = this.getWeekNum(new Date().getTime()).weekNumber;

     let currentWeekData = []
     tasks.map(task => {
       currentWeekData.push([task.priority, +task.duration, this.getWeekNum(task.date).weekNumber]);
     })
     for(var i = 0; i < currentWeekData.length; i++){
      
      if(currentWeekData[i][2] <= currentWeek || currentWeekData[i][2] >= (currentWeek - 2)){


        var index = parseInt(currentWeekData[i][0])
        if(currentWeekData[i][2] == (currentWeek - 2)){
          myPriority[index][1] += currentWeekData[i][1]
        }
        else if(currentWeekData[i][2] == (currentWeek - 1)){
          myPriority[index][2] += currentWeekData[i][1]
        }
        else{
          myPriority[index][3] += currentWeekData[i][1]
        }
      }
    }

    var myWeekP = [['Weeks', 'Two Weeks Ago', 'Last Week', 'Current Week'], myPriority[0], myPriority[1], myPriority[2]]

  
    return myWeekP
}


  getCurrentWeekHours(tasks){
    var sum = 0;
    var myTasks = this.formatCurrentWeekData(this.currentWeekTasks(tasks));
    for(var i = 1; i < myTasks.length; i++){
      sum += myTasks[i][1];
    }
    return sum;
  }

  render() {
    const page = this.state.page;

   //  var currentWeekData = [['Tasks', 'Hour Per Day'],
   //              [ "Task1", 3.5],
   //              [ "Task2", 12],
   //              [ "Task3",  1],
   //              [ "Task4", 2]];


    let { tasks } = this.props;

    let thisWeekTasks = this.currentWeekTasks(tasks);
    var currentWeekData = this.formatCurrentWeekData(thisWeekTasks);
    var currentWeekOptions = {
          title: 'My Daily Activities by Task',
          pieHole: 0.6
        };
    var currentWeekOptionsP = {
      title: 'My Daily Activities by Priority',
      pieHole: 0.6
    };

    var last3WeeksData = [['Weeks', 'Two Weeks Ago', 'Last Week', 'Current Week'],
                          [ "Task1", 3.5, 0, 4],
                          [ "Task2", 5, 12, 7],
                          [ "Task3", 1, 5.5, 1],
                          [ "Task4", 10, 0, 2]]

    var last3WeeksOptions = {
          title: 'Last 3 Weeks by Task'
        };

    var last3WeeksOptionsP = {
          title: 'Last 3 Weeks by Priority'
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
        <div>Total in hours: {this.getCurrentWeekHours(tasks)} hour(s) </div>
        <Chart
           chartType="PieChart"
           options = {currentWeekOptions}
           data={currentWeekData}
           graph_id="CurrenteWeekChart"
           width={"100%"}
           height={"400px"}
           legend_toggle={true}
        />
        <Chart
           chartType="PieChart"
           options = {currentWeekOptionsP}
           data={this.formatCurrentWeekDataPriority(tasks)}
           graph_id="CurrenteWeekChartP"
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
           data={this.formatLastWeeksData(tasks)}
           graph_id="Last3WeeksChart"
           width={"100%"}
           height={"400px"}
           legend_toggle={true}
        />
        <Chart
           chartType="ColumnChart"
           options = {last3WeeksOptionsP}
           data={this.formatLastWeeksDataPriority(tasks)}
           graph_id="Last3WeeksChartP"
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
