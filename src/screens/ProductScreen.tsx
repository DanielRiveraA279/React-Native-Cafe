import React, { useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Image } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; //para la camara

import { ProductsStackParams } from '../navigator/ProductsNavigator'
import useCategories from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'> { };

export const ProductScreen = ({ route, navigation }: Props) => {

  const { id = '', name = '' } = route.params;

  const { categories } = useCategories();
  const { loadProductById, addProduct, updateProduct, uploadImage } = useContext(ProductsContext);

  const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: ''
  });
  const [tempUri, setTempUri] = useState<string>();

  useEffect(() => {
    //si el nombre cambia, volvemos a ejecutar la modificacion del titulo y le asignamos el nombre que cambio
    navigation.setOptions({
      title: (nombre) ? nombre : 'Sin nombre del producto'
    })
  }, [nombre]);

  useEffect(() => {
    loadProduct();
  }, [])

  const loadProduct = async () => {
    if (id.length === 0) return;
    const product = await loadProductById(id);
    setFormValue({
      _id: id,
      categoriaId: product.categoria._id,
      img: product.img || '',
      nombre
    });
  }

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      //actualizar un producto
      updateProduct(categoriaId, nombre, id);
    } else {
      //agregar un nuevo producto
      const tempCategoriaId = categoriaId || categories[0]._id; //asignamos una categoria por defecto
      const newProduct = await addProduct(tempCategoriaId, nombre); //traemos el nuevo producto
      onChange(newProduct._id, '_id'); //y asignamos el _id de ese producto al objeto que se desestructura en useForm
    }
  }

  const takePhoto = () => {
    launchCamera({
      mediaType: 'photo', //tipo media type
      quality: 0.5 //calidad
    }, (resp) => {
      if (resp.didCancel) return; //si es cancelada la fotografia
      if (!resp.assets?.[0].uri) return; //si no viene la dir de la fotografia

      setTempUri(resp.assets?.[0].uri); //guardamos la direccion de la fotografia
      uploadImage(resp, form._id)
    });
  }

  const takePhotoFromGallery = () => {
    launchImageLibrary({
      mediaType: 'photo', //tipo media type
      quality: 0.5 //calidad
    }, (resp) => {
      if (resp.didCancel) return; //si es cancelada la fotografia
      if (!resp.assets?.[0].uri) return; //si no viene la dir de la fotografia


      setTempUri(resp.assets?.[0].uri); //guardamos la direccion de la fotografia
      uploadImage(resp, form._id)
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del product:</Text>
        <TextInput
          placeholder='Producto'
          style={styles.textInput}
          value={nombre}
          onChangeText={(value) => onChange(value, 'nombre')}
        />

        <Text style={styles.label}>Categoria:</Text>
        <Picker
          selectedValue={categoriaId}
          onValueChange={(value) => onChange(value, 'categoriaId')}
          style={{
            backgroundColor: '#5856D6',
            marginBottom: 15,
          }}
        >
          {
            categories.map(c => (
              <Picker.Item label={c.nombre} value={c._id} key={c._id} />
            ))
          }
        </Picker>

        <Button
          title="Guardar"
          onPress={saveOrUpdate}
          color="#5856D6"
        />

        {
          (_id.length > 0) && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <Button
                title="Cámara"
                onPress={takePhoto}
                color="#5856D6"
              />
              <View style={{ width: 10 }} />
              <Button
                title="Galería"
                onPress={takePhotoFromGallery}
                color="#5856D6"
              />
            </View>
          )
        }


        {
          (img.length > 0 && !tempUri) && (
            <Image
              source={{ uri: img }}
              style={{
                marginTop: 20,
                width: '100%',
                height: 300
              }}
            />
          )
        }

        {/*TODO: Mostrar imagen temporal */}
        {
          (tempUri) && (
            <Image
              source={{ uri: tempUri }}
              style={{
                marginTop: 20,
                width: '100%',
                height: 300
              }}
            />
          )
        }

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20
  },
  label: {
    fontSize: 18
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    marginTop: 5,
    marginBottom: 10
  }
})
