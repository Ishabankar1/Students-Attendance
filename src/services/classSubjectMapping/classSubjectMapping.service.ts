import axios from 'axios';

export const createClassSubjectMapping = async (classSubject: Object) => {
  try {
    return await axios.post('http://localhost:3001/classsubjectmapping', classSubject);
  } catch (error) {
    console.error(error);
  }
};

export const getClassSubjectMapping = async () => {
  try {
    const response = await axios.get('http://localhost:3001/classsubjectmapping');
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteClassSubjectMapping = async (id: any) => {
  try {
    return await axios.delete(`http://localhost:3001/classsubjectmapping/${id}`);
  } catch (error) {
    console.error(error);
  }
};
