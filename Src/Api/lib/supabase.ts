//este es el archivo de conexion a la bdd

import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto'
import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

//modifica estas constantes apra conectar tu base de pruebas
//ANTIGUA
//https://igisxgsxsygffpxlezvp.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnaXN4Z3N4c3lnZmZweGxlenZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzMTE5MjEsImV4cCI6MjA0NDg4NzkyMX0.CHtEIeSH58oZTSVVpCPOli__bWae4tX5Xko0trpzqcc

//Nueva bd CUCEI la que era Oficial pero petada https://vyjelpzzqxpwdeywzrlr.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5amVscHp6cXhwd2RleXd6cmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NzkyNjQsImV4cCI6MjA0NjI1NTI2NH0.6gxa-64iU0jZ8q1uWYNKblaFlonvANzsbEhGwT0C4hE


//Nueva bd TESTING 18/01/25 https://ieyytowzcqypnbcfzhdu.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleXl0b3d6Y3F5cG5iY2Z6aGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMzA2MDgsImV4cCI6MjA1MjgwNjYwOH0.RQEYyXctXFOmoEcJP4A6M6N_6s9ErBvHLuZwov89Yzg

const supabaseUrl = 'https://ieyytowzcqypnbcfzhdu.supabase.co';  //https://zyzkfthsghyynigudpsk.supabase.co (MAIN)https://pkxynuqxusbwhgjvyssq.supabase.co
//esta constante tambien
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleXl0b3d6Y3F5cG5iY2Z6aGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMzA2MDgsImV4cCI6MjA1MjgwNjYwOH0.RQEYyXctXFOmoEcJP4A6M6N_6s9ErBvHLuZwov89Yzg'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })