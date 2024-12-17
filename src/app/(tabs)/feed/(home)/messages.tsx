import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView, Button, RefreshControl, TextInput } from "react-native";
import styled from "styled-components/native";
import { useRoute } from "@react-navigation/native";
import api from "@/src/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/src/context/Auth";
import { showMessage } from 'react-native-flash-message';

const SkeletonLoader = styled.View`
    background-color: #e0e0e0;
    border-radius: 8px;
    margin-bottom: 10px;
    overflow: hidden;
`;

const SkeletonCardPhoto = styled(SkeletonLoader)`
    width: 100%;
    height: 200px;
`;

const SkeletonComment = styled(SkeletonLoader)`
    height: 60px;
    width: 100%;
    padding: 10px;
`;

const SkeletonText = styled(SkeletonLoader)`
    height: 16px;
    width: 80%;
    margin-top: 5px;
`;

const SkeletonSeparator = styled(SkeletonLoader)`
    height: 1px;
    width: 100%;
    margin: 20px 0;
`;

const CommentText = styled.Text`
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
`;

const CommentContainer = styled.View`
    margin-bottom: 10px;
`;

const LoadMoreIndicator = styled.View`
    padding: 10px;
    align-items: center;
`;

const CardPhoto = styled.Image`
    width: 100%;
    height: 200px;
    border-radius: 10px;
    margin-bottom: 10px;
`;

const Separator = styled.View`
    height: 1px;
    background-color: #ccc;
    margin: 20px 0;
`;

const Input = styled.TextInput`
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
`;

const SubmitButton = styled.TouchableOpacity`
    background-color: #007bff;
    padding: 15px;
    border-radius: 5px;
    align-items: center;
`;

const ButtonText = styled.Text`
    color: white;
    font-size: 16px;
    font-weight: bold;
`;

interface Comment {
    _id: string;
    content: string;
}

const Messages = () => {
    const route = useRoute();
    const { postId, photoUri, caption, data } = route.params as { postId: string; photoUri?: string; caption: string; data: string  };

    const [comments, setComments] = useState<Comment[]>([]);

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [comment, setComment] = useState("");
    const { user, createMsg } = useAuth();
    const [reload, setReload] = useState(false);

    const formattedDate = new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    });

    const fetchComments = async (pageNumber: number) => {
        if (!hasMore || (isLoading && pageNumber > 1)) return;

        setIsLoading(true);
        try {
            const response = await api.get<Comment[]>(`/messages/${postId}?page=${pageNumber}&limit=10`);
            const data = response.data;
            console.log(data);
            if (Array.isArray(data)) {
                if (data.length === 0) {
                    setHasMore(false);
                } else {
                    setComments((prevComments) => (pageNumber === 1 ? data : [...prevComments, ...data]));
                    setPage(pageNumber);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar comentários:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(1);
    }, []);

    useEffect(() => {
        if (reload) {
            // setComments([]);
            setHasMore(true);
            setPage(1);
            fetchComments(1);
            setReload(false);
        }
    }, [reload]);

    const handleScrollEnd = () => {
        if (!hasMore || isLoading) return;
        fetchComments(page + 1);
    };

    const handleSubmit = async () => {
        console.log(comment);
        if (comment){
            try {

                // const formData = new FormData();
                // formData.append('userId', user?.id?.toString() || '');
                // formData.append('content', comment);
                console.log(comment);
                const newComment = await createMsg(postId, comment);

                setComments((prevComments) => [newComment, ...prevComments]);

                showMessage({
                    message: "Sucesso!",
                    description: "Comentado com sucesso!",
                    type: "success",
                    titleStyle: {
                        fontSize: 25,
                        fontWeight: "bold",
                    },
                    textStyle: {
                        fontSize: 16,
                        paddingVertical: 20,
                    },
                    style: {
                        justifyContent: "center",
                    },
                });
                
            } catch (error) {
                showMessage({
                    message: "Ops!",
                    description: "Houve um erro ao comentar.",
                    type: "danger",
                    titleStyle: {
                        fontSize: 25,
                        fontWeight: "bold",
                    },
                    textStyle: {
                        fontSize: 16,
                        paddingVertical: 20,
                    },
                    style: {
                        justifyContent: "center",  
                    },
                });
            }

            setComment("");
            setReload(true);
        } else {
            showMessage({
                message: "Ops!",
                description: "Adicione um comentário",
                type: "info",
                titleStyle: {
                    fontSize: 25,
                    fontWeight: "bold",
                },
                textStyle: {
                    fontSize: 16,
                    paddingVertical: 20,
                },
                style: {
                    justifyContent: "center",  
                },
            });
        }
    };


    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    isLoading && comments.length === 0 ? (
                        <>
                            <SkeletonCardPhoto />
                            <SkeletonText />
                            <SkeletonSeparator />
                            <SkeletonText style={{ width: "50%" }} />
                            <SkeletonSeparator />
                        </>
                    ) : (

                    <>
                        {photoUri && <CardPhoto source={{ uri: photoUri }} />}
                        <Text style={styles.caption}>{caption}</Text>
                        <Separator style={{marginVertical: 3}} />
                        <Text style={styles.data}>{formattedDate}</Text>
                        <Separator style={{marginVertical: 3}} />
                    </>
                    
                    )
                }
                data={comments}
                renderItem={({ item }) => (
                    isLoading && reload ? (
                        <SkeletonComment />
                    ) : (
                        <CommentContainer style={{marginVertical: 10}}>
                            <CommentText>{item.content}</CommentText>
                        </CommentContainer>
                    )
                )}
                keyExtractor={(item) => item._id}
                onEndReached={handleScrollEnd}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isLoading ? (
                        <LoadMoreIndicator>
                            <ActivityIndicator size="small" color="#000" />
                        </LoadMoreIndicator>
                    ) : null
                }
                ListEmptyComponent={
                    !isLoading ? <Text>Sem comentários para exibir.</Text> : null
                }
                refreshControl={
                    <RefreshControl
                        refreshing={reload}
                        onRefresh={() => setReload(true)}
                    />
                }
                key={`${reload}`}
            />
            <View>
                <Input
                    placeholder="Digite seu comentário..."
                    value={comment}
                    onChangeText={setComment}
                    multiline
                />
                <SubmitButton onPress={handleSubmit}>
                    <ButtonText>Comentar</ButtonText>
                </SubmitButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    caption: {
        fontSize: 16,
        marginVertical: 10,
        color: "#333",
        paddingHorizontal: 5,
    },
    data:{
        fontSize: 12,
        marginVertical: 10
    },
    input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
});

export default Messages;
