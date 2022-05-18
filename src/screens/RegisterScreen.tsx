import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useEffect } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { WhiteLogo } from '../componts/WhiteLogo'
import { AuthContext } from '../context/AuthContext'
import { useForm } from '../hooks/useForm'
import { loginStyles } from '../theme/loginTheme'

interface Props extends StackScreenProps<any, any> { } //interface para extraer navigation

export const RegisterScreen = ({ navigation }: Props) => {

  const {signUp, errorMessage, removeError} = useContext(AuthContext);

  const { email, password, onChange, name } = useForm({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {

    if (errorMessage.length === 0) return;

    Alert.alert(
      'Registro incorrecto', errorMessage, [{ text: 'Ok', onPress: removeError }] //Limpiar el error para que vuelva a disparar de nuevo el alert
    );


  }, [errorMessage])

  const onRegister = () => {
    console.log({ email, password, name});
    Keyboard.dismiss() //ocultamos el teclado
    signUp({
      nombre: name,
      correo: email,
      password
    });
  }

  return (
    <>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#5856D6' }}
        behavior={(Platform.OS === 'ios') ? 'padding' : 'height'} //para qe el teclado no tape a los componentes
      >

        <View style={loginStyles.formContainer}>
          {/* Keyboard avoid view */}
          <WhiteLogo />

          <Text style={loginStyles.title}>Crear Cuenta</Text>

          <Text style={loginStyles.label}>Nombre:</Text>

          <TextInput
            placeholder='Ingrese su nombre:'
            placeholderTextColor='rgba(255,255,255,0.4)'
            underlineColorAndroid="white" //al enfoque pone en white la linea del input,solo se aplica para andorid por eso el estilo simultanio con corchetes en style abajo
            style={[
              loginStyles.inputField,
              (Platform.OS === 'ios') && loginStyles.inputFieldIOS
            ]}
            selectionColor='white' //al seleccionar el texto

            onChangeText={(value) => onChange(value, 'name')}
            value={name}
            onSubmitEditing={onRegister} //es para que el boton del teclado virtual pueda llamar a la funcion

            autoCapitalize='words' //capitalizar palabras
            autoCorrect={false}
          />

          <Text style={loginStyles.label}>Email:</Text>

          <TextInput
            placeholder='Ingrese su email:'
            placeholderTextColor='rgba(255,255,255,0.4)'
            keyboardType='email-address'
            underlineColorAndroid="white" //al enfoque pone en white la linea del input,solo se aplica para andorid por eso el estilo simultanio con corchetes en style abajo
            style={[
              loginStyles.inputField,
              (Platform.OS === 'ios') && loginStyles.inputFieldIOS
            ]}
            selectionColor='white' //al seleccionar el texto

            onChangeText={(value) => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onRegister} //es para que el boton del teclado virtual pueda llamar a la funcion

            autoCapitalize='none'
            autoCorrect={false}
          />

          <Text style={loginStyles.label}>Password:</Text>

          <TextInput
            placeholder='******'
            placeholderTextColor='rgba(255,255,255,0.4)'
            underlineColorAndroid="white" //al enfoque pone en white la linea del input,solo se aplica para andorid por eso el estilo simultanio con corchetes en style abajo
            style={[
              loginStyles.inputField,
              (Platform.OS === 'ios') && loginStyles.inputFieldIOS
            ]}
            selectionColor='white' //al seleccionar el texto

            onChangeText={(value) => onChange(value, 'password')}
            value={password}

            onSubmitEditing={onRegister} //es para el boton del teclado virtual
            secureTextEntry //para que el caracter del pass se valla ocultando
          />

          {/* Boton login */}
          <View style={loginStyles.buttonContainer}>

            {/* El Navigation.replace() es para destruir la navegation a la pantalla anterior, solo queda crear boton para ir a una pantalla anterior */}

            <TouchableOpacity activeOpacity={0.8} style={loginStyles.button} onPress={() => navigation.replace('LoginScreen')}>
              <Text style={loginStyles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
          </View>

          {/* Crar una nueva cuenta */}

          <TouchableOpacity
            onPress={() => navigation.replace('LoginScreen')}
            activeOpacity={0.8}
            style={loginStyles.buttonReturn}
          >

            <Text style={loginStyles.buttonText}>Login</Text>

          </TouchableOpacity>
        
        </View>

      </KeyboardAvoidingView>
    </>
  )
}
