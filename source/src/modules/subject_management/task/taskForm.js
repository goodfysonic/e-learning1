import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import SelectField from '@components/common/form/SelectField';
import { BaseForm } from '@components/common/form/BaseForm';
import { taskState } from '@constants/masterData'; 
import { FormattedMessage } from 'react-intl';

const TaskForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    useEffect(() => {
        if (dataDetail) {
            form.setFieldsValue(dataDetail);
        }
    }, [dataDetail, form]);

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
            status: dataDetail.status,
        });
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={<FormattedMessage id="taskName" defaultMessage="Task Name" />}
                            required={true}
                            name="taskName"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            name="state"
                            label={<FormattedMessage id="state" defaultMessage="State" />}
                            options={taskState}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={<FormattedMessage id="startDate" defaultMessage="Start Date" />}
                            name="startDate"
                            type="date"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={<FormattedMessage id="endDate" defaultMessage="End Date" />}
                            name="endDate"
                            type="date"
                        />
                    </Col>
                    <Col span={24}>
                        <TextField
                            label={<FormattedMessage id="note" defaultMessage="Note" />}
                            name="note"
                            type="textarea"
                        />
                    </Col>
                </Row>
                <div>{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default TaskForm;
