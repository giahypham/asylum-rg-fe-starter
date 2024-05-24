import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';


//Link to Profile Button that only displays once the user is logged in
const ProfileButton = () => {
  const { isAuthenticated } = useAuth0();
  
  return isAuthenticated 
        ?  
        <Link to="/profile" style={{ color: '#E2F0F7', paddingRight: '75px'}}>
          Profile
        </Link> 
        : 
        <></>;
};

export default ProfileButton;