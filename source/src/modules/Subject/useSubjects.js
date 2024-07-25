import { useState, useEffect, useCallback } from 'react';
import { getSubjects, createSubject, updateSubject, deleteSubject, getSubject } from './subjectService';
import { message } from 'antd';

const useSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all subjects
    const fetchSubjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getSubjects();
            setSubjects(response.data);
        } catch (error) {
            message.error('Failed to fetch subjects');
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    // Add a new subject
    const addSubject = async (subject) => {
        try {
            const response = await createSubject(subject);
            setSubjects([...subjects, response.data]);
            message.success('Subject added successfully');
        } catch (error) {
            message.error('Failed to add subject');
            console.error('Error adding subject:', error);
        }
    };

    // Update an existing subject
    const editSubject = async (id, subject) => {
        try {
            const response = await updateSubject(id, subject);
            const updatedSubjects = subjects.map(subj => subj.id === id ? response.data : subj);
            setSubjects(updatedSubjects);
            message.success('Subject updated successfully');
        } catch (error) {
            message.error('Failed to update subject');
            console.error('Error updating subject:', error);
        }
    };

    // Delete a subject
    const removeSubject = async (id) => {
        try {
            await deleteSubject(id);
            setSubjects(subjects.filter(subject => subject.id !== id));
            message.success('Subject deleted successfully');
        } catch (error) {
            message.error('Failed to delete subject');
            console.error('Error deleting subject:', error);
        }
    };

    // Fetch a single subject by ID
    const fetchSubject = async (id) => {
        try {
            const response = await getSubject(id);
            return response.data;
        } catch (error) {
            message.error('Failed to fetch subject details');
            console.error('Error fetching subject details:', error);
        }
    };

    return {
        subjects,
        loading,
        addSubject,
        editSubject,
        removeSubject,
        fetchSubject,
        fetchSubjects
    };
};

export default useSubjects;
