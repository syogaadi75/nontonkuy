import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { checkAuth } from '../features/authSlice';
import { userCekRoom, userExitRoom } from '../features/roomsSlice';
import io from 'socket.io-client';
// import ReactPlayer from 'react-player';
import { Player, FullscreenToggle, ControlBar, Shortcut, BigPlayButton, ProgressControl, CurrentTimeDisplay, DurationDisplay, TimeDivider } from 'video-react';
import 'video-react/dist/video-react.css'
const socket = io('https://nontonkuy.fly.dev');

function Watch() {
    const { roomId } = useParams();
    let { user, isAuthenticated, isLoading } = useSelector((state) => state.auth)
    let { isLoadingExit, isLoadingJoin, errorExit, cekRoom, isLoadingCek, checkedRoom } = useSelector((state) => state.rooms)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [master, setMaster] = useState(false);

    let [plyr, setPlyr] = useState(null);

    const checkAuthFunc = async () => {
        await dispatch(checkAuth());
    }

    const cekRoomUser = async () => {
        await dispatch(userCekRoom({ roomId }));
    }

    useEffect(() => {
        checkAuthFunc()
    }, [dispatch])

    useEffect(() => {
        if (isAuthenticated === true) {
            cekRoomUser()
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (isLoadingJoin === false) {
            cekRoomUser()
        }

        return () => {
            isLoadingJoin = false
        }
    }, [isLoadingJoin])

    useEffect(() => {
        if (checkedRoom === true && plyr !== null) {
            if (currentTime < cekRoom?.player.time) {
                plyr.seek(cekRoom?.player.time)
                plyr?.actions.play()
            }

            socket.on('play', ({ time, roomId, isMaster }) => {
                plyr?.actions.play()
                setIsPlaying(true)
            });

            socket.on('pause', ({ time, roomId }) => {
                plyr?.actions.pause()
                setIsPlaying(false)
            });

            socket.on('seek', ({ time }) => {
                plyr.seek(time, "seconds");
                setCurrentTime(time);
            });

            socket.on('timeUpdate', ({ time, roomId, userId }) => {
                setCurrentTime(time);
            });
        }
    }, [checkedRoom, plyr])

    useEffect(() => {
        if (checkedRoom === true && plyr !== null && isAuthenticated === true) {
            cekRoom.master._id.toString() === user.user.id ? setMaster(true) : setMaster(false)
            if (currentTime < cekRoom.player.time) {
                plyr.playbackRate = 2
            } else {
                plyr.playbackRate = 1
            }
        }
    }, [currentTime, plyr, checkedRoom, isAuthenticated])

    const exitRoom = async (roomId) => {
        await dispatch(userExitRoom({ roomId, userId: user.user.id }));
        if (errorExit) {
            return console.log(errorExit)
        }
        navigate('/main');
    }

    if (isAuthenticated === false) {
        navigate('/login')
    }

    const handleProgress = () => {
        let { player } = plyr.getState();
        setCurrentTime(player.currentTime)
        socket.emit('timeUpdate', { time: player.currentTime, roomId, userId: user.user.id });
    }

    const handleSeek = (e) => {
        socket.emit('seek', { time: e, roomId, userId: user.user.id });
    }

    const handlePlay = () => {
        socket.emit('play', { time: currentTime, roomId, userId: user.user.id });
    }

    const handlePause = () => {
        socket.emit('pause', { time: currentTime, roomId, userId: user.user.id });
    }

    if (isLoading || isLoadingCek) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div>
            {!isLoadingExit ? (
                <button onClick={() => exitRoom(roomId)} className='px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Exit Room</button>
            ) : (
                <div>Loading...</div>
            )}
            <div>
                {currentTime} <br />
                {cekRoom?.name}
                {cekRoom?.videoLinks[0]}
                <div className='lg:w-[400px] p-3'>
                    <Player
                        autoPlay
                        ref={(player) => { setPlyr(player) }}
                        onProgress={handleProgress}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        muted={true}
                    >
                        <source src={cekRoom?.videoLinks[0]} />
                        <BigPlayButton className='big-play-button-hide' />
                        <Shortcut clickable={master} />
                        <ControlBar disableDefaultControls={!master}>
                            {/* <PlayToggle /> */}
                            <CurrentTimeDisplay key="ctd" />
                            <DurationDisplay key="dd" />
                            <ProgressControl key="pc" />
                            <TimeDivider key="td" />
                            <FullscreenToggle key="fs" />
                        </ControlBar>
                    </Player>
                </div>
            </div>
        </div>
    )
}

export default Watch