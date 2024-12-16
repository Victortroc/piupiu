import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    RefreshControl
} from "react-native";
import { useAuth } from "@/src/context/Auth";
import FeedCard from "../../../components/Card";
import FloatingActionButton from "../../../components/FloatingActionButton";
import api, { apiBackend } from "../../../../services/api";
import { router } from "expo-router";


export interface Post {
    postId: string;
    userId: string;
    username: string;
    content: string;
    mediaUrls: string[];
    createdAt: string;
    __v: number;
};


export default function Feed() {
    const { signOut, reload, setReload } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    const closeModal = () => setModalOpen(false);

    const fetchPosts = async (pageNumber = 1, isRefresh = false) => {

        if (!hasMorePosts || (isFetchingMore && pageNumber > 1)) return;

        setIsFetchingMore(true);

        try {
            const response = await api.get<Post[]>(`/posts?page=${pageNumber}&limit=10`);
            const fetchedPosts = response.data;

            if (fetchedPosts.length === 0) {
                setHasMorePosts(false);
            } else {
                setPosts((prevPosts) => (pageNumber === 1 ? fetchedPosts : [...prevPosts, ...fetchedPosts]));
                setPage(pageNumber);
            }
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
        } finally {
            setIsFetchingMore(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(1);
    }, []);

    useEffect(() => {
        if (reload) {
            // setPosts([]);
            setHasMorePosts(true);
            setPage(1);
            fetchPosts(1);
            setReload(false);
        }
    }, [reload]);

    const renderPost = ({ item }: { item: Post }) => (
        <FeedCard
            key={item.postId}
            photoUri={apiBackend + item.mediaUrls[0]}
            caption={item.content}
            postId={item.postId}
            data={item.createdAt}
        />
    );

    const handleLoadMore = () => {
        if (!isFetchingMore && hasMorePosts) {
            fetchPosts(page + 1);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    
    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.postId}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isFetchingMore ? (
                        <ActivityIndicator size="small" color="#0000ff" style={{ margin: 10 }} />
                    ) : null
                }
                refreshControl={
                    <RefreshControl
                        refreshing={reload}
                        onRefresh={() => setReload(true)}
                    />
                }
                key={`${reload}`}
            />

            <FloatingActionButton onPress={() => setModalOpen(true)} postSet={setPosts} />

            <Modal
                visible={isModalOpen}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Criar Post</Text>
                                <Text>Comente algo e adicione uma foto ou vídeo!</Text>
                                <Text style={{ marginTop: 20 }} onPress={closeModal}>
                                    Fechar
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
});
