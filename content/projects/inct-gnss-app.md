---
id: inct-gnss-app
title: INCT GNSS App
description: Aplicação Android para coleta e processamento de dados GNSS brutos em tempo real, com geração de arquivos RINEX e Posicionamento por Ponto Simples (PPS)
featured: true
date: 2021-06-01
technologies:
  - Java
  - Android SDK
  - GNSS/GPS
  - RINEX 3.04
  - Google Maps API
  - Método dos Mínimos Quadrados (MMQ)
  - Servidor SUPL
  - Geocoding
images:
  - /images/projects/inct-gnss-app.png
---

## Visão Geral

Aplicação Android desenvolvida durante pesquisa de mestrado em Ciências Cartográficas na UNESP. O INCT-GNSS-APP é uma ferramenta científica completa para coleta de dados GNSS brutos, geração de arquivos RINEX e processamento de posicionamento em tempo real utilizando o método de Posicionamento por Ponto Simples (PPS).

## Funcionalidades Principais

### Coleta de Dados GNSS Brutos

- Coleta em tempo real de dados brutos de múltiplas constelações GNSS
- Geração de arquivos de dados brutos compatíveis com formato do GNSS Analysis App
- Armazenamento de observáveis de todas as constelações e frequências disponíveis
- Interface intuitiva para monitoramento da coleta em tempo real

### Geração de Arquivo RINEX

- **Geração em tempo real** de arquivos RINEX de observação na versão 3.04
- Inclusão de observáveis de **pseudodistância** e **fase da onda portadora** na frequência L1
- Compatibilidade com padrões internacionais de intercâmbio de dados GNSS
- Cabeçalho RINEX preenchido automaticamente com coordenadas cartesianas

### Posicionamento por Ponto Simples (PPS) em Tempo Real

O aplicativo implementa o método de PPS em tempo real com as seguintes características:

- **Método de recepção comum** para cálculo de pseudodistâncias
- **Ajustamento pelo Método dos Mínimos Quadrados (MMQ)**
- Utilização de pseudodistâncias na frequência L1 da constelação GPS
- **Integração com Google Maps** para visualização de posições

#### Coordenada Inicial de Referência

- Solicitação automática da última localização conhecida do dispositivo
- Utilização da API 23 do Android para obter localização de maior acurácia
- Fontes: chipset GNSS, rede de telefonia móvel ou WiFi
- Marcador azul no mapa com raio igual à precisão horizontal
- Conversão para coordenadas cartesianas para uso no ajustamento

#### Obtenção de Efemérides

- Download automático de efemérides transmitidas via Internet
- Utilização do **servidor SUPL do Google**
- Coordenada inicial enviada ao servidor para obtenção das efemérides

### Configurações Avançadas

O aplicativo oferece configurações personalizáveis para o processamento:

- **Ângulo mínimo de elevação** dos satélites
- **Modelos de correção ionosférica** (opcional)
- **Modelos de correção troposférica** (opcional)
- **Coordenada de referência** customizável para o processamento
- **Função de ponderação** para o ajustamento
- **Teste Chi-Quadrado** para validação estatística

### Visualização e Resultados

- **Apresentação textual** dos resultados de cada época processada
- **Marcador vermelho** no mapa Google Maps para cada posição estimada
- **Geocoding reverso** para obtenção do endereço associado a cada coordenada
- Visualização em tempo real do processamento

## Arquivos Gerados

Ao finalizar o processamento, o INCT-GNSS-APP cria um **arquivo ZIP** contendo:

1. **Dados GNSS brutos** no formato do GNSS Analysis App (texto)
2. **Arquivo RINEX** de observação versão 3.04 para GPS (L1)
3. **Resultados do PPS** em formato CSV
4. **Coordenadas dos satélites** utilizados no PPS
5. **Resíduos do ajustamento** pelo MMQ
6. **Arquivo KML** com coordenadas para visualização em Google Earth
7. **Efemérides SUPL** utilizadas (binário)
8. **Configurações** definidas para execução (binário)
9. **Dados GNSS brutos** de todas as constelações e frequências (binário)

### Arquivo CSV de Resultados

O arquivo CSV gerado contém:

**Seção de Cabeçalho** (linhas iniciadas com "#"):

- Modelos de correção ionosférica e troposférica aplicados
- Máscara de elevação utilizada
- Função de ponderação do ajustamento
- Informações do teste Chi-Quadrado

**Seção de Dados** (para cada época processada):

- Tempo GPS
- Número de satélites utilizados e lista dos satélites
- Coordenadas geocêntricas cartesianas (X, Y, Z) e desvios-padrão
- Coordenadas geodésicas (latitude, longitude, altitude) no WGS 84
- Erro do relógio do receptor (segundos e metros)
- Variância a posteriori do ajustamento
- Resultado do teste Chi-Quadrado

## Compartilhamento e Integração

- **Compartilhamento nativo** do arquivo ZIP via interface Android
- **Upload para banco de dados em nuvem** (opcional)
- Formato de arquivo compatível com ferramentas de pós-processamento
- Integração com fluxos de trabalho de pesquisa científica

## Aplicação Científica

- Desenvolvido como parte da [dissertação de mestrado](http://hdl.handle.net/11449/243430) em Ciências Cartográficas (UNESP)
- Ferramenta para avaliação da qualidade de medidas GNSS em smartphones Android
- Utilizado em pesquisas sobre posicionamento com dispositivos de baixo custo
- Base para análises estatísticas e validação de algoritmos de posicionamento
- Leia mais detalhes técnicos na [dissertação completa](http://hdl.handle.net/11449/243430)

## Impacto Acadêmico

- Contribuiu para publicações científicas sobre GNSS em smartphones
- Facilitou coleta e processamento de dados para pesquisadores
- Demonstrou viabilidade de posicionamento científico com dispositivos móveis
- Ferramenta de código aberto para comunidade acadêmica
