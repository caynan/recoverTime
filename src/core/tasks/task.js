import { Record } from 'immutable';


export const Task = new Record({
  completed: false,
  key: null,
  title: null,
  duration: null,
  date: null,
  priority: null
});
