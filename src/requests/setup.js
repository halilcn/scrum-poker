import axios from 'axios'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: '/', // Since we're on the same domain in Next.js
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add common headers or auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    config.metadata = { startTime: new Date() }
    
    // Add auth token if available (for future use)
    // const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle responses and errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime
    
    return response
  },
  (error) => {
    const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 0
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, error.response?.data || error.message)
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access (for future use)
      console.warn('🔐 Unauthorized access - redirecting to login')
      // Could redirect to login page here
    }
    
    if (error.response?.status === 500) {
      console.error('🔥 Server error occurred')
    }
    
    // Network errors
    if (error.code === 'NETWORK_ERROR') {
      console.error('🌐 Network error - check your connection')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient 