import apiConfig from "@constants/apiConfig";
import SubjectListPage from "./subjectListPage";
import SubjectSavePage from "./SubjectSavePage";
import subjectForm from "./subjectForm";


export default {
    subjectListPage: {
        path: '/subjects',
        title: 'Subject List',
        auth: true,
        component: SubjectListPage,
        permissions: [apiConfig.subject.getList.baseURL],
    },
    subjectSavePage: {
        path: '/subjects/create',
        title: 'Create New Subject',
        auth: true,
        component: subjectForm,
        permissions: [apiConfig.subject.create.baseURL],
    },
    subjectEditPage: {
        path: '/subjects/update/:id',
        title: 'Edit Subject',
        auth: true,
        component: subjectForm,
        permissions: [apiConfig.subject.update.baseURL],
    },
};
