import "./GroupLayout.css"
import { useHistory } from "react-router-dom"

export default function GroupLayout({group}){

    const history=useHistory()

    const groupClicker = () => {
        history.push(`/groups/${group.id}`)
    }
     return (
        <div onClick={groupClicker} className="group-layout">
            {/* <hr /> */}
            <div className="group-layout-img">medium img</div>
            <div className="group-layout-text">
                <h2 className="group-layout-text-title">
                      {group.name}
                </h2>
                <div className="group-layout-location">{group.state}, {group.city}</div>

                <div className="group-layout-about">{group.about}</div>

                <div>{group.numMembers} {group.numMembers != 1?"Members ·":"Member ·"} {group.private?" Private":" Public"}</div>
            </div>
        </div>
     )
}
