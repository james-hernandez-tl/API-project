import "./GroupLayout.css";
import { useNavigate } from "react-router-dom";

export default function GroupLayout({ group }) {
  let prevImg = group.previewImage;
  const history = useNavigate();

  const groupClicker = () => {
    history(`/groups/${group.id}`);
  };
  return (
    <div onClick={groupClicker} className="group-layout">
      {/* <hr /> */}
      <div className="group-layout-img">
        <img
          className="group-layout-img-real"
          src={prevImg ? prevImg : "https://i.imgur.com/2EGj2Rk.jpeg"}
          alt=""
        />
      </div>
      <div className="group-layout-text">
        <h2 className="group-layout-text-title">{group.name}</h2>
        <div className="group-layout-location">
          {group.state}, {group.city}
        </div>

        <div className="group-layout-about">{group.about}</div>

        <div className="group-layout-text-numMembers">
          {group.numMembers} {group.numMembers !== 1 ? "Members ·" : "Member ·"}{" "}
          {group.private ? " Private" : " Public"}
        </div>
      </div>
    </div>
  );
}
