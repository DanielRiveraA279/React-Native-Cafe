import React, { useContext, useEffect } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { AuthContext } from '../context/AuthContext';
import { Background } from '../componts/Background'
import { WhiteLogo } from '../componts/WhiteLogo'
import { useForm } from '../hooks/useForm'
import { loginStyles } from '../theme/loginTheme'

interface Props extends StackScreenProps<any, any> { } //interface para extraer navigation

export const LoginScreen = ({ navigation }: Props) => {


  const { signIn, errorMessage, removeError } = useContext(AuthContext);

  const { email, password, onChange } = useForm({
    email: '',
    password: ''
  });

  useEffect(() => {

    if (errorMessage.length === 0) return;

    Alert.alert(
      'Login incorrecto', errorMessage, [{ text: 'Ok', onPress: removeError }] //Limpiar el error para que vuelva a disparar de nuevo el alert
    );


  }, [errorMessage])

  const onLogin = () => {
    console.log({ email, password });
    Keyboard.dismiss() //ocultamos el teclado

    signIn({ correo: email, password });

  }

  return (
    <>
      {/* Background */}
      <Background />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={(Platform.OS === 'ios') ? 'padding' : 'height'} //para qe el teclado no tape a los componentes
      >

        <View style={loginStyles.formContainer}>
          {/* Keyboard avoid view */}
          <WhiteLogo />

          <Text style={loginStyles.title}>Login</Text>
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
            onSubmitEditing={onLogin} //es para que el boton del teclado virtual pueda llamar a la funcion

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

            onSubmitEditing={onLogin} //es para el boton del teclado virtual
            secureTextEntry //para que el caracter del pass se valla ocultando
          />

          {/* Boton login */}
          <View style={loginStyles.buttonContainer}>

            {/* El Navigation.replace() es para destruir la navegation a la pantalla anterior, solo queda crear boton para ir a una pantalla anterior */}

            <TouchableOpacity activeOpacity={0.8} style={loginStyles.button} onPress={() => onLogin()}>
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Crar una nueva cuenta */}
          <View style={loginStyles.newUserContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('RegisterScreen')}
            >
              <Text style={loginStyles.buttonText}>Nueva Cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </>
  )
}
