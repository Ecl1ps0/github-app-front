"use client";

import { Avatar, Button, Card } from "antd";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import type React from "react";
import { useState, useEffect, useRef } from "react";

interface VoiceUserCardProps {
  user: {
    id: string;
    name: string;
    hasCamera?: boolean;
    isSpeaking?: boolean;
  };
  localStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
}

const VoiceUserCard: React.FC<VoiceUserCardProps> = ({
  user,
  localStream,
  peerConnection,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (user.id === "local" && localStream && videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [user.id, localStream]);

  useEffect(() => {
    if (user.id !== "local" && peerConnection) {
      peerConnection.ontrack = (event) => {
        const [stream] = event.streams;

        // Play audio if audio is present
        if (stream.getAudioTracks().length > 0) {
          const audioElement = new Audio();
          audioElement.srcObject = stream;
          audioElement.autoplay = true;
        }

        // Optional: Play video if you enable video later
        if (stream.getVideoTracks().length > 0 && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      };
    }
  }, [user.id, peerConnection]);

  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => (track.enabled = !track.enabled));
      setIsVideoOn(!isVideoOn);
    }
  };

  return (
    <Card className="w-64 p-4 m-2 bg-gray-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <Avatar
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
          className="bg-gray-700"
        />
        <div className="text-lg font-semibold">{user.name}</div>
      </div>
      {user.hasCamera && (
        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={user.id === "local"}
            className="w-full h-32 object-cover rounded-md bg-black"
          />
          {user.isSpeaking && (
            <div className="absolute top-0 left-0 w-full h-full border-4 border-green-400 rounded-md animate-pulse" />
          )}
        </div>
      )}
      {user.id === "local" && (
        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleMute}
            type={isMuted ? "dashed" : "default"}
            className="bg-gray-700 hover:bg-gray-600 text-white border-none"
          >
            {isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          <Button
            onClick={toggleVideo}
            type={isVideoOn ? "default" : "dashed"}
            className="bg-gray-700 hover:bg-gray-600 text-white border-none"
          >
            {isVideoOn ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default VoiceUserCard;
