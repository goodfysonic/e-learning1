import ListPage from '@components/common/layout/ListPage';
import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    AppConstants,
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_DISPLAY,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    STATE_COURSE_CANCELED,
    STATE_COURSE_FINISHED,
    STATE_COURSE_PREPARED,
    STATE_COURSE_RECRUITED,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined, BookOutlined, UserOutlined, CommentOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '@routes';
import { convertDateTimeToString } from '@utils/dayHelper';
import { formSize, lectureState, statusOptions, versionStateOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import { formatMoney, orderNumber } from '@utils';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useMoneyUnit from '@hooks/useMoneyUnit';
import { HistoryOutlined } from '@ant-design/icons';
import { EditOutlined } from '@ant-design/icons';

const message = defineMessages({
    objectName: 'Khoá học',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(lectureState, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const leaderName = queryParameters.get('leaderName');
    const [checkReivew, setCheckReview] = useState(true);
    const [courseId, setCourseId] = useState();
    const moneyUnit = useMoneyUnit();
    const [openReviewModal, handlersReviewModal] = useDisclosure(false);

    const location = useLocation();
    const navigate = useNavigate();
    const stateReviewCourse = translate.formatKeys(versionStateOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.course,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({
                        ...params,
                        isKnowledge: false,
                        status: 1,
                    });
                };
                funcs.changeFilter = (filter) => {
                    const leaderId = queryParams.get('leaderId');
                    const leaderName = queryParams.get('leaderName');
                    if (leaderId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ leaderId: leaderId, leaderName: leaderName, ...filter }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(serializeParams(filter));
                    }
                };
                funcs.additionalActionColumnButtons = () => ({
                    registration: ({ id, name, state, status }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.registration)}>
                            <Button
                                type="link"
                                disabled={state === 1}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    state !== 1 &&
                                        navigate(
                                            routes.registrationListPage.path +
                                                `?courseId=${id}&courseName=${name}&courseState=${state}&courseStatus=${status}`,
                                        );
                                }}
                            >
                                <TeamOutlined />
                            </Button>
                        </BaseTooltip>
                    ),

                    task: ({ id, name, subject, state, status }) => (
                        <BaseTooltip
                            title={
                                subject
                                    ? translate.formatMessage(commonMessage.task)
                                    : translate.formatMessage(commonMessage.noSubject)
                            }
                        >
                            <Button
                                disabled={state === STATE_COURSE_PREPARED || state === STATE_COURSE_RECRUITED || !subject}
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const path =
                                        (leaderName ? routes.leaderCourseTaskListPage.path : routes.taskListPage.path) +
                                        `?courseId=${id}&courseName=${name}&subjectId=${subject.id}&state=${state}&courseStatus=${status}` +
                                        (leaderName ? `&leaderName=${leaderName}` : '');
                                    state !== STATE_COURSE_PREPARED  &&
                                        state !== STATE_COURSE_RECRUITED &&
                                        navigate(path, { state: { pathPrev: location.search } });
                                }}
                            >
                                <BookOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    review: ({ id, name, subject, state, status, item }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.review)}>
                            <Button
                                type="link"
                                disabled={state !== 3}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    setCourseId(id);
                                    getListReview(id);
                                    getStarReview(id);
                                    e.stopPropagation();
                                    handlersReviewModal.open();
                                }}
                            >
                                <CommentOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    taskLog: ({ id, name, subject, state, status }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                            <Button
                                disabled={state === STATE_COURSE_PREPARED || state === STATE_COURSE_RECRUITED || !subject}
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const path =
                                        routes.taskLogCourseListPage.path +
                                        `?courseName=${name}&courseId=${id}&state=${state}`;
                                    navigate(path);
                                }}
                            >
                                <HistoryOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    edit: (item) => (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(message.objectName)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                disabled={item.state == STATE_COURSE_FINISHED || item.state == STATE_COURSE_CANCELED}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(mixinFuncs.getItemDetailLink(item), {
                                        state: { action: 'edit', prevPath: location.pathname },
                                    });
                                }}
                            >
                                <EditOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                });
            },
        });
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.course) }];
    const breadLeaderRoutes = [
        { breadcrumbName: translate.formatMessage(commonMessage.leader), path: routes?.leaderListPage?.path },
        { breadcrumbName: translate.formatMessage(commonMessage.course) },
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.courseName),
            colSpan: 6,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },

    ].filter(Boolean);

    const {
        data: dataListReview,
        loading: dataListLoading,
        execute: listReview,
    } = useFetch(apiConfig.review.listReviews, { immediate: false, mappingData: ({ data }) => data.content });

    const getListReview = (id) => {
        listReview({
            pathParams: {
                courseId: id,
            },
        });
    };

    const {
        data: starData,
        loading: starDataLoading,
        execute: starReview,
    } = useFetch(apiConfig.review.star, { immediate: false, mappingData: ({ data }) => data.content });

    const getStarReview = (id) => {
        starReview({
            pathParams: {
                courseId: id,
            },
        });
    };
    const { loading: loadingData, execute: myListReview } = useFetch(apiConfig.review.myReview, { immediate: false });

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'id',
            render: (text, record, index) => {
                return orderNumber(pagination, index);
            },
            width: 50,
        },
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.courseName),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(commonMessage.subjectName),
            width: 200,
            render: (dataRow) => {
                return (
                    <Flex vertical>
                        <span>{dataRow.subject.subjectName}</span>
                        <span style={{ fontSize: 12 }}>Leader: {dataRow?.leader?.account?.fullName}</span>
                    </Flex>
                );
            },
        },

        {
            title: <FormattedMessage defaultMessage="Học phí" />,
            dataIndex: 'fee',
            width: 150,
            align: 'right',
            render: (fee) => {
                const formattedValue = formatMoney(fee, {
                    currentcy: 'đ',
                    currentDecimal: '0',
                    groupSeparator: ',',
                });
                return <div>{formattedValue}</div>;
            },
        },
    
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'dateEnd',
            render: (dateEnd) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(dateEnd, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            width: 130,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                review: mixinFuncs.hasPermission([
                    apiConfig.review.star?.baseURL,
                    apiConfig.review.listReviews?.baseURL,
                ]),
                registration: !leaderName && mixinFuncs.hasPermission([apiConfig.registration.getList?.baseURL]),
                task: mixinFuncs.hasPermission([apiConfig.task.getList?.baseURL]),
                taskLog: mixinFuncs.hasPermission([apiConfig.taskLog.getList?.baseURL]),
                edit: !leaderName && true,
                delete: !leaderName && true,
            },
            { width: '180px' },
        ),
    ].filter(Boolean);

    return (
        <PageWrapper routes={leaderName ? breadLeaderRoutes : breadRoutes}>
            <ListPage
                title={leaderName && <span style={{ fontWeight: 'normal' }}>{leaderName}</span>}
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                })}
                actionBar={!leaderName && mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
           
        </PageWrapper>
    );
};

export default CourseListPage;
