import { useEffect } from "react";
import GroupFormInput from "../CreateGroupForm/GroupFormInput";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateGroupForm() {
  const history = useNavigate();
  const { groupId } = useParams();
  const group = useSelector((state) => state.Groups.allGroups[groupId]);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (user.id !== group.organizerId) {
      history("/");
    }
  }, []);

  return (
    <div>
      <div>UPDATE YOUR GROUP'S INFORMATION</div>
      <h2>
        We'll walk you through a few steps to update your group's information
      </h2>
      <hr />
      <GroupFormInput formType={"Update"} currentGroup={group} />
    </div>
  );
}
