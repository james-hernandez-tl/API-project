import "./home.css"
import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

export default function Home() {
    const user = useSelector((state) => state.session.user)
    const [disableStart,setDisableStart] = useState(true)

    useEffect(()=>{
        // console.log(user)
       if (user) setDisableStart(false)
       else setDisableStart (true)
    },[user])

    const startGroupClicker = (e) =>{
        if (disableStart) e.preventDefault()

    }


    return (
        <main >
            <div className="home-section1">
                <div >
                    <h2>The people platform - Where interests become friendships</h2>
                    <div>dksajfdskalj djfkldsajfklj skjfksad fkdsj fijds fjdsi jfc dsjfi lkdjsfewdj sifh sudjfiewdsfwejsfnjdsjfiowla sjfdasfjd ldksajflkdjsa dkjfaksljdf dskljfksadljf lkajdafjlk</div>
                </div>
                <div >
                    <h2>picture</h2>
                </div>
            </div>


            <div className="home-section2">
                <h3>How Meetup works</h3>
                <div>random words again</div>
            </div>

            <div className="home-section3">
                <div className="home-seeGroup">
                    <div className="home-img">img</div>
                    <NavLink exact={true} to="/groups">See all groups</NavLink>
                    <div className="home-section3-captions">Look at all the wonderful groups for you to join!</div>
                </div>
                <div className="home-findEvents">
                    <div className="home-img">img</div>
                    <NavLink exact={true} to="/events">find an event</NavLink>
                    <div className="home-section3-captions">Look at all the wonderful groups for you to join!</div>
                </div>

                <div className="home-startGroup">
                    <div className="home-img">img</div>
                    <NavLink className={disableStart?"disable":""} exact={true} to="/groups/new" onClick={startGroupClicker} >Start a new group</NavLink>
                    <div className="home-section3-captions" >Look at all the wonderful groups for you to join!</div>
                </div>

            </div>

            <div className="home-section4">
                <button >Join Meetup</button>
            </div>
        </main>
    )
}
