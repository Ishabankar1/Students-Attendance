import axios from 'axios';

export const Login = async (user: Object) => {
  axios.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')} `;
      return config;
    },
    (error) => Promise.reject(error)
  );
  const data = await axios.post('http://localhost:3000/auth/login', user);
  return data;
};

export const signUp = async (user: Object) => {
  try {
    return await axios.post('http://localhost:3000/auth/signup', user);
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async (id: any, UserData: Object) => {
  try {
    return await axios.put(`http://localhost:3000/auth/${id}`, UserData);
  } catch (error) {
    console.error(error);
  }
};

// {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('accessToken')} `,
//   },
// }

const getCurrentUser = () => {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
  return accessToken;
};

export const checkToken = () => {
  const accessToken = getCurrentUser();
  if (accessToken) {
    return axios
      .get(`http://localhost:3000/auth/check-token`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // Update user info in local storage if needed
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      });
  }
  return Promise.reject('No token found');
};

export const uploadImage = (data: any) => {
  return axios.post('http://localhost:3000/auth/upload-file', data);
};
