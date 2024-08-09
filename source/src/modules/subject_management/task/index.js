import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Tag } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { defineMessages, FormattedMessage } from 'react-intl';

import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { FieldTypes } from '@constants/formConfig';
import { taskState } from '@constants/masterData';
import apiConfig from '@constants/apiConfig';

const message = defineMessages({
    objectName: 'Task',
});

const TaskListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: apiConfig.task.getList,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });

    const columns = [
        { title: '#', dataIndex: 'id', width: 50, align: 'center' },
        { title: <FormattedMessage defaultMessage="Task" />, dataIndex: 'taskName' },
        { title: <FormattedMessage defaultMessage="Tên sinh viên" />, dataIndex: 'studentName' },
        { title: <FormattedMessage defaultMessage="Ngày bắt đầu" />, dataIndex: 'startDate' },
        { title: <FormattedMessage defaultMessage="Ngày kết thúc" />, dataIndex: 'endDate' },
        { title: <FormattedMessage defaultMessage="Ngày hoàn thành" />, dataIndex: 'completionDate' },
        {
            title: <FormattedMessage defaultMessage="Trạng thái" />,
            dataIndex: 'state',
            render: (state) => {
                const taskStatus = taskState.find(s => s.value === state);
                if (taskStatus) {
                    return <Tag color={taskStatus.color}>{translate.formatMessage({ defaultMessage: taskStatus.label })}</Tag>;
                }
                return <Tag>{state}</Tag>;
            },
        },
    ];

    const searchFields = [
        {
            key: 'studentName',
            placeholder: translate.formatMessage(commonMessage.name),
        },
        {
            key: 'startDate',
            placeholder: translate.formatMessage(commonMessage.startDate),
            type: FieldTypes.DATE,
        },
        {
            key: 'endDate',
            placeholder: translate.formatMessage(commonMessage.endDate),
            type: FieldTypes.DATE,
        },
    ];

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.task) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            >
            </ListPage>
        </PageWrapper>
    );
};

export default TaskListPage;
