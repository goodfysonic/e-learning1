import React from 'react';
import { useParams, generatePath } from 'react-router-dom';
import PageWrapper from '@components/common/layout/PageWrapper';
import TaskForm from './taskForm';
import useSaveBase from '@hooks/useSaveBase';
import apiConfig from '@constants/apiConfig';
import routes from './routes';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName: 'Task',
    task: 'Task',
});

const TaskSavePage = () => {
    const { taskId } = useParams();  // Đổi từ subjectId thành taskId
    const translate = useTranslate();

    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.task.getById,  // Đảm bảo apiConfig đã có endpoint này
            create: apiConfig.task.create,    // Đảm bảo apiConfig đã có endpoint này
            update: apiConfig.task.update,    // Đảm bảo apiConfig đã có endpoint này
        },
        options: {
            getListUrl: routes.taskListPage.path,  // Đảm bảo routes đã có taskListPage
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,  
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },        
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.task),
                    path: generatePath(routes.taskListPage.path, { taskId }) },  
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <TaskForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};

export default TaskSavePage;
