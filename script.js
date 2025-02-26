const joinButton = document.getElementById('join-button');
const roomCodeInput = document.getElementById('room-code');
const joinContainer = document.getElementById('join-container');
const videoContainer = document.getElementById('video-container');

let localStream;
let peer;

joinButton.addEventListener('click', () => {
    const roomCode = roomCodeInput.value;
    if (roomCode) {
        joinRoom(roomCode);
    } else {
        alert('Please enter a room code.');
    }
});

function joinRoom(roomCode) {
    // Simulate room code verification
    const validRoomCode = '12345'; // This should be replaced with actual server-side verification
    if (roomCode === validRoomCode) {
        startCall();
    } else {
        alert('Invalid room code.');
    }
}

function startCall() {
    joinContainer.style.display = 'none';
    videoContainer.style.display = 'flex';

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            const localVideoElement = document.createElement('video');
            localVideoElement.srcObject = stream;
            localVideoElement.play();
            videoContainer.appendChild(localVideoElement);

            peer = new SimplePeer({
                initiator: location.hash === '#init',
                trickle: false,
                stream: localStream
            });

            peer.on('signal', data => {
                // Send signal data to the server to establish connection
                console.log('SIGNAL', JSON.stringify(data));
                // Simulate sending signal data to the other peer
                if (!peer.initiator) {
                    peer.signal(data);
                }
            });

            peer.on('stream', stream => {
                const remoteVideoElement = document.createElement('video');
                remoteVideoElement.srcObject = stream;
                remoteVideoElement.play();
                videoContainer.appendChild(remoteVideoElement);
            });

            // Simulate receiving signal data from the server
            if (peer.initiator) {
                setTimeout(() => {
                    // Simulate receiving signal data from the other peer
                    peer.signal(/* received signal data */);
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });
}
