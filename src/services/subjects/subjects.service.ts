import axios from 'axios';

export const getSubjects = async () => {
  try {
    const response = await axios.get('http://localhost:3001/subjects');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const addSubjects = async (subject: Object) => {
  try {
    return await axios.post('http://localhost:3001/subjects', subject);
  } catch (error) {
    console.error(error);
  }
};

export const deleteSubject = async (id: any) => {
  try {
    return await axios.delete(`http://localhost:3001/subjects/${id}`);
  } catch (error) {
    console.error(error);
  }
};
export const updateSubject = async (id: any, subject: Object) => {
  try {
    return await axios.put(`http://localhost:3001/subjects/${id}`, subject);
  } catch (error) {
    console.error(error);
  }
};
// axios.interceptors.request.use(
//   (config) => {
//     config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')} `;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
