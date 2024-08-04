import apiConfig from "@constants/apiConfig";
import LectureListPage from "./index";
import LectureSavePage from "./LectureSavePage";

export default {
    lectureListPage: {
        path: '/subject/lecture/:subjectId',
        title: 'Lecture List Page',
        auth: true,
        component: LectureListPage,
        permissions: [apiConfig.lecture.getList.baseURL, apiConfig.lecture.getBySubject.baseURL],
    },
    lectureSavePage: {
        path: '/subject/lecture/:subjectId/:id',
        title: 'Lecture Save Page',
        auth: true,
        component: LectureSavePage,
        permissions: [apiConfig.lecture.create.baseURL, apiConfig.lecture.update.baseURL, apiConfig.lecture.getById.baseURL],
    },
};
