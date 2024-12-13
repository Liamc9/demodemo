import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MenuIcon, XIcon, CogIcon, LoginIcon, ScriptIcon, DataIcon, CodeIcon, HomeIcon } from '../icons/Icons';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSideNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Wrapper>
      <TopBar>
        <Button onClick={toggleSideNav}>
          <MenuIcon className="icon" />
        </Button>
      </TopBar>

      {isOpen && <Overlay onClick={toggleSideNav} />}

      <SideNavContainer isOpen={isOpen}>
        <SideNavHeader>
          <Title>My Portfolio</Title>
          <Button onClick={toggleSideNav}>
            <XIcon className="icon" />
          </Button>
        </SideNavHeader>
        <NavLinks>
          <StyledLink to="/home">
            <HomeIcon className="icon" />
            <span>Home</span>
          </StyledLink>
          <StyledLink to="/webdev">
            <CodeIcon className="icon" />
            <span>Web Development</span>
          </StyledLink>
          <StyledLink to="/scriptlist">
            <ScriptIcon className="icon" />
            <span>Scripts and Algorithms</span>
          </StyledLink>
          <StyledLink to="/dataAnalytics">
            <DataIcon className="icon" />
            <span>Data Analytics</span>
          </StyledLink>
        </NavLinks>
        <FooterLinks>
          <StyledLink to="/settings">
            <CogIcon className="icon" />
            <span>Settings</span>
          </StyledLink>
          <StyledLink to="/login">
            <LoginIcon className="icon" />
            <span>Signup/Login</span>
          </StyledLink>
        </FooterLinks>
      </SideNavContainer>
    </Wrapper>
  );
};

export default SideNav;

const Wrapper = styled.div`
`;

const TopBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  z-index: 50;
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  .icon {
    width: 2rem;
    height: 2rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
  transition: opacity 0.3s ease-in-out;
`;

const SideNavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 16rem;
  background: #2d3748;
  color: #edf2f7;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
  box-shadow: ${({ isOpen }) => (isOpen ? '0 2px 8px rgba(0, 0, 0, 0.5)' : 'none')};
  z-index: 50;
`;

const SideNavHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1rem;
  border-bottom: 1px solid #4a5568;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
`;

const NavLinks = styled.nav`
  flex-grow: 1;
  overflow-y: auto;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  border-top: 1px solid #4a5568;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
  color: #e2e8f0;
  text-decoration: none;
  transition: background 0.2s;
  width: 100%;

  &:hover {
    background: rgba(74, 85, 104, 0.25);
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
  }
`;
