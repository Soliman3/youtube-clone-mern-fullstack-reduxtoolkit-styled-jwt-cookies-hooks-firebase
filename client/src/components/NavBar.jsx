import { useSelector, useDispatch } from 'react-redux';
import { logout, loginFailure } from '../redux/useSlice';

// import styled components library for styling our app...
import styled from 'styled-components';

// Imported material icons from mui5 library...
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';

// import Link to direct clicking on logo to home page route ('/')...
import { Link, useNavigate } from 'react-router-dom';

// import LogoImage from images folder...
import logoImage from '../images/youtubeLogo.svg';
import MenuIcon from '../images/MenuIcon.png';
import { useState } from 'react';

// import required components...
import Upload from './Upload';




// Styling...
// Styled component for (div) for makeing the NavBar component...
const Container = styled.div`
    height: 55px;
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.LighterBackground};
    width: 100%;
    z-index: 3;
    
`;

// Styled component for (div) to wrap the main content of the container and giving it a padding...
const WrapperContainer = styled.div`
    display:flex;
    align-items: center; 
    height: 100%;
    padding: 0 25px;
    justify-content: flex-end;
   
`;
const LogoContainer = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    
`;

// Styled component for (div) contained youtube icon & displed clone name...
const Logo = styled.div`
    gap:6px;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
`;

// Styled component (img) for the youtube icon...
const YoutubeLogo = styled.img`
    height: 24.5px;
    margin-left:27.75px;
`;
// Styled component (img) for the youtube icon...
const MainMenu = styled.img`
    height: 13.75px;
    margin-left: 1px;
    cursor: pointer;
`;

// Styled component for (div) for Search container...
const SearchContainer = styled.div`
    position: sticky;
    display: flex;
    align-items: center;
    justify-content: space-between;
    left: 0px;
    right:0px;
    margin: auto;
    padding: 5px;
    border: solid 1px #ccc;
    border-radius: 4px;
    width: 38%;
`;

// Styled component for (input) for Search input...
const SearchInput = styled.input`
    border: none;
    background: transparent;
    outline: none;
`
// styled componenet (button) for login button... 
const LoginButton = styled.button`
    font-weight: 500;
    cursor: pointer;
    color: #3ea6ff;
    background-color: transparent;
    border: solid 1px #3ea6ff;
    border-radius: 4px ;
    padding: 5px 20px;
    gap:4px;
    display: flex;
    align-items: center;  
`;

// Styled component for (img) for Channel Image...
const AccountImage = styled.img`
    width: 32px;
    height:32px;
    border-radius: 50%;
    background-color: gray;
    object-fit: cover;
    cursor: pointer;
`;

const User = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.AllText};
`;
const LogOut = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
  font-weight: 200;
  color: ${({ theme }) => theme.AllText};
  font-size: 14px;
  cursor: pointer;
`;

// React functional component for NavBar...
export default function TestNavBar({ MenuClicked, setMenuClicked }) {
  // useState for PopUp add new vieeo...
  const [open, setOpen] = useState(false)
  // useState for Queries of SearchVideos...
  const [query, setQuery] = useState("")
  // useSelector for userSlice...
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // useNavigation from react router dom...
  const navigate = useNavigate();

  // handle Log Out function...
  const handleLogOut = (e) => {
    try {
      dispatch(logout()).then(navigate("/signin"));
    } catch (error) {
        dispatch(loginFailure())
    }
}
  return (
    <>
    <Container>
      <WrapperContainer>
        <LogoContainer />
        <MainMenu src={MenuIcon} onClick={() => setMenuClicked(!MenuClicked)} />
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          <Logo>
            <YoutubeLogo src={logoImage} />
          </Logo>
        </Link>
        <LogoContainer />
        <SearchContainer>
          <SearchInput placeholder='Search' onChange={(e)=> setQuery(e.target.value)} />
            <SearchOutlinedIcon style={{ cursor: "pointer" }} onClick={()=> navigate(`/search?q=${query}`)} />
        </SearchContainer>
        {currentUser ? (
          <User>
            {currentUser? <LogOut onClick={handleLogOut}>Log Out</LogOut>: ''}
            <VideoCallOutlinedIcon onClick={()=>setOpen(true)} />
            <AccountImage src={currentUser.img}/>
            {currentUser.name}
          </User>) : <Link to="signin" style={{ color: 'inherit', textDecoration: 'inherit' }}>
          <LoginButton>
            <AccountCircleOutlinedIcon />
            SIGN IN
          </LoginButton>
        </Link>}
      </WrapperContainer>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  )
}
