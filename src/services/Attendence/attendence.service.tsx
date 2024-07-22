import axios from 'axios';

export const noteAttendence = async (AttendenceEntities: any) => {
  try {
    return await axios.post('http://localhost:3001/mark-attendence', AttendenceEntities);
  } catch (error) {
    console.error(error);
  }
};
export const getAllAttendenceData = async () => {
  try {
    const response = await axios.get('http://localhost:3001/mark-attendence');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const getStudentsByClassIdAndSubjectIdByAttendenceDate = async (classId: string, subjectId: string, attendenceDate: any) => {
  try {
    const response = await axios.get(`http://localhost:3001/mark-attendence/${classId}/${subjectId}/${attendenceDate}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const getStudentsByClassIdAndSubjectId = async (classId: any, subjectId: any) => {
  try {
    const response = await axios.get(`http://localhost:3001/mark-attendence/class/${classId}/subject/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getStudentsByClassId = async (classId: any) => {
  try {
    const response = await axios.get(`http://localhost:3001/mark-attendence/students/${classId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateStudentAttendece = async (id: any, studentData: Object) => {
  try {
    return await axios.put(`http://localhost:3001/mark-attendence/${id}`, studentData);
  } catch (error) {
    console.error(error);
  }
};
