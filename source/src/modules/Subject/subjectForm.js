import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Breadcrumb, message } from 'antd';
import useSubjects from './useSubjects'; // Sử dụng custom hook đã được tạo

const { Option } = Select;

const subjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { addSubject, editSubject, fetchSubject } = useSubjects();
    const isEditing = id !== undefined;

    useEffect(() => {
        if (isEditing) {
            (async () => {
                try {
                    const data = await fetchSubject(id);
                    form.setFieldsValue(data);
                } catch (error) {
                    message.error('Failed to load subject details');
                }
            })();
        }
    }, [id, form, fetchSubject]);

    const handleSubmit = async (values) => {
        try {
            if (isEditing) {
                await editSubject(id, values);
                message.success('Subject updated successfully');
            } else {
                await addSubject(values);
                message.success('Subject added successfully');
            }
            navigate('/subjects');
        } catch (error) {
            message.error('Failed to save subject');
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item>Môn học</Breadcrumb.Item>
                <Breadcrumb.Item>{isEditing ? 'Sửa môn học' : 'Thêm môn học'}</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ border: "1px solid #d9d9d9", padding: "24px", maxWidth: "400px" }}>
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
        </div>
    );
};

export default subjectForm;
