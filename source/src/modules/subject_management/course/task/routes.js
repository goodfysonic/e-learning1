import apiConfig from "@constants/apiConfig";
import TaskListPage from ".";
import TaskSavePage from "./taskSavePage";


export default {
    taskListPage: {
        path: '/course/task',
        title: 'Task',
        auth: true,
        component: TaskListPage,
        permissions: [apiConfig.task.getList.baseURL],
    },
    taskSavePage: {
        path: '/course/task/:id',
        title: 'Task Save Page',
        auth: true,
        component: TaskSavePage,
        permissions: [apiConfig.task.create.baseURL, apiConfig.task.update.baseURL],
        breadcrumbs: (message, paramHead, taskParam, location, title) => {
            return [
                { breadcrumbName: message.course.defaultMessage, path: paramHead },
                { breadcrumbName: message.task.defaultMessage, path: taskParam + location },
                { breadcrumbName: title ? title : message.objectName.defaultMessage },
            ];
        },
    },
};
