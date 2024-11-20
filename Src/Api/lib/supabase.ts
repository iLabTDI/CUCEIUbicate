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

//Nueva bd CUCEI 3 https://vyjelpzzqxpwdeywzrlr.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5amVscHp6cXhwd2RleXd6cmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NzkyNjQsImV4cCI6MjA0NjI1NTI2NH0.6gxa-64iU0jZ8q1uWYNKblaFlonvANzsbEhGwT0C4hE

const supabaseUrl = 'https://vyjelpzzqxpwdeywzrlr.supabase.co';  //https://zyzkfthsghyynigudpsk.supabase.co (MAIN)https://pkxynuqxusbwhgjvyssq.supabase.co
//esta constante tambien
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5amVscHp6cXhwd2RleXd6cmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NzkyNjQsImV4cCI6MjA0NjI1NTI2NH0.6gxa-64iU0jZ8q1uWYNKblaFlonvANzsbEhGwT0C4hE'; 
//MAIN eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHludXF4dXNid2hnanZ5c3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNTkwMTgsImV4cCI6MjAyNTgzNTAxOH0.uBv5-70jUw0vMLk-PZ1xBOlZbhaUPLeauLLl15jUocQ
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5emtmdGhzZ2h5eW5pZ3VkcHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NzgxMzUsImV4cCI6MjAyNTE1NDEzNX0.K4_5toTOm_fgsds95GNeIgWEXyMTmtiM5I7x6bdwe-A

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })