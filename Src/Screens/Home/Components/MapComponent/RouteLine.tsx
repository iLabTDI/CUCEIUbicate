import React, { memo, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
    Canvas,
    DashPathEffect,
    LinearGradient,
    Path,
    vec,
    BlurMask,
} from '@shopify/react-native-skia';
import {
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';

const buildPathFromArray = (points: number[][]): string => {
    return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
}

// Gradiente 
const GRADIENT_COLORS = ['#93C5FD', '#60A5FA', '#3B82F6', '#1E40AF', '#0033A0'];

// Dash interval 
const DASH_ON = 18;
const DASH_OFF = 10;
const DASH_PERIOD = DASH_ON + DASH_OFF;

interface Props {
    points: number[][];
}

export const RouteLine = ({ points }: Props) => {
    console.log("RouteLine render - points:", points);
    const progress = useSharedValue(0);

    const POINT_A = {
        x: points[0][0],
        y: points[0][1],
    }
    const POINT_B = {
        x: points.at(-1)?.[0],
        y: points.at(-1)?.[1],
    }
    const PATH_DATA = useMemo(() => buildPathFromArray(points), [points]);

    useEffect(() => {
        progress.value = withRepeat(
            // Avanza un período completo de dash → loop perfectamente continuo
            // SIN reverse (false) → siempre en la misma dirección A → B
            withTiming(DASH_PERIOD, {
                duration: 600,
                easing: Easing.linear,
            }),
            -1,
            false   // ← false = sin reversa, flujo continuo de A hacia B
        );
    }, [progress]);

    // phase negativa = las marcas se mueven "hacia adelante" en la ruta
    const animatedPhase = useDerivedValue(() => -progress.value);

    return (
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">

            {/* Capa 1: Borde exterior oscuro */}
            <Path
                path={PATH_DATA}
                style="stroke"
                strokeWidth={14}
                strokeCap="round"
                strokeJoin="round"
                color="#111827"
            />

            {/* Capa 2: Sombra azul difusa */}
            <Path
                path={PATH_DATA}
                style="stroke"
                strokeWidth={14}
                strokeCap="round"
                strokeJoin="round"
                color="#0033A0"
                opacity={0.4}
            >
                <BlurMask blur={10} style="normal" />
            </Path>

            {/* Capa 3: Gradiente principal animado  */}
            <Path
                path={PATH_DATA}
                style="stroke"
                strokeWidth={8}
                strokeCap="round"
                strokeJoin="round"
            >
                <LinearGradient
                    start={vec(POINT_A.x, POINT_A.y)}
                    end={vec(POINT_B.x, POINT_B.y)}
                    colors={GRADIENT_COLORS}
                />
                <DashPathEffect
                    intervals={[DASH_ON, DASH_OFF]}
                    phase={animatedPhase}
                />
            </Path>

            {/* Capa 4: Glow azul animado */}
            <Path
                path={PATH_DATA}
                style="stroke"
                strokeWidth={10}
                strokeCap="round"
                strokeJoin="round"
                color="#3B82F6"
                opacity={0.3}
            >
                <BlurMask blur={6} style="normal" />
                <DashPathEffect
                    intervals={[DASH_ON, DASH_OFF]}
                    phase={animatedPhase}
                />
            </Path>

            {/* Capa 5: Brillo blanco interior */}
            <Path
                path={PATH_DATA}
                style="stroke"
                strokeWidth={2.5}
                strokeCap="round"
                strokeJoin="round"
                color="#FFFFFF"
                opacity={0.9}
            >
                <DashPathEffect
                    intervals={[DASH_ON - 5, DASH_OFF + 5]}
                    phase={animatedPhase}
                />
            </Path>

        </Canvas>
    );
};

export default memo(RouteLine);