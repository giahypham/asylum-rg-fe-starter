import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';


//This is the Profile page that will display the user's information once logged in
const Profile = () => {
  const { user } = useAuth0();
  const { name, nickname, picture, email } = user;

  return (
    <div>
      <div 
      className="profile-container"
      style={{
        textAlign: 'center',
        alignItems: 'center',
      }}
      >
        <h1>Welcome {nickname} </h1>
        <div className="profile-intro">
          <img
            src={picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
          <p>Name: {name}</p>
          <p>Email: {email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;