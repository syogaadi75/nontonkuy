import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from '../features/authSlice';
import { getRooms, userJoinRoom } from '../features/roomsSlice';
import io from 'socket.io-client';

function ListRooms() {
    const { isLoading, isAuthenticated, user } = useSelector((state) => state.auth)
    const { joined, errorJoin, isLoadingJoin } = useSelector((state) => state.rooms)
    const { rooms } = useSelector((state) => state.rooms)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const socket = io('http://localhost:3000');
    const socket = io('https://nontonkuy.fly.dev');


    const cekJoinedRoom = () => {
        const roomId = localStorage.getItem('joinedRoom')
        if (roomId) {
            navigate('/watch/' + roomId);
        }
    }

    const joinRoom = (roomId) => {
        dispatch(userJoinRoom({ roomId, userId: user.user.id }));
        if (errorJoin) {
            return console.log(errorJoin)
        }
        socket.emit('joinRoom', { roomId, userId: user.user.id });
        navigate('/watch/' + roomId);
    }

    useEffect(() => {
        cekJoinedRoom()
        dispatch(checkAuth())
        dispatch(getRooms())
    }, [dispatch])

    if (isAuthenticated === false) {
        navigate('/login')
    }

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div>
            <h1 className='text-2xl'>Public Rooms</h1>
            {
                rooms?.map((room, i) => (
                    <div key={i} className="p-4 flex gap-8 items-center">
                        <div>
                            <div className='font-semibold'>{room.name}</div>
                            <div className='text-gray-600 text-sm'>
                                {room.users.length} {room.users.length > 1 ? 'Users' : 'User'}
                            </div>
                        </div>
                        <div>
                            {!isLoadingJoin ? (
                                <button onClick={() => joinRoom(room._id)} className='px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Join Room</button>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ListRooms