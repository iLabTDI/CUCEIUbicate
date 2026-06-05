import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Option {
    label: string;
    action: () => void;
}

interface Props {
    options: Option[];
}

export const CustomDropdownMenu = ({ options }: Props) => {
    const [visible, setVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const anchorRef = useRef<View>(null);

    const openMenu = () => {
        anchorRef.current?.measureInWindow((x, y, width, height) => {
            setMenuPosition({
                top: y + height + 8,
                right: 0,
            });
            setVisible(true);
        });
    };

    const handleSelect = (option: Option) => {
        setVisible(false);
        option.action();
    };

    return (
        <>
            <TouchableOpacity
                ref={anchorRef}
                onPress={openMenu}
                style={styles.headerAction}
                activeOpacity={0.7}
            >
                <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    style={styles.headerActionBg}
                >
                    <FontAwesome name="ellipsis-v" size={16} color="#ffffff" />
                </LinearGradient>
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />

                <View style={[styles.dropdownMenu, { top: menuPosition.top, right: 16 }]}>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={option.label}
                            onPress={() => handleSelect(option)}
                            style={[
                                styles.dropdownRow,
                                index === options.length - 1 && styles.dropdownRowLast,
                            ]}
                            activeOpacity={0.6}
                        >
                            <Text style={styles.dropdownText}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    headerAction: {
        marginLeft: 12,
    },
    headerActionBg: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownMenu: {
        position: 'absolute',
        width: 160,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
        overflow: 'hidden',
    },
    dropdownRow: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f0f0',
    },
    dropdownRowLast: {
        borderBottomWidth: 0,
    },
    dropdownText: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500',
    },
});