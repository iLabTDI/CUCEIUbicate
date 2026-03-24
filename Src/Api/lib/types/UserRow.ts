// ---- USUARIOS 
export type UserRow = {
    id: number;                    // PK auto-increment (manejado por PHP)
    int_user_code: number;         // Código estudiantil (555555555)
    var_email: string;
    var_password: string;
    var_degree_code: string;
    var_name: string;
    var_lastnames: string;
    var_username: string;
    // control de acceso (alumnos, academicos, externos )
    var_user_type: string;
}