import React, { useEffect } from 'react';
import { useParams, generatePath } from 'react-router-dom';
import PageWrapper from '@components/common/layout/PageWrapper';
import LectureForm from './LectureForm';
import useSaveBase from '@hooks/useSaveBase';
import apiConfig from '@constants/apiConfig';
import routes from './routes';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName: 'Bài giảng',
    lecture: 'Bài giảng',
});

const LectureSavePage = () => {
    const { subjectId, id } = useParams(); // Get both subjectId and id from URL params
    const translate = useTranslate();

    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.lecture.getById,
            create: apiConfig.lecture.create,
            update: apiConfig.lecture.update,
        },
        options: {
            getListUrl: generatePath(routes.lectureListPage.path, { subjectId }),
            objectName: translate.formatMessage(messages.objectName),
            // initData: id ? { id: id } : {},
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => ({
                ...data,
                id: id,
                subjectId: subjectId,
            });
            funcs.prepareCreateData = (data) => ({
                ...data,
                subjectId: subjectId,
            });
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(messages.lecture),
                    path: generatePath(routes.lectureSavePage.path, { subjectId, id }), // Ensure subjectId is passed correctly
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <LectureForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail || {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};

export default LectureSavePage;
