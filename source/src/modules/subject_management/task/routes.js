import apiConfig from "@constants/apiConfig";
import TaskListPage from '.';
import TaskSavePage from './taskSavePage';

export default {
    taskListPage: {
        path: '/course/task/:courseId',  
        title: 'Task List Page',
        auth: true,
        component: TaskListPage,
        permissions: [apiConfig.task.getList.baseURL],
    },
    taskSavePage: {
        path: '/course/task/:courseId/edit/:id', 
        title: 'Task Edit Page',
        auth: true,
        component: TaskSavePage,
        permissions: [apiConfig.task.create.baseURL, apiConfig.task.update.baseURL, apiConfig.task.getById.baseURL],
    },
};
