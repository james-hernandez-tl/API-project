import "./home.css"
import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

export default function Home() {
    const user = useSelector((state) => state.session.user)
    const [disableStart,setDisableStart] = useState(true)

    useEffect(()=>{
       if (user) setDisableStart(false)
       else setDisableStart (true)
    },[user])

    const startGroupClicker = (e) =>{
        if (disableStart) e.preventDefault()

    }


    return (
        <main >
            <div className="home-section1">
                <div className="home-section1-text">
                    <h2>The people platform - Where interests become friendships</h2>
                    <div>dksajfdskalj djfkldsaj dksjafdl jsajd ldjsa flkjdaslkjfdlkjsaf lkds jlkdj lsdajfl dlsa jflkfklj skjfksad fkdsj fijds fjdsi jfc dsjfi lkdjsfewdj sifh sudjfiewdsfwejsfnjdsjfiowla sjfdasfjd ldksajflkdjsa dkjfaksljdf dskljfksadljf lkajdafjlk</div>
                </div>
                <div >
                    <img className="home-main-img" src="https://i.imgur.com/OEyeZ8o.jpeg"></img>
                </div>
            </div>


            <div className="home-section2">
                <h3>How Meetup works</h3>
                <div>a whole bunch of random works put together to form a decent sized sentence</div>
            </div>

            <div className="home-section3">
                <div className="home-seeGroup">
                    <div className="home-img"><i className="fa-solid fa-comments"></i></div>
                    <NavLink exact={true} to="/groups">See all groups</NavLink>
                    <div className="home-section3-captions">Look at all the wonderful groups for you to join!</div>
                </div>
                <div className="home-findEvents">
                    <div className="home-img"><i className="fa-brands fa-wpforms"></i></div>
                    <NavLink exact={true} to="/events">find an event</NavLink>
                    <div className="home-section3-captions">Look at all the wonderful groups for you to join!</div>
                </div>

                <div className="home-startGroup">
                    <div className="home-img"><i className="fa-solid fa-people-group"></i></div>
                    <NavLink className={disableStart?"disable":""} exact={true} to="/groups/new" onClick={startGroupClicker} >Start a new group</NavLink>
                    <div className="home-section3-captions" >Look at all the wonderful groups for you to join!</div>
                </div>

            </div>

            <div className="home-section4">
                <button className="join-meetup-button" >Join Meetup</button>
            </div>
        </main>
    )
}
