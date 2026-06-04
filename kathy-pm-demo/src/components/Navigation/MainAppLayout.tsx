import { Outlet } from 'react-router-dom';
import { Content } from '@carbon/react';
import Header from '../Common/Header';
import Sidebar from './Sidebar';
import './MainAppLayout.scss';

export default function MainAppLayout() {
  return (
    <div className="main-app-layout">
      <Header />
      <div className="app-container">
        <Sidebar />
        <Content className="app-content">
          <Outlet />
        </Content>
      </div>
    </div>
  );
}

// Made with Bob