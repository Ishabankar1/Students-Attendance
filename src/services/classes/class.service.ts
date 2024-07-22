import axios from 'axios';

export const getClasses = async () => {
  try {
    const response = await axios.get('http://localhost:3001/classes');

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const addClass = async (classes: Object) => {
  try {
    return await axios.post('http://localhost:3001/classes', classes);
  } catch (error) {
    console.error(error);
  }
};
export const getClassById = async (id: any) => {
  try {
    return await axios.get(`http://localhost:3001/classes/${id}`);
  } catch (error) {
    console.error(error);
  }
};
export const deleteClass = async (id: any) => {
  try {
    return await axios.delete(`http://localhost:3001/classes/${id}`);
  } catch (error) {
    console.error(error);
  }
};

export const updateClass = async (id: any, classes: Object) => {
  try {
    return await axios.put(`http://localhost:3001/classes/${id}`, classes);
  } catch (error) {
    console.error(error);
  }
};
