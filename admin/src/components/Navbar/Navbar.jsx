import React from "react";
import "./Navbar.css"
import navlogo from "../../assets/nav-logo.svg"
import navProfile from "../../assets/nav-profile.svg"
function Navbar() {
  return (
    <div className="custom-navbar">
      <img className="nav-logo" src={navlogo} alt="" />
      <img src="https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/419873835_362463746506619_3905469401316009793_n.jpg?stp=dst-jpg_p160x160&_nc_cat=105&ccb=1-7&_nc_sid=5740b7&_nc_ohc=AfqWQxHvzBIAX9yz9AZ&_nc_ht=scontent.fhan14-1.fna&oh=00_AfDx_xQg_BJA96kdmOTCUuuwoCs3fye1FaHmyljaI4fyxA&oe=65E1FB70" className="nav-profile" alt="" />
    </div>
  );
}

export default Navbar;