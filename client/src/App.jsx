import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import RootLayout from "@/pages/RootLayout";
import AuthLayout from "@/pages/Auth/AuthLayout";
import Home from "@/pages/Home";
import SignIn from "@/pages/Auth/SignIn";
import SignUp from "@/pages/Auth/SignUp";
import Profile from "@/pages/Profile";
import Explore from "@/pages/Explore";
import Notification from "@/pages/Notification";
import Messages from "@/pages/Messages";
import MessagesLayout from "@/pages/Messages/MessagesLayout";
import Bookmarks from "@/pages/Bookmarks";
import Settings from "@/pages/Settings";
import { Suspense } from "react";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/">
            <Route element={<AuthLayout />}>
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
            </Route>

            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="notification" element={<Notification />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="settings" element={<Settings />} />
              <Route path="me" element={<Profile />} />
            </Route>

            <Route path="messages" element={<MessagesLayout />}>
              <Route index element={<Messages />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
