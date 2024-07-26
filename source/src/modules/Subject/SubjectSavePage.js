import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubject, createSubject, updateSubject } from './subjectService';
import { Form, Input, Button, Breadcrumb, message } from 'antd';
const { TextArea } = Input;

const SubjectSavePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditing = id !== undefined;

    useEffect(() => {
        if (isEditing) {
            getSubject(id).then(data => {
                form.setFieldsValue(data);
            }).catch(err => {
                console.error('Error fetching subject', err);
                message.error('Lỗi khi tải thông tin môn học');
            });
        }
    }, [id, form]);

    const handleSubmit = async (values) => {
        try {
            const result = isEditing ? await updateSubject(id, values) : await createSubject(values);
            if (result.success) {
                navigate('/subjects');
                message.success('Lưu thông tin môn học thành công');
            } else {
                throw new Error('Failed to save the subject');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Lỗi khi lưu thông tin môn học');
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item>Môn học</Breadcrumb.Item>
                <Breadcrumb.Item>{isEditing ? 'Sửa môn học' : 'Thêm môn học'}</Breadcrumb.Item>
            </Breadcrumb>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="name" label="Tên môn học" rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="code" label="Mã môn học" rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                    <Select placeholder="Chọn trạng thái">
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Không hoạt động</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">{isEditing ? 'Cập nhật' : 'Thêm mới'}</Button>
                    {isEditing && (
                        <Button style={{ marginLeft: '8px' }} onClick={() => form.resetFields()} danger>
                            Hủy bỏ
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};

export default SubjectSavePage;
