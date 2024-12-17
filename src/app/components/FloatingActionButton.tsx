import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions
} from "react-native";
import styled from "styled-components/native";
import { showMessage } from 'react-native-flash-message';
import { useAuth } from "@/src/context/Auth";
import { launchImageLibrary } from
 'react-native-image-picker';
import { Post } from "../(tabs)/feed/(home)";
import * as ImagePicker from 'expo-image-picker';


interface FloatingActionButtonProps {
    onPress: () => void;
    postSet: Dispatch<SetStateAction<Post[]>>;
}


const InputContainer = styled.View`
    position: relative;
`;

const CharCount = styled.Text`
    position: absolute;
    right: 10px;
    bottom: 15px;
    font-size: 12px;
    color: #888;
`;

const ImagePreviewContainer = styled.View`
    position: relative;
    margin-bottom: 15px;
    align-items: center;
`;

const PreviewImage = styled.Image`
    width: 100%;
    height: 200px;
    border-radius: 10px;
`;

const RemoveImageButton = styled.TouchableOpacity`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    width: 30px;
    height: 30px;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    z-index: 1;
`;

const RemoveImageText = styled.Text`
    color: white;
    font-size: 16px;
    font-weight: bold;
`;

const FloatingButton = styled.TouchableOpacity`
    position: absolute;
    bottom: 20px;
    align-self: center;
    background-color: #007bff;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    right: 20px;
`;

const ModalOverlay = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
`;

const screenWidth = Dimensions.get('window').width;

const ModalContent = styled.View`
    background-color: white;
    width: ${screenWidth * 0.9}px;
    padding: 20px;
    border-radius: 10px;
    shadow-color: #000;
    shadow-offset: {
        width: 0;
        height: 2;
    };
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    elevation: 5;
    align-self: center;
`;

const Input = styled.TextInput`
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
    max-width: 100%;
`;

const UploadButton = styled.TouchableOpacity`
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
    align-items: center;
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

const CloseButton = styled.TouchableOpacity`
  background-color: #ccc;
  border-radius: 15px;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ postSet }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState("");
    const [media, setMedia] = useState<any>(null);
    const { create, user, setReload, reload } = useAuth(); 

    const handleUpload = async () => {
        try {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!granted) {
                showMessage({
                    message: "Ops!",
                    description: "Permissão de mídia necessária",
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
            } else{
                const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1
                });

                if (canceled) {
                    showMessage({
                        message: "Ops!",
                        description: "Operação cancelada",
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
                } else {
                    // const filename = assets[0].uri.substring(assets[0].uri.lastIndexOf('/') + 1, assets[0].uri.length);
                    // const extend = filename.split('.')[1];
                    // const formData = new FormData();

                    // formData.append('file', JSON.parse(JSON.stringify({
                    //     name: filename,
                    //     uri: assets[0].uri,
                    //     type: 'image/' + extend,
                    // })));

                    setMedia(assets[0]);
                }
            }

            // if (assetResult) {
            //     const fileInfo = {
            //         uri: assetResult.uri,
            //         name: assetResult.fileName || "upload.jpg",
            //         type: assetResult.type || "image/jpeg"
            //     };
            //     setMedia(fileInfo);
            // }

        } catch (error) {
            showMessage({
                    message: "Ops!",
                    description: "Houve um erro acessar upar mídia",
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
        
    };

    const handleSubmit = async () => {

        if (comment && media) {
            try {
                const filename = media.uri.substring(media.uri.lastIndexOf('/') + 1, media.uri.length);
                const extend = filename.split('.')[1];
                const formData = new FormData();

                formData.append('medias', JSON.parse(JSON.stringify({
                    name: filename,
                    uri: media.uri,
                    type: 'image/' + extend,
                })));

                formData.append('userId', user?.id?.toString() || '');
                formData.append('content', comment);

                const newPost = await create(formData);;

                postSet((prevPosts) => [newPost, ...prevPosts]);

                showMessage({
                    message: "Sucesso!",
                    description: "Post criado com sucesso!",
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
                setComment("");
                setMedia(null);
                setModalVisible(false);
                setReload(true);

            } catch (error) {
                showMessage({
                    message: "Ops!",
                    description: "Houve um erro ao criar o post.",
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
            

        } else {
            showMessage({
                message: "Ops!",
                description: "Adicione um comentário ou um arquivo.",
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

    const handleClose = () => {
        setComment('');
        setMedia(null);
        setModalVisible(false);
    };


    return (
        <View style={{ flex: 1 }}>
            <FloatingButton onPress={() => setModalVisible(true)}>
                <Text style={{ 
                    color: "white", 
                    fontSize: 24,
                }}>
                    +
                </Text>
            </FloatingButton>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss();
                    }}
                >
                    <ModalOverlay>
                        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <TouchableWithoutFeedback>
                                    <ModalContent>
                                        <Header>
                                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Criar Post</Text>
                                            <CloseButton onPress={handleClose}>
                                                <Text style={{ fontWeight: "bold" }}>X</Text>
                                            </CloseButton>
                                        </Header>
                                        <InputContainer>
                                            <Input
                                                placeholder="Digite seu comentário..."
                                                value={comment}
                                                onChangeText={setComment}
                                                multiline
                                                maxLength={100}
                                            />
                                            {comment.length > 0 && (
                                                <CharCount>{comment.length}/100</CharCount>
                                            )}
                                        </InputContainer>
                                        
                                        {media && (
                                            <ImagePreviewContainer>
                                                <RemoveImageButton onPress={() => setMedia(null)}>
                                                    <RemoveImageText>X</RemoveImageText>
                                                </RemoveImageButton>
                                                <PreviewImage source={{ uri: media.uri }} />
                                            </ImagePreviewContainer>
                                        )}
                                        <UploadButton onPress={handleUpload}>
                                            <Text>
                                                {media ? "Foto/Vídeo Selecionado" : "Adicionar Foto/Vídeo"}
                                            </Text>
                                        </UploadButton>
                                        <SubmitButton onPress={handleSubmit}>
                                            <ButtonText>Criar Post</ButtonText>
                                        </SubmitButton>
                                    </ModalContent>
                                </TouchableWithoutFeedback>
                            </View>
                        </KeyboardAvoidingView>
                    </ModalOverlay>
                </TouchableWithoutFeedback>
            </Modal>

        </View>
  );
};

export default FloatingActionButton;
