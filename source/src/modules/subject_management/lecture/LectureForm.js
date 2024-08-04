import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import SelectField from '@components/common/form/SelectField';
import { BaseForm } from '@components/common/form/BaseForm';
import { lectureKindOptions } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import { FormattedMessage } from 'react-intl';
import RichTextField from '@components/common/form/RichTextField';

const LectureForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const [lectureKind, setLectureKind] = useState(dataDetail?.lectureKind ?? 2);
    const translate = useTranslate();
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const lectureKindValues = translate.formatKeys(lectureKindOptions, ['label']);
    useEffect(() => {
        if (dataDetail) {
            form.setFieldsValue(dataDetail);
            if(dataDetail?.lectureKind){
                setLectureKind(dataDetail.lectureKind);
            }
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
                            label={translate.formatMessage(commonMessage.lectureName)}
                            required={true}
                            name="lectureName"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            initialValue={lectureKind}
                            onChange={value => {
                                setLectureKind(value);
                            }}
                            name="lectureKind"
                            label={"Loại bài giảng"}
                            allowClear={false}
                            showSearch
                            options={lectureKindValues}
                        />
                    </Col>
                </Row>
                {lectureKind === 2 && (
                    <>
                        <Row gutter={16}>
                            <Col span={24}>
                                <TextField
                                    label={"Đường dẫn tài liệu"}
                                    name="lectureNameurlDocument"
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <RichTextField
                                    label="Nội dung bài giảng"
                                    name="description"
                                    required={true}
                                    form={form}
                                    style={{
                                        height: "300px",
                                        marginBottom: "70px",
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Mô tả ngắn" />}
                                    name="shortDescription"
                                    type="textarea"
                                />
                            </Col>
                        </Row>
                    </>
                )}
                <div>{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default LectureForm;
