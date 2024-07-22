import axios from 'axios';

export const getEvents = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/events`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const addEvents = async (event: Object) => {
  try {
    return await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/events`, event);
  } catch (error) {
    console.error(error);
  }
};
export const deleteEvent = async (id: any) => {
  try {
    console.log(id);
    return await axios.delete(`${process.env.REACT_APP_BACKEND_API_KEY}/events/${id}`);
  } catch (error) {
    console.error(error);
  }
};
