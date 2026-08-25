import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import Learn from './pages/Learn'
import GradePage from './pages/GradePage'
import StreamSubjectsPage from './pages/StreamSubjectsPage'
import SubjectPage from './pages/SubjectPage'
import ChapterDetail from './pages/ChapterDetail'
import NationalExam from './pages/NationalExam'
import Tutors from './pages/Tutors'
import TutorProfile from './pages/TutorProfile'
import Profile from './pages/Profile'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import BecomeTutor from './pages/BecomeTutor'
import ExamTake from './pages/ExamTake'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ReviewsProvider } from './context/ReviewsContext'

const router = createBrowserRouter([{
  path: '/',
  Component: RootLayout,
  children: [
    { index: true, Component: Home },
    { path: 'login', Component: Login },
    { path: 'register', Component: Register },
    { path: 'forgot-password', Component: ForgotPassword },
    { path: 'reset-password', Component: ResetPassword },
    {
      Component: ProtectedRoute,
      children: [
        { path: 'become-tutor', Component: BecomeTutor },
        { path: 'edit-tutor-profile', Component: BecomeTutor },
        { path: 'learn', Component: Learn },
        { path: 'learn/:stream', Component: GradePage },
        { path: 'learn/:stream/:grade', Component: StreamSubjectsPage },
        { path: 'learn/:stream/:grade/:subject', Component: SubjectPage },
        { path: 'learn/:stream/:grade/:subject/:chapter', Component: ChapterDetail },
        { path: 'exam', Component: NationalExam },
        { path: 'exam/take/:examId', Component: ExamTake },
        { path: 'tutors', Component: Tutors },
        { path: 'tutors/:id', Component: TutorProfile },
        { path: 'profile', Component: Profile },
        { path: 'about', Component: About },
      ],
    },
  ],
}])

function App() {
  return (
    <AuthProvider>
      <ReviewsProvider>
        <RouterProvider router={router} />
      </ReviewsProvider>
    </AuthProvider>
  )
}

export default App
