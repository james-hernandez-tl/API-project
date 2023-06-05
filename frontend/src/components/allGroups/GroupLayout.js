import "./GroupLayout.css"

export default function GroupLayout({group}){
     return (
        <div className="group-layout">
            <div className="group-layout-img">medium img</div>
            <div className="group-layout-text">
                <h2 className="group-layout-text-title">
                      {group.name}
                </h2>
                <div className="group-layout-location">{group.state}, {group.city}</div>

                <div className="group-layout-about">{group.about}</div>
            </div>
        </div>
     )
}
