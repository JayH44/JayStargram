import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Main from './components/pages/Main';
import Message from './components/pages/Message';
import Post from './components/pages/Post';
import PostEdit from './components/pages/PostEdit';
import Profile from './components/pages/Profile';
import SignUp from './components/pages/SignUp';

type RouterProps = {};

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Main />}>
          <Route path='home' element={<Home />} />
          <Route path='post' element={<Post />}>
            <Route path='edit' element={<PostEdit />} />
          </Route>
          <Route path='profile' element={<Profile />} />
          <Route path='message' element={<Message />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

Router.defaultProps = {};

export default Router;
