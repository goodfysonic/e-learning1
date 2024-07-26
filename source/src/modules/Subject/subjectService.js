import axios from 'axios';

const apiUrl = 'https://elms-tenant-api.developteam.net/api'; 
export const getSubjects = () => axios.get(`${apiUrl}/v1/subject/list`);
export const getSubject = (id) => axios.get(`${apiUrl}/v1/subject/${id}`);
export const createSubject = (subject) => axios.post(`${apiUrl}/v1/subject/create`, { createSubjectForm: subject });
export const updateSubject = (id, subject) => axios.put(`${apiUrl}/v1/subject/update/${id}`, { updateSubjectForm: subject });
export const deleteSubject = (id) => axios.delete(`${apiUrl}/v1/subject/delete/${id}`);
