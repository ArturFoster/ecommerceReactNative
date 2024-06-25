import { Text, TouchableOpacity, View, Image, TextInput, KeyboardAvoidingView } from "react-native";
import { styles } from './styles';
import Janela from "../../components/Janela";
import DisplayItem from "../../components/DisplayItem";
import Checkbox from "../../components/Checkbox";
import Button from "../../components/Button";
import { Item, ItemEquipment } from "../../types";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { postItem } from "../../services/Api/api";

export default function CriarProdutos() {


    const [isArmorChecked, setIsArmorChecked] = useState<boolean>(false);
    const [isMaterialChecked, setIsMaterialChecked] = useState<boolean>(false);


    const [novoItem, setItem] = useState<Item>({
        img: '',
        name: '',
        description: '',
        price: 0,
        type: '',
    });

    const [novoItemEquipment, setItemEquipment] = useState<ItemEquipment>({
        img: '',
        name: '',
        description: '',
        price: 0,
        type: '',
        metadata: {
            phy_defense: 0,
            magic_defense: 0,
            durability: 0
        }
    });


    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const manipResult = await ImageManipulator.manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: 400 } }],
                    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
                );

                const base64 = await FileSystem.readAsStringAsync(
                    manipResult.uri,
                    { encoding: FileSystem.EncodingType.Base64 }
                );
                setItem({ ...novoItem, img: base64 });
            }
        } catch (error) {
            console.error("Erro ao selecionar ou manipular a imagem:", error);
        }
    };

    const handleArmorCheck = () => {
        setIsArmorChecked(!isArmorChecked);
        if (!isArmorChecked) {
            setIsMaterialChecked(false);
            setItemEquipment({ ...novoItemEquipment, type: 'armadura' });
        }
    };

    const handleMaterialCheck = () => {
        setIsMaterialChecked(!isMaterialChecked);
        if (!isMaterialChecked) {
            setIsArmorChecked(false);
            setItemEquipment({ ...novoItemEquipment, type: 'material' });
        }
    };

    const cancelaItem = () => {
        setItemEquipment({
            img: '',
            name: '',
            description: '',
            price: 0,
            type: '',
            metadata: {
                phy_defense: 0,
                magic_defense: 0,
                durability: 0
            }
        })
    }

    const salvaItem = () => {
        if (novoItemEquipment.type === 'material') {
            setItem(novoItem);
            let formData = new FormData();
            formData = {...formData , ...novoItem};
            postItem(formData);
            cancelaItem();
            return;
        }
            setItem(novoItemEquipment);
            let formData = new FormData();
            formData = {...formData , ...novoItemEquipment};
            postItem(formData);
            cancelaItem();
            return;
    }

    console.log(novoItemEquipment);

    return (
        <View style={styles.container}>
            <View style={styles.janela}>
                <Janela header="Criar Produtos" height={700} width={"90%"}>
                    <KeyboardAvoidingView
                        style={styles.todos}
                        behavior="height">

                        <DisplayItem itemImage={novoItem.img} onPress={pickImage} />
                        <View>
                            <Text>Nome: </Text>
                            <TextInput
                                style={styles.inputName}
                                onChangeText={e => setItemEquipment({ ...novoItemEquipment, name: e })}
                                value={novoItemEquipment.name} />
                            <Text>Descrição: </Text>
                            <TextInput
                                style={styles.inputDescription}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={text => setItemEquipment({ ...novoItemEquipment, description: text })}
                                value={novoItemEquipment.description} />
                        </View>
                        <View style={styles.tipo}>

                            <View>
                                <Text>Tipo: </Text>
                                <Checkbox label='Armadura' checked={isArmorChecked} onChange={handleArmorCheck} />
                                <Checkbox label='Material' checked={isMaterialChecked} onChange={handleMaterialCheck}
                                />
                            </View>

                            <View style={styles.inputView}>
                                <Text>Preço: </Text>
                                <TextInput
                                    placeholder="R$: "
                                    keyboardType="numeric"
                                    style={styles.input}
                                    onChangeText={e => setItemEquipment({ ...novoItemEquipment, price: Number(e) })}
                                    value={String(novoItemEquipment.price)} />
                            </View>
                        </View>

                        <View
                            style={isArmorChecked ?
                                styles.outerInfoBox : styles.outerInfoBoxDisabled} pointerEvents={
                                    isArmorChecked ?
                                        'auto' : 'none'}
                        >
                            <View style={styles.infoBox}>
                                <View style={styles.inputBox}>
                                    <Text>Defesa Mágica: </Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        style={styles.input}
                                        onChangeText={e => setItemEquipment({
                                            ...novoItemEquipment,
                                            metadata: { ...novoItemEquipment.metadata, magic_defense: Number(e) }
                                        })}
                                        value={String(novoItemEquipment.metadata.magic_defense)} />
                                </View>
                                <View style={styles.inputBox}>
                                    <Text>Defesa Física: </Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        style={styles.input}
                                        onChangeText={e => setItemEquipment({
                                            ...novoItemEquipment,
                                            metadata: { ...novoItemEquipment.metadata, phy_defense: Number(e) }
                                        })}
                                        value={String(novoItemEquipment.metadata.phy_defense)} />
                                </View>
                                <View style={styles.inputBox}>
                                    <Text>Durabilidade: </Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        style={styles.input}
                                        onChangeText={e => setItemEquipment({
                                            ...novoItemEquipment,
                                            metadata: { ...novoItemEquipment.metadata, durability: Number(e) }
                                        })}
                                        value={String(novoItemEquipment.metadata.durability)} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.botoes}>
                            <Button title='Cancelar' onPress={cancelaItem} />
                            <Button title='Salvar' onPress={salvaItem} />
                        </View>
                    </KeyboardAvoidingView>
                </Janela>
            </View>
            <View style={styles.footerContainer}>
                <View style={styles.footerContent}>
                    <TouchableOpacity style={styles.btnStart}>
                        <Image
                            source={require("../../../assets/icons/logo-98-bar 1.png")}
                        />
                        <Text style={styles.btnText}>Start</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
