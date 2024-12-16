import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import styled from "styled-components/native";
import api from "@/src/services/api";
import { useRouter } from 'expo-router';

interface CardProps {
    photoUri?: string;
    caption: string;
    postId: string;
    data: string;
}

const LikeButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
`;

const LikeIcon = styled.Text`
    font-size: 24px;
    color: red;
`;

const CardContainer = styled.View`
    background-color: white;
    margin: 10px;
    padding: 15px;
    border-radius: 10px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 5;
`;

const CardPhoto = styled.Image`
    width: 100%;
    height: 200px;
    border-radius: 10px;
    margin-bottom: 10px;
`;

const CardCaption = styled.Text`
    font-size: 16px;
    margin-bottom: 10px;
    color: #333;
`;

const FeedCard: React.FC<CardProps & { isLoading?: boolean }> = ({ photoUri, caption, postId, data, isLoading }) => {

    const [liked, setLiked] = useState(false);

    const router = useRouter();

    const toggleLike = () => {
        setLiked(!liked);
    };

    const navigateToMessages = () => {
        router.push({
            pathname: `/feed/messages/`,
            params: { postId, photoUri, caption, data },
        } as any);
    };

    return (
        <CardContainer>
            <TouchableOpacity onPress={navigateToMessages}>
                {photoUri ? (
                    <CardPhoto source={{ uri: photoUri }} accessible accessibilityLabel="Imagem do post" />
                ) : (
                    <Text>Imagem indisponível</Text>
                )}
            </TouchableOpacity>
            <CardCaption>{caption}</CardCaption>

            <LikeButton onPress={toggleLike}>
                <LikeIcon>{liked ? "❤️" : "🤍"}</LikeIcon>
            </LikeButton>

        </CardContainer>
    );
};

export default FeedCard;

