import axios from "axios";

export const configureAxios = () => {
  axios.defaults.baseURL = "http://localhost:5001/api";

  axios.interceptors.request.use(
    async (req) => {
      const token = localStorage.getItem("token"); // get saved token

      req.headers = {
        "Content-Type": "multipart/form-data",
        accept: "application/json;charset=UTF-8",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // add token to header
      };

      return req;
    },
    async (err) => {
      return Promise.reject(err);
    }
  );

  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token"); // remove expired token
      }
      return Promise.reject(err);
    }
  );
};

// login
export const login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:5001/api/auth/login", {
      email,
      password,
    });

    if (response.status === 200) {
      localStorage.setItem("token", response.data.token); // Save JWT
      console.log(response.data.token);
      return { success: true, message: "Login successful" };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

// get list
export const getList = async (list) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "http://localhost:5001/api/list",
      {
        content,
        mood,
      },
      {
        headers: {
          "x-auth-token": `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return { success: true, message: "Post successful" };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};
