import { axiosInstance } from "./axios"

export const signUp = async (signUpData) => {
      const response = await axiosInstance.post('/auth/signup', signUpData)
      return response.data
}

export const getAuthUser = async () => {
      try {
            const res = await axiosInstance.get('/auth/me')
            return res.data
      } catch (error) {
            return null
      }
}

export const getOnBoard = async (userData) => {
      const res = await axiosInstance.post('/auth/onboarding', userData)
      return res.data
}

export const login = async (loginData) => {
      const response = await axiosInstance.post('/auth/login', loginData)
      return response.data
}

export const logout = async () => {
      const response = await axiosInstance.post('/auth/logout')
      return response.data
}

export const getUserFriends = async () => {
      const response = await axiosInstance.get('/user/friends')
      return response.data
}

export const getRecommendedUsers = async () => {
      const response = await axiosInstance.get('/user')
      return response.data
}

export const getOutgoingFriendReqs = async () => {
      const response = await axiosInstance.get('/user/outgoing-friend-request')
      return response.data
}

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/user/friend-request/${userId}`);
  return response.data;
};


export const getFriendRequest = async () => {
  const response = await axiosInstance.get('/user/friend-requests');
  return response.data;
};

export const acceptFriendRequest = async (requestId) => {
      const response = await axiosInstance.put(`/user/friend-request/${requestId}/accept`)
      return response.data
}

export const getStreamToken = async () => {
      const response = await axiosInstance.get('/chat/token')
      return response.data
}

