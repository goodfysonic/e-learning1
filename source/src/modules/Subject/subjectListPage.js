import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Table, Button, Tag, Space, Modal } from 'antd'; 
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import apiConfig from '@constants/apiConfig';

const SubjectListPage = () => {
    const navigate = useNavigate();
    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: apiConfig.subject, 
        options: {
            pageSize: 10, 
        },
    });

    const confirmDelete = (id) => {
        Modal.confirm({
            title: 'Bạn có muốn xóa môn học này không?',
            content: 'Hành động này không thể được hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                mixinFuncs.deleteItem(id);
            }
        });
    };

    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên môn học" />,
            dataIndex: 'subjectName',
            key: 'subjectName',
        },
        {
            title: <FormattedMessage defaultMessage="Mã môn học" />,
            dataIndex: 'subjectCode',
            key: 'subjectCode',
        },
        {
            title: <FormattedMessage defaultMessage="Mô tả" />,
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: <FormattedMessage defaultMessage="Hành động" />,
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => navigate(`/subjects/update/${record .id}`)}>Edit</Button>
                    <Button onClick={() => confirmDelete(record.id)} type="danger">Delete</Button>
                </Space>
            ),
        },
    ];

    const searchFields = [
        {
            key: 'subjectName',
            placeholder: 'Tìm kiếm theo tên môn học',
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={(
                    <Button icon={<PlusOutlined />} onClick={() => navigate('/subjects/create')}>
                        Thêm mới
                    </Button>
                )}
                baseTable={
                    <BaseTable
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                        onChange={mixinFuncs.changePagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default SubjectListPage;
