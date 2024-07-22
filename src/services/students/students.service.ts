import axios from 'axios';

export const getStudents = async () => {
  try {
    const response = await axios.get('http://localhost:3001/students');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const addStudents = async (student: Object) => {
  try {
    return await axios.post('http://localhost:3001/students', student);
  } catch (error) {
    console.error(error);
  }
};
export const deleteStudent = async (id: any) => {
  try {
    console.log(id);
    return await axios.delete(`http://localhost:3001/students/${id}`);
  } catch (error) {
    console.error(error);
  }
};
export const updateStudent = async (id: any, student: Object) => {
  try {
    return await axios.put(`http://localhost:3001/students/${id}`, student);
  } catch (error) {
    console.error(error);
  }
};
