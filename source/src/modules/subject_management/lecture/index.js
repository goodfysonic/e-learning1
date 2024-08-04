import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';

const message = defineMessages({
    objectName: 'Bài giảng',
});

const LectureListPage = () => {
    const translate = useTranslate();
    const { subjectId } = useParams();
    const navigate = useNavigate();

    const { data, mixinFuncs, pagination, queryFilter } = useListBase({
        apiConfig: {
            ...apiConfig.lecture,
            getList: {
                ...apiConfig.lecture.getBySubject,
                baseURL: apiConfig.lecture.getBySubject.baseURL.replace(':subjectId', subjectId),
            },
        },        
        options: {
            pageSize: 20,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => ({
                data: response.data.content,
                total: response.data.totalElements,
            });
        },
    });

    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên bài giảng" />,
            dataIndex: 'lectureName',
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'lectureName',
            placeholder: translate.formatMessage(commonMessage.lectureName),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusOptions,
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper
            title={translate.formatMessage(message.objectName)}
            routes={[
                { path: '/subject', breadcrumbName: 'Tên môn học' },
                { path: `/subject/lecture/${subjectId}`, breadcrumbName: 'Tên Bài Giảng ' },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default LectureListPage;
