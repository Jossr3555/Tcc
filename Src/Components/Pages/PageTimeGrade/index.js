import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../DataBase/DataLauncher';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PersonUser } from '../PageLogin';

const PRIMARY_BLUE = '#2979FF';
const LIGHT_GRAY = '#F5F5F5';
const TEXT_DARK = '#212121';
const TEXT_LIGHT = '#fff';
const BORDER_COLOR = '#E0E0E0';
const FILTER_BUTTON_COLOR = '#E0E0E0';
const FILTER_BUTTON_ACTIVE_COLOR = PRIMARY_BLUE;
const FILTER_BUTTON_TEXT_COLOR = '#616161';
const FILTER_BUTTON_TEXT_ACTIVE_COLOR = TEXT_LIGHT;

const DAY_ORDER = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const ACTIVITY_TYPES = ['Todos', 'Eletiva', 'Plantão'];

const DayHeader = ({ day, expanded, onPress }) => (
    <TouchableOpacity style={styles.dayHeader} onPress={onPress}>
        <Text style={styles.dayTitle}>{day}</Text>
        <Icon
            name={expanded ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={24}
            color={TEXT_DARK}
        />
    </TouchableOpacity>
);

const ActivityCard = ({ atividade }) => (
    <View style={styles.activityCard}>
        <View style={styles.cardInfo}>
            <Text style={styles.activityName}>{atividade.Nome}</Text>
            <Text style={styles.activityDetails}>
                {atividade.tipo} • Professor: {atividade.supervisor}
            </Text>
            <View style={styles.timeContainer}>
                <Icon name="schedule" size={16} color={PRIMARY_BLUE} style={styles.timeIcon} />
                <Text style={styles.activityTime}>{atividade.HorarioInicio} - {atividade.HorarioFim}</Text>
            </View>
        </View>
    </View>
);

const FilterButton = ({ type, active, onPress }) => (
    <TouchableOpacity
        style={[
            styles.filterButton,
            active && styles.filterButtonActive,
        ]}
        onPress={() => onPress(type)}
    >
        <Text
            style={[
                styles.filterButtonText,
                active && styles.filterButtonTextActive,
            ]}
        >
            {type}
        </Text>
    </TouchableOpacity>
);

export default function TimeGradeScreen() {
    const [atividadesInscritasRaw, setAtividadesInscritasRaw] = useState([]);
    const [atividadesFiltradas, setAtividadesFiltradas] = useState([]);
    const [expandedDays, setExpandedDays] = useState({});
    const [loading, setLoading] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState('Todos');
    const auth = getAuth();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        let unsubscribeEletivas = null;
        let unsubscribePlantoes = null;
        setLoading(true);

        const fetchUserSchedule = async () => {
            const user = auth.currentUser;
            if (!user) {
                if (isMounted.current) setLoading(false);
                return;
            }

            const userRef = doc(db, "usuarios", user.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                if (isMounted.current) setLoading(false);
                return;
            }

            const userData = userSnap.data();
            const inscritasEletivas = userData.eletivasinscrito || [];
            const inscritosPlantoes = userData.oficinasInscrito || [];

            const eletivasCollection = collection(db, 'Eletivas');
            const plantoesCollection = collection(db, 'Oficinas');

            const eletivasPromise = new Promise((resolve) => {
                unsubscribeEletivas = onSnapshot(eletivasCollection, (querySnapshot) => {
                    const list = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (
                            data.AnoDisponivel === PersonUser.ano &&
                            inscritasEletivas.includes(data.Nome)
                        ) {
                            list.push({ ...data, id: doc.id, tipo: 'Eletiva', supervisor: data.supervisor });
                        }
                    });
                    resolve(list);
                });
            });

            const plantoesPromise = new Promise((resolve) => {
                unsubscribePlantoes = onSnapshot(plantoesCollection, (querySnapshot) => {
                    const list = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (
                            data.AnoDisponivel === PersonUser.ano &&
                            inscritosPlantoes.includes(data.Nome)
                        ) {
                            list.push({
                                ...data,
                                id: doc.id,
                                tipo: 'Plantão',
                                supervisor: data.Professor, // Map "Professor" to "supervisor"
                            });
                        }
                    });
                    resolve(list);
                });
            });

            Promise.all([eletivasPromise, plantoesPromise]).then(([eletivas, plantoes]) => {
                const combined = [...eletivas, ...plantoes];
                combined.sort((a, b) => DAY_ORDER.indexOf(a.DiaSemanal.split('-')[0]) - DAY_ORDER.indexOf(b.DiaSemanal.split('-')[0]));
                if (isMounted.current) {
                    setAtividadesInscritasRaw(combined);
                    setLoading(false);
                }
            });
        };

        fetchUserSchedule();

        return () => {
            if (unsubscribeEletivas) unsubscribeEletivas();
            if (unsubscribePlantoes) unsubscribePlantoes();
        };
    }, [auth.currentUser]);

    useEffect(() => {
        if (isMounted.current) {
            let atividadesFiltradasLocal = [...atividadesInscritasRaw];
            if (filtroTipo !== 'Todos') {
                atividadesFiltradasLocal = atividadesFiltradasLocal.filter(
                    (atividade) => atividade.tipo === filtroTipo
                );
            }
            setAtividadesFiltradas(atividadesFiltradasLocal);
            setExpandedDays({});
        }
    }, [atividadesInscritasRaw, filtroTipo]);

    const handleToggleDay = (day) => {
        setExpandedDays((prevState) => ({
            ...prevState,
            [day]: !prevState[day],
        }));
    };

    const handleFiltroTipo = (tipo) => {
        setFiltroTipo(tipo);
    };

    const renderDaySchedule = ({ item: dayData }) => (
        <View style={styles.dayContainer}>
            <DayHeader day={dayData.dia} expanded={expandedDays[dayData.dia]} onPress={() => handleToggleDay(dayData.dia)} />
            {expandedDays[dayData.dia] && dayData.atividades.map((atividade) => (
                <ActivityCard key={atividade.id} atividade={atividade} />
            ))}
            {expandedDays[dayData.dia] && dayData.atividades.length === 0 && (
                <Text style={styles.noAtividades}>Nenhuma atividade neste dia.</Text>
            )}
        </View>
    );

    const keyExtractorDay = (item) => item.dia;

    const gerarGradeData = () => {
        return DAY_ORDER.map((dia) => {
            const atividadesDoDia = atividadesFiltradas.filter((atividade) => atividade.DiaSemanal.startsWith(dia));
            return { dia, atividades: atividadesDoDia };
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                {ACTIVITY_TYPES.map((tipo) => (
                    <FilterButton
                        key={tipo}
                        type={tipo}
                        active={filtroTipo === tipo}
                        onPress={handleFiltroTipo}
                    />
                ))}
            </View>

            {loading ? (
                <Text style={styles.loadingText}>Carregando horário...</Text>
            ) : (
                <FlatList
                    data={gerarGradeData()}
                    renderItem={renderDaySchedule}
                    keyExtractor={keyExtractorDay}
                    ListEmptyComponent={() => (
                        <Text style={styles.noData}>
                            {atividadesFiltradas.length === 0
                                ? 'Nenhuma atividade encontrada com o filtro aplicado.'
                                : 'Você não está inscrito em nenhuma atividade.'}
                        </Text>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LIGHT_GRAY,
        padding: 15,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    filterButton: {
        backgroundColor: FILTER_BUTTON_COLOR,
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 18,
        elevation: 1,
    },
    filterButtonActive: {
        backgroundColor: FILTER_BUTTON_ACTIVE_COLOR,
        elevation: 2,
    },
    filterButtonText: {
        color: FILTER_BUTTON_TEXT_COLOR,
        fontSize: 15,
    },
    filterButtonTextActive: {
        color: FILTER_BUTTON_TEXT_ACTIVE_COLOR,
        fontWeight: 'bold',
    },
    dayContainer: {
        marginBottom: 15,
        backgroundColor: TEXT_LIGHT,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        overflow: 'hidden',
        elevation: 2,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f8f8',
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: TEXT_DARK,
    },
    activityCard: {
        padding: 15,
        borderTopWidth: 1,
        borderColor: BORDER_COLOR,
    },
    cardInfo: {
        flexShrink: 1,
    },
    activityName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: TEXT_DARK,
        marginBottom: 7,
    },
    activityDetails: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 5,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeIcon: {
        marginRight: 5,
    },
    activityTime: {
        fontSize: 15,
        color: PRIMARY_BLUE,
        fontWeight: 'bold',
    },
    noData: {
        textAlign: 'center',
        fontSize: 16,
        color: '#757575',
        marginTop: 30,
    },
    noAtividades: {
        fontSize: 14,
        color: '#757575',
        marginTop: 10,
        fontStyle: 'italic',
        paddingHorizontal: 15,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#757575',
        marginTop: 20,
    },
});