import * as React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

// Nova paleta de cores baseada no site Objetivo Sorocaba
const colors = {
    primary: '#002776', // Azul escuro (principal)
    secondary: '#FFD700', // Amarelo (destaques)
    background: '#f4f6f6', // Fundo claro
    cardBackground: '#fff', // Branco para os cartões
    textPrimary: '#333', // Cinza escuro para textos principais
    textSecondary: '#666', // Cinza médio para textos secundários
};

export default function WarningsScreen() {
    const Avisos = [
        { id: 1, nome: 'Nova Eletiva disponível', descricao: 'Confira as novas opções de eletivas e faça sua inscrição antes do prazo.' },
        { id: 2, nome: 'Lembrete: Reunião de pais', descricao: 'A reunião de pais ocorrerá na próxima semana. Verifique os horários disponíveis.' },
        { id: 3, nome: 'Resultados das avaliações', descricao: 'Os resultados das avaliações do 1º bimestre já estão disponíveis no portal.' },
        { id: 4, nome: 'Evento Cultural na Escola', descricao: 'Não perca o evento cultural com apresentações de alunos e convidados especiais!' },
        { id: 5, nome: 'Alteração no Calendário Escolar', descricao: 'Atenção para a alteração nas datas de alguns feriados e recessos. Consulte o novo calendário.' },
        { id: 6, nome: 'Oficina de Programação para Iniciantes', descricao: 'Inscreva-se na oficina gratuita de programação para iniciantes. Vagas limitadas!' },
        { id: 7, nome: 'Campanha de Doação de Livros', descricao: 'Participe da nossa campanha de doação de livros para a biblioteca da escola.' },
        { id: 8, nome: 'Inscrições Abertas para o Grêmio Estudantil', descricao: 'Se você tem ideias e quer representar seus colegas, inscreva-se para o Grêmio Estudantil!' },
        { id: 9, nome: 'Aviso sobre o Transporte Escolar', descricao: 'Informações importantes sobre o funcionamento do transporte escolar nos próximos dias.' },
        { id: 10, nome: 'Melhorias na Infraestrutura da Escola', descricao: 'Estamos realizando melhorias em algumas áreas da escola para seu maior conforto.' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={Avisos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.title}>{item.nome}</Title>
                            <Paragraph style={styles.description}>{item.descricao}</Paragraph>
                        </Card.Content>
                    </Card>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    card: {
        backgroundColor: colors.cardBackground,
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 8,
        borderLeftWidth: 5, // Adicionando um detalhe na lateral do card
        borderLeftColor: colors.secondary, // Amarelo para destacar
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary, // Azul escuro nos títulos
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 5,
    },
    separator: {
        height: 15,
    },
});
