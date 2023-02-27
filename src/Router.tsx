import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Author from './components/pages/Author';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Main from './components/pages/Main';
import Message from './components/pages/Message';
import MessageRoom from './components/pages/MessageRoom';
import Post from './components/pages/Post';
import PostDetail from './components/pages/PostDetail';
import PostEdit from './components/pages/PostEdit';
import PostList from './components/pages/PostList';
import Profile from './components/pages/Profile';
import SignUp from './components/pages/SignUp';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Main />}>
          <Route path='home' element={<Home />} />
          <Route path='post' element={<Post />}>
            <Route path='' element={<PostList />} />
            <Route path='edit' element={<PostEdit />} />
            <Route path=':id' element={<PostDetail />} />
          </Route>
          <Route path='author/:id' element={<Author />} />
          <Route path='profile' element={<Profile />} />
          <Route path='message' element={<Message />} />
          <Route path='message/:id' element={<MessageRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

Router.defaultProps = {};

export default Router;
