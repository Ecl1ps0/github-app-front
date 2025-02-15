import type React from "react";
import { useState, useEffect, useRef } from "react";
import VoiceUserCard from "./VoiceUserCard";
import { Button } from "antd";

interface VoiceUser {
  id: string;
  name: string;
  hasCamera?: boolean;
  isSpeaking?: boolean;
}

export interface VoiceChatPanelProps {
  chatId: string;
  currentUser: {
    id: string;
    name: string;
  };
}

const VoiceChatPanel: React.FC<VoiceChatPanelProps> = ({
  chatId,
  currentUser,
}) => {
  const [users, setUsers] = useState<Map<string, VoiceUser>>(new Map());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8080/api/voice_chats/ws/${chatId}`
    );
    wsRef.current = ws;

    ws.onopen = () => console.log("Connected to voice chat:", chatId);
    ws.onmessage = (event) => handleWebSocketMessage(JSON.parse(event.data));
    ws.onclose = () => console.log("Disconnected from voice chat:", chatId);

    return () => {
      ws.close();
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [chatId, localStream]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case "user-join":
        setUsers((prev) => new Map(prev).set(data.user.id, data.user));
        if (data.user.id !== currentUser.id) createPeerConnection(data.user.id);
        break;
      case "user-leave":
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.delete(data.userId);
          return newUsers;
        });
        closePeerConnection(data.userId);
        break;
      case "user-update":
        setUsers((prev) => new Map(prev).set(data.user.id, data.user));
        break;
      case "offer":
        handleOffer(data.sender, data.data);
        break;
      case "answer":
        handleAnswer(data.sender, data.data);
        break;
      case "ice-candidate":
        handleIceCandidate(data.sender, data.data);
        break;
    }
  };

  const createPeerConnection = (userId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate)
        sendWebRTCMessage(userId, "ice-candidate", event.candidate);
    };

    localStream
      ?.getTracks()
      .forEach((track) => peerConnection.addTrack(track, localStream));
    peerConnections.current.set(userId, peerConnection);

    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer);
      sendWebRTCMessage(userId, "offer", offer);
    });
  };

  const handleOffer = (userId: string, offer: RTCSessionDescriptionInit) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate)
        sendWebRTCMessage(userId, "ice-candidate", event.candidate);
    };

    localStream
      ?.getTracks()
      .forEach((track) => peerConnection.addTrack(track, localStream));
    peerConnections.current.set(userId, peerConnection);

    peerConnection
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => {
        peerConnection.createAnswer().then((answer) => {
          peerConnection.setLocalDescription(answer);
          sendWebRTCMessage(userId, "answer", answer);
        });
      });
  };

  const handleAnswer = (userId: string, answer: RTCSessionDescriptionInit) => {
    peerConnections.current
      .get(userId)
      ?.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleIceCandidate = (
    userId: string,
    candidate: RTCIceCandidateInit
  ) => {
    peerConnections.current
      .get(userId)
      ?.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const sendWebRTCMessage = (userId: string, type: string, data: any) => {
    wsRef.current?.send(JSON.stringify({ type, userId, data }));
  };

  const closePeerConnection = (userId: string) => {
    peerConnections.current.get(userId)?.close();
    peerConnections.current.delete(userId);
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      if (stream.getAudioTracks().length > 0) {
        const audioElement = new Audio();
        audioElement.srcObject = stream;
        audioElement.autoplay = true;
      }
      setLocalStream(stream);
      setUsers((prev) =>
        new Map(prev).set(currentUser.id, {
          ...currentUser,
          hasCamera: false,
          isSpeaking: false,
        })
      );
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Voice Chat Room</h2>
      <Button
        onClick={startLocalStream}
        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition duration-300 mb-6"
      >
        Join Voice Chat
      </Button>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from(users.values()).map((user) => (
          <VoiceUserCard
            key={user.id}
            user={user}
            localStream={user.id === currentUser.id ? localStream : null}
            peerConnection={
              user.id !== currentUser.id
                ? peerConnections.current.get(user.id) || null
                : null
            }
          />
        ))}
      </div>
    </div>
  );
};

export default VoiceChatPanel;
