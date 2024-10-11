import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import ProtectedRoute from "@/components/ProtectedRoute";
import RootLayout from "@/pages/RootLayout";
import SingleSidebarLayout from "@/pages/SingleSidebarLayout";
import AuthLayout from "@/pages/Auth/AuthLayout";
import Home from "@/pages/Home";
import SignIn from "@/pages/Auth/SignIn";
import SignUp from "@/pages/Auth/SignUp";
import EmailVerification from "@/pages/Auth/EmailVerification";
import UserProfile from "@/pages/UserProfile";
import Explore from "@/pages/Explore";
import Notification from "@/pages/Notification";
import Messages from "@/pages/Messages";
import Saved from "@/pages/Saved";
import Settings from "@/pages/Settings";
import PostDetails from "@/pages/PostDetails";
import Search from "@/pages/Search";
import ChangePassword from "@/pages/ChangePassword";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

export default function App() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/">
            <Route element={<AuthLayout />}>
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
            </Route>

            <Route path="verify" element={<EmailVerification />} />

            <Route path="forgot-password" element={<ForgotPassword />} />

            <Route path="reset-password" element={<ResetPassword />} />

            <Route
              path="change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            <Route
              element={
                <ProtectedRoute>
                  <RootLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="notification" element={<Notification />} />
              <Route path="saved" element={<Saved />} />
              <Route path="user/:userId" element={<UserProfile />} />
              <Route path="post/:postId" element={<PostDetails />} />
              <Route path="search" element={<Search />} />
            </Route>

            <Route
              element={
                <ProtectedRoute>
                  <SingleSidebarLayout />
                </ProtectedRoute>
              }
            >
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}
