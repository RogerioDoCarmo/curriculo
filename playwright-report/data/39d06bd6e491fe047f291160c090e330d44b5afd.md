# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cookie-consent.spec.ts >> Cookie Consent Banner >> Customize flow >> should allow toggling functional preference
- Location: tests/e2e/cookie-consent.spec.ts:236:9

# Error details

```
Error: page.goto: Navigation to "http://localhost:3000/" is interrupted by another navigation to "http://localhost:3000/pt-BR/"
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - banner [ref=e2]:
        - generic [ref=e4]:
            - button "Open menu" [ref=e5] [cursor=pointer]
            - generic [ref=e10]:
                - link "Linktree profile" [ref=e11]:
                    - /url: https://linktr.ee/rogeriodocarmo
                    - img [ref=e12]
                - generic [ref=e14]:
                    - generic [ref=e15]: Select language
                    - generic [ref=e16]: 🇧🇷
                    - combobox "Select language" [ref=e17] [cursor=pointer]:
                        - option "🇧🇷 Português (BR)" [selected]
                        - option "🇺🇸 English"
                        - option "🇪🇸 Español"
                    - generic: ▾
                - button "Toggle theme" [disabled] [ref=e18]:
                    - img "Theme" [ref=e19]: ☀️
    - main [ref=e20]:
        - region "Hero section" [ref=e22]:
            - generic [ref=e23]:
                - generic [ref=e24]:
                    - paragraph [ref=e25]: Olá, eu sou
                    - heading "Rogério do Carmo" [level=1] [ref=e26]
                    - paragraph [ref=e27]: Desenvolvedor Frontend Mobile React Native
                    - generic [ref=e28]:
                        - img "UNESP Logo" [ref=e29]
                        - generic [ref=e30]:
                            - paragraph [ref=e31]: Bacharel em Ciência da Computação
                            - paragraph [ref=e32]: Mestre em Ciências Cartográficas
                            - paragraph [ref=e33]: UNESP
                    - generic [ref=e34]:
                        - paragraph [ref=e35]: Dissertação de mestrado completa
                        - link "Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android" [ref=e37]:
                            - /url: http://hdl.handle.net/11449/243430
                            - img [ref=e38]
                            - text: Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android
                        - link "Baixar dissertação de mestrado em PDF" [ref=e43]:
                            - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                            - img [ref=e44]
                            - generic [ref=e46]: Baixar Dissertação (PDF)
                    - generic [ref=e47]:
                        - img "Company Logo" [ref=e48]
                        - generic [ref=e49]:
                            - paragraph [ref=e50]: Desenvolvedor Mobile Sênior
                            - paragraph [ref=e51]: Atual
                    - generic [ref=e52]:
                        - link "Ver Meu Trabalho" [ref=e53]:
                            - /url: "#projects"
                        - link "Entre em Contato" [ref=e54]:
                            - /url: mailto:contato@rogeriodocarmo.com
                            - img [ref=e55]
                            - text: Entre em Contato
                    - paragraph [ref=e58]:
                        - link "contato@rogeriodocarmo.com" [ref=e59]:
                            - /url: mailto:contato@rogeriodocarmo.com
                - img "Rogério do Carmo — Mobile React Native Developer" [ref=e62]
        - tablist "Escolha um Caminho" [ref=e65]:
            - generic [ref=e66]:
                - tab "Profissional" [selected] [ref=e67] [cursor=pointer]:
                    - img [ref=e68]
                    - text: Profissional
                - tab "Acadêmico" [ref=e70] [cursor=pointer]:
                    - img [ref=e71]
                    - text: Acadêmico
        - region "Experiência Profissional experiência" [ref=e76]:
            - generic [ref=e77]:
                - heading "Experiência Profissional" [level=2] [ref=e78]
                - generic [ref=e79]:
                    - article [ref=e80]:
                        - generic [ref=e81]:
                            - generic [ref=e82]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e83]
                                - paragraph [ref=e84]: Topaz · Remoto, Brasil
                                - paragraph [ref=e85]: Feb 2023 – Presente · 3 yrs 3 mo
                            - button "Expandir detalhes" [ref=e86] [cursor=pointer]:
                                - img [ref=e87]
                        - paragraph [ref=e89]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                    - article [ref=e90]:
                        - generic [ref=e91]:
                            - generic [ref=e92]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e93]
                                - paragraph [ref=e94]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e95]: Oct 2021 – Jan 2022 · 3 mo
                            - button "Expandir detalhes" [ref=e96] [cursor=pointer]:
                                - img [ref=e97]
                        - paragraph [ref=e99]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                    - article [ref=e100]:
                        - generic [ref=e101]:
                            - generic [ref=e102]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e103]
                                - paragraph [ref=e104]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e105]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - button "Expandir detalhes" [ref=e106] [cursor=pointer]:
                                - img [ref=e107]
                        - paragraph [ref=e109]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                    - article [ref=e110]:
                        - generic [ref=e111]:
                            - generic [ref=e112]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e113]
                                - paragraph [ref=e114]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e115]: Apr 2021 – Oct 2021 · 6 mo
                            - button "Expandir detalhes" [ref=e116] [cursor=pointer]:
                                - img [ref=e117]
                        - paragraph [ref=e119]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
                - generic [ref=e121]:
                    - heading "Linha do Tempo" [level=3] [ref=e122]
                    - list "Timeline" [ref=e123]:
                        - listitem [ref=e125]:
                            - generic "Work" [ref=e126]:
                                - generic [ref=e127]: Work
                            - time [ref=e128]: Feb 2023 – Present · 3 yrs 3 mo
                            - generic [ref=e129]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e130]
                                - paragraph [ref=e131]: Topaz · Remoto, Brasil
                                - paragraph [ref=e132]: "Atuação no produto interno da empresa, voltado ao setor bancário. Desenvolvimento e manutenção de aplicativos móveis para instituições financeiras, com foco em funcionalidades críticas e experiência do usuário. ### Conquistas - Desenvolveu e implementou módulo Pix completo para aplicativos bancários, incluindo integração com DICT (Diretório de Identificadores de Contas Transacionais) - Implementou Login Biométrico com integração Daon para autenticação segura - Criou módulo de Empréstimo com fluxo completo de solicitação e aprovação - Prestou manutenção e correção de bugs em aplicativos bancários críticos - Atuou em projetos para clientes específicos: CrediSIS (Brasil), Bradescard (México), Banco Macro (Argentina) e Banco do Nordeste - BNB (Brasil) - Trabalhou com Google Play Console, Apple Developer e TestFlight para distribuição de apps - Implementou testes unitários com Jest para garantir qualidade do código - Utilizou ferramentas de monitoramento (Elastic, Kibana, Grafana) para análise de performance - Experiência com metodologias ágeis e comunicação eficiente com stakeholders (POs, BAs, QAs, SMs) - Orientação de desenvolvedores júnior em boas práticas de desenvolvimento React Native"
                        - listitem [ref=e133]:
                            - generic "Work" [ref=e134]:
                                - generic [ref=e135]: Work
                            - time [ref=e136]: Oct 2021 – Jan 2022 · 3 mo
                            - generic [ref=e137]:
                                - heading "Desenvolvedor Flutter" [level=3] [ref=e138]
                                - paragraph [ref=e139]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e140]: "Atuação no aplicativo móvel do cliente Virtus Pay, focando em manutenção e qualidade do código. ### Conquistas - Efetuou manutenção e correções de bugs no aplicativo Virtus Pay - Trabalhou com Flutter para desenvolvimento multiplataforma - Experiência com aplicativos de pagamento digital"
                        - listitem [ref=e141]:
                            - generic "Work" [ref=e142]:
                                - generic [ref=e143]: Work
                            - time [ref=e144]: Jan 2022 – Mar 2023 · 1 yr 2 mo
                            - generic [ref=e145]:
                                - heading "Desenvolvedor Mobile React Native" [level=3] [ref=e146]
                                - paragraph [ref=e147]: Rubcube · Remoto, Brasil
                                - paragraph [ref=e148]: "Atuação no desenvolvimento do aplicativo móvel do cliente Banco Digi+, com foco em funcionalidades bancárias e experiência do usuário. ### Conquistas - Criou módulo Pix completo do zero para o Banco Digi+, incluindo todas as funcionalidades de transferência e pagamento - Efetuou manutenção e correções de bugs no aplicativo bancário - Trabalhou com MongoDB para persistência de dados - Desenvolveu componentes React Native em formato funcional e de classes - Desenvolveu website da empresa utilizando React JS - Experiência com integração de APIs REST para serviços bancários"
                        - listitem [ref=e149]:
                            - generic "Work" [ref=e150]:
                                - generic [ref=e151]: Work
                            - time [ref=e152]: Apr 2021 – Oct 2021 · 6 mo
                            - generic [ref=e153]:
                                - heading "Desenvolvedor Android/Flutter" [level=3] [ref=e154]
                                - paragraph [ref=e155]: Engeselt · Remoto, Brasil
                                - paragraph [ref=e156]: "Entrada na empresa para efetuar prova de conceito do mestrado sobre dados GNSS (GPS). Após conclusão, permaneceu na empresa para atuação em produtos próprios do setor elétrico. ### Conquistas - Desenvolveu prova de conceito utilizando dados GNSS (GPS) do mestrado - Efetuou manutenção e correções de bugs no aplicativo da empresa do setor elétrico - Trabalhou com Flutter MobX para gerenciamento de estado - Implementou funcionalidades offline-first com SQFlite e OpenStreetMaps - Desenvolveu em Android Nativo utilizando Java e XML - Aplicou conhecimentos acadêmicos de GNSS em aplicações práticas"
        - region "Habilidades" [ref=e158]:
            - generic [ref=e159]:
                - heading "Habilidades" [level=2] [ref=e160]
                - generic [ref=e161]:
                    - generic [ref=e162]: Filtrar habilidades
                    - searchbox "Filtrar habilidades por nome" [ref=e163]
                - generic [ref=e164]:
                    - generic [ref=e165]:
                        - heading "Mobile Development" [level=2] [ref=e166]
                        - list "Mobile Development habilidades" [ref=e167]:
                            - listitem [ref=e168]:
                                - generic [ref=e169]: React Native
                                - 'generic "Nível: expert" [ref=e170]': expert
                            - listitem [ref=e171]:
                                - generic [ref=e172]: Flutter
                                - 'generic "Nível: intermediate" [ref=e173]': intermediate
                            - listitem [ref=e174]:
                                - generic [ref=e175]: Android Nativo (Java)
                                - 'generic "Nível: advanced" [ref=e176]': advanced
                            - listitem [ref=e177]:
                                - generic [ref=e178]: TypeScript
                                - 'generic "Nível: advanced" [ref=e179]': advanced
                            - listitem [ref=e180]:
                                - generic [ref=e181]: JavaScript
                                - 'generic "Nível: expert" [ref=e182]': expert
                    - generic [ref=e183]:
                        - heading "State Management & Architecture" [level=2] [ref=e184]
                        - list "State Management & Architecture habilidades" [ref=e185]:
                            - listitem [ref=e186]:
                                - generic [ref=e187]: Redux/Saga
                                - 'generic "Nível: advanced" [ref=e188]': advanced
                            - listitem [ref=e189]:
                                - generic [ref=e190]: Jotai
                                - 'generic "Nível: intermediate" [ref=e191]': intermediate
                            - listitem [ref=e192]:
                                - generic [ref=e193]: TankStack
                                - 'generic "Nível: intermediate" [ref=e194]': intermediate
                            - listitem [ref=e195]:
                                - generic [ref=e196]: MobX
                                - 'generic "Nível: intermediate" [ref=e197]': intermediate
                    - generic [ref=e198]:
                        - heading "UI & Styling" [level=2] [ref=e199]
                        - list "UI & Styling habilidades" [ref=e200]:
                            - listitem [ref=e201]:
                                - generic [ref=e202]: React Native StyleSheet
                                - 'generic "Nível: expert" [ref=e203]': expert
                            - listitem [ref=e204]:
                                - generic [ref=e205]: Styled Components
                                - 'generic "Nível: advanced" [ref=e206]': advanced
                            - listitem [ref=e207]:
                                - generic [ref=e208]: React JS
                                - 'generic "Nível: advanced" [ref=e209]': advanced
                    - generic [ref=e210]:
                        - heading "Forms & Validation" [level=2] [ref=e211]
                        - list "Forms & Validation habilidades" [ref=e212]:
                            - listitem [ref=e213]:
                                - generic [ref=e214]: react-hook-form
                                - 'generic "Nível: advanced" [ref=e215]': advanced
                            - listitem [ref=e216]:
                                - generic [ref=e217]: Validação de Formulários
                                - 'generic "Nível: expert" [ref=e218]': expert
                    - generic [ref=e219]:
                        - heading "Testing" [level=2] [ref=e220]
                        - list "Testing habilidades" [ref=e221]:
                            - listitem [ref=e222]:
                                - generic [ref=e223]: Jest
                                - 'generic "Nível: advanced" [ref=e224]': advanced
                            - listitem [ref=e225]:
                                - generic [ref=e226]: Testes Unitários
                                - 'generic "Nível: advanced" [ref=e227]': advanced
                    - generic [ref=e228]:
                        - heading "Firebase & Cloud Services" [level=2] [ref=e229]
                        - list "Firebase & Cloud Services habilidades" [ref=e230]:
                            - listitem [ref=e231]:
                                - generic [ref=e232]: Firebase Analytics
                                - 'generic "Nível: advanced" [ref=e233]': advanced
                            - listitem [ref=e234]:
                                - generic [ref=e235]: Firebase Crashlytics
                                - 'generic "Nível: advanced" [ref=e236]': advanced
                            - listitem [ref=e237]:
                                - generic [ref=e238]: Firebase Distribution
                                - 'generic "Nível: intermediate" [ref=e239]': intermediate
                            - listitem [ref=e240]:
                                - generic [ref=e241]: Firebase Storage
                                - 'generic "Nível: intermediate" [ref=e242]': intermediate
                    - generic [ref=e243]:
                        - heading "APIs & Integration" [level=2] [ref=e244]
                        - list "APIs & Integration habilidades" [ref=e245]:
                            - listitem [ref=e246]:
                                - generic [ref=e247]: REST APIs
                                - 'generic "Nível: expert" [ref=e248]': expert
                            - listitem [ref=e249]:
                                - generic [ref=e250]: AsyncStorage
                                - 'generic "Nível: expert" [ref=e251]': expert
                            - listitem [ref=e252]:
                                - generic [ref=e253]: MongoDB
                                - 'generic "Nível: intermediate" [ref=e254]': intermediate
                    - generic [ref=e255]:
                        - heading "Internationalization" [level=2] [ref=e256]
                        - list "Internationalization habilidades" [ref=e257]:
                            - listitem [ref=e258]:
                                - generic [ref=e259]: i18next
                                - 'generic "Nível: advanced" [ref=e260]': advanced
                            - listitem [ref=e261]:
                                - generic [ref=e262]: Localização de Apps
                                - 'generic "Nível: advanced" [ref=e263]': advanced
                    - generic [ref=e264]:
                        - heading "Native Modules & Integrations" [level=2] [ref=e265]
                        - list "Native Modules & Integrations habilidades" [ref=e266]:
                            - listitem [ref=e267]:
                                - generic [ref=e268]: Expo Modules
                                - 'generic "Nível: intermediate" [ref=e269]': intermediate
                            - listitem [ref=e270]:
                                - generic [ref=e271]: Daon (Biometria)
                                - 'generic "Nível: intermediate" [ref=e272]': intermediate
                            - listitem [ref=e273]:
                                - generic [ref=e274]: Qualtrics
                                - 'generic "Nível: intermediate" [ref=e275]': intermediate
                    - generic [ref=e276]:
                        - heading "Database & Storage" [level=2] [ref=e277]
                        - list "Database & Storage habilidades" [ref=e278]:
                            - listitem [ref=e279]:
                                - generic [ref=e280]: SQFlite
                                - 'generic "Nível: intermediate" [ref=e281]': intermediate
                            - listitem [ref=e282]:
                                - generic [ref=e283]: AsyncStorage
                                - 'generic "Nível: expert" [ref=e284]': expert
                            - listitem [ref=e285]:
                                - generic [ref=e286]: MongoDB
                                - 'generic "Nível: intermediate" [ref=e287]': intermediate
                    - generic [ref=e288]:
                        - heading "Maps & Location" [level=2] [ref=e289]
                        - list "Maps & Location habilidades" [ref=e290]:
                            - listitem [ref=e291]:
                                - generic [ref=e292]: OpenStreetMaps
                                - 'generic "Nível: intermediate" [ref=e293]': intermediate
                            - listitem [ref=e294]:
                                - generic [ref=e295]: GNSS/GPS
                                - 'generic "Nível: expert" [ref=e296]': expert
                            - listitem [ref=e297]:
                                - generic [ref=e298]: Geolocalização
                                - 'generic "Nível: advanced" [ref=e299]': advanced
                    - generic [ref=e300]:
                        - heading "DevOps & CI/CD" [level=2] [ref=e301]
                        - list "DevOps & CI/CD habilidades" [ref=e302]:
                            - listitem [ref=e303]:
                                - generic [ref=e304]: Google Play Console
                                - 'generic "Nível: advanced" [ref=e305]': advanced
                            - listitem [ref=e306]:
                                - generic [ref=e307]: Apple Developer
                                - 'generic "Nível: advanced" [ref=e308]': advanced
                            - listitem [ref=e309]:
                                - generic [ref=e310]: TestFlight
                                - 'generic "Nível: advanced" [ref=e311]': advanced
                            - listitem [ref=e312]:
                                - generic [ref=e313]: Jenkins
                                - 'generic "Nível: intermediate" [ref=e314]': intermediate
                            - listitem [ref=e315]:
                                - generic [ref=e316]: Fastlane
                                - 'generic "Nível: intermediate" [ref=e317]': intermediate
                            - listitem [ref=e318]:
                                - generic [ref=e319]: Git/GitHub/GitLab
                                - 'generic "Nível: expert" [ref=e320]': expert
                    - generic [ref=e321]:
                        - heading "Monitoring & Analytics" [level=2] [ref=e322]
                        - list "Monitoring & Analytics habilidades" [ref=e323]:
                            - listitem [ref=e324]:
                                - generic [ref=e325]: Elastic
                                - 'generic "Nível: intermediate" [ref=e326]': intermediate
                            - listitem [ref=e327]:
                                - generic [ref=e328]: Kibana
                                - 'generic "Nível: intermediate" [ref=e329]': intermediate
                            - listitem [ref=e330]:
                                - generic [ref=e331]: Grafana
                                - 'generic "Nível: intermediate" [ref=e332]': intermediate
                    - generic [ref=e333]:
                        - heading "Project Management" [level=2] [ref=e334]
                        - list "Project Management habilidades" [ref=e335]:
                            - listitem [ref=e336]:
                                - generic [ref=e337]: Jira
                                - 'generic "Nível: advanced" [ref=e338]': advanced
                            - listitem [ref=e339]:
                                - generic [ref=e340]: Confluence
                                - 'generic "Nível: intermediate" [ref=e341]': intermediate
                            - listitem [ref=e342]:
                                - generic [ref=e343]: Metodologias Ágeis
                                - 'generic "Nível: advanced" [ref=e344]': advanced
                    - generic [ref=e345]:
                        - heading "Backend & Desktop" [level=2] [ref=e346]
                        - list "Backend & Desktop habilidades" [ref=e347]:
                            - listitem [ref=e348]:
                                - generic [ref=e349]: Java
                                - 'generic "Nível: advanced" [ref=e350]': advanced
                            - listitem [ref=e351]:
                                - generic [ref=e352]: Java Swing
                                - 'generic "Nível: intermediate" [ref=e353]': intermediate
                            - listitem [ref=e354]:
                                - generic [ref=e355]: Python
                                - 'generic "Nível: intermediate" [ref=e356]': intermediate
                            - listitem [ref=e357]:
                                - generic [ref=e358]: C++
                                - 'generic "Nível: intermediate" [ref=e359]': intermediate
                    - generic [ref=e360]:
                        - heading "Domain Knowledge" [level=2] [ref=e361]
                        - list "Domain Knowledge habilidades" [ref=e362]:
                            - listitem [ref=e363]:
                                - generic [ref=e364]: Sistema Pix (DICT)
                                - 'generic "Nível: expert" [ref=e365]': expert
                            - listitem [ref=e366]:
                                - generic [ref=e367]: Aplicações Bancárias
                                - 'generic "Nível: expert" [ref=e368]': expert
                            - listitem [ref=e369]:
                                - generic [ref=e370]: Biometria e Autenticação
                                - 'generic "Nível: advanced" [ref=e371]': advanced
                            - listitem [ref=e372]:
                                - generic [ref=e373]: Processamento de Imagens
                                - 'generic "Nível: intermediate" [ref=e374]': intermediate
                            - listitem [ref=e375]:
                                - generic [ref=e376]: Ciências Cartográficas
                                - 'generic "Nível: advanced" [ref=e377]': advanced
                    - generic [ref=e378]:
                        - heading "Languages" [level=2] [ref=e379]
                        - list "Languages habilidades" [ref=e380]:
                            - listitem [ref=e381]:
                                - generic [ref=e382]: Português (Nativo)
                                - 'generic "Nível: expert" [ref=e383]': expert
                            - listitem [ref=e384]:
                                - generic [ref=e385]: Inglês (Intermediário-Avançado B2)
                                - 'generic "Nível: advanced" [ref=e386]': advanced
                    - generic [ref=e387]:
                        - heading "Soft Skills" [level=2] [ref=e388]
                        - list "Soft Skills habilidades" [ref=e389]:
                            - listitem [ref=e390]:
                                - generic [ref=e391]: Comunicação com Stakeholders
                                - 'generic "Nível: expert" [ref=e392]': expert
                            - listitem [ref=e393]:
                                - generic [ref=e394]: Orientação de Desenvolvedores
                                - 'generic "Nível: advanced" [ref=e395]': advanced
                            - listitem [ref=e396]:
                                - generic [ref=e397]: Trabalho em Equipe
                                - 'generic "Nível: expert" [ref=e398]': expert
                            - listitem [ref=e399]:
                                - generic [ref=e400]: Resolução de Problemas
                                - 'generic "Nível: expert" [ref=e401]': expert
                            - listitem [ref=e402]:
                                - generic [ref=e403]: Metodologias Ágeis
                                - 'generic "Nível: advanced" [ref=e404]': advanced
        - region "Projetos" [ref=e406]:
            - generic [ref=e407]:
                - heading "Projetos" [level=2] [ref=e408]
                - group "Filtrar por tecnologia" [ref=e409]:
                    - button "Todas" [pressed] [ref=e410] [cursor=pointer]
                    - button "Android Architecture Components" [ref=e411] [cursor=pointer]
                    - button "Android SDK" [ref=e412] [cursor=pointer]
                    - button "Data Processing" [ref=e413] [cursor=pointer]
                    - button "Firebase Analytics" [ref=e414] [cursor=pointer]
                    - button "Firebase Crashlytics" [ref=e415] [cursor=pointer]
                    - button "GNSS/GPS" [ref=e416] [cursor=pointer]
                    - button "Java" [ref=e417] [cursor=pointer]
                    - button "Jest" [ref=e418] [cursor=pointer]
                    - button "Material Design" [ref=e419] [cursor=pointer]
                    - button "NMEA Protocol" [ref=e420] [cursor=pointer]
                    - button "Next.js 16" [ref=e421] [cursor=pointer]
                    - button "Playwright" [ref=e422] [cursor=pointer]
                    - button "SQLite" [ref=e423] [cursor=pointer]
                    - button "Scientific Computing" [ref=e424] [cursor=pointer]
                    - button "Sentry" [ref=e425] [cursor=pointer]
                    - button "Tailwind CSS" [ref=e426] [cursor=pointer]
                    - button "TypeScript" [ref=e427] [cursor=pointer]
                    - button "Vercel" [ref=e428] [cursor=pointer]
                    - button "next-intl" [ref=e429] [cursor=pointer]
                - generic [ref=e430]:
                    - button "Ver detalhes de Personal Resume Website" [ref=e432] [cursor=pointer]:
                        - img "Personal Resume Website captura de tela 1" [ref=e434]
                        - generic [ref=e435]:
                            - heading "Personal Resume Website" [level=3] [ref=e436]
                            - generic [ref=e438]: Destaque
                        - paragraph [ref=e439]: Site de currículo pessoal moderno e responsivo com suporte multilíngue, modo escuro, e integração completa com Firebase Analytics
                        - generic [ref=e440]:
                            - generic [ref=e441]: Next.js 16
                            - generic [ref=e442]: TypeScript
                            - generic [ref=e443]: Tailwind CSS
                            - generic [ref=e444]: Firebase Analytics
                            - generic [ref=e445]: +6 mais
                    - button "Ver detalhes de Android Native Crud" [ref=e447] [cursor=pointer]:
                        - img "Android Native Crud captura de tela 1" [ref=e449]
                        - heading "Android Native Crud" [level=3] [ref=e451]
                        - paragraph [ref=e452]: Aplicação de exemplo para estudo inicial do ambiente Android, explorando componentes fundamentais e padrões de desenvolvimento
                        - generic [ref=e453]:
                            - generic [ref=e454]: Java
                            - generic [ref=e455]: Android SDK
                            - generic [ref=e456]: Material Design
                            - generic [ref=e457]: SQLite
                            - generic [ref=e458]: +1 mais
                    - button "Ver detalhes de INCT GNSS App" [ref=e460] [cursor=pointer]:
                        - img "INCT GNSS App captura de tela 1" [ref=e462]
                        - generic [ref=e463]:
                            - heading "INCT GNSS App" [level=3] [ref=e464]
                            - generic [ref=e466]: Destaque
                        - paragraph [ref=e467]: Aplicação Android para análise de dados GNSS (GPS) coletados pelo Google GNSSLogger, com processamento de medições NMEA
                        - generic [ref=e468]:
                            - generic [ref=e469]: Java
                            - generic [ref=e470]: Android SDK
                            - generic [ref=e471]: GNSS/GPS
                            - generic [ref=e472]: NMEA Protocol
                            - generic [ref=e473]: +2 mais
        - region "Entre em Contato" [ref=e474]:
            - generic [ref=e475]:
                - heading "Entre em Contato" [level=2] [ref=e476]
                - paragraph [ref=e477]: Tem um projeto em mente ou quer conversar? Envie-me uma mensagem!
                - generic [ref=e479]:
                    - img [ref=e480]
                    - generic [ref=e483]:
                        - paragraph [ref=e484]: E-mail Profissional
                        - link "contato@rogeriodocarmo.com" [ref=e485]:
                            - /url: mailto:contato@rogeriodocarmo.com
                        - paragraph [ref=e486]: Ou use o formulário abaixo para me enviar uma mensagem
                - form "Formulário de contato" [ref=e487]:
                    - generic [ref=e488]:
                        - generic [ref=e489]: Nome *
                        - textbox "Nome" [ref=e490]:
                            - /placeholder: Seu nome
                    - generic [ref=e491]:
                        - generic [ref=e492]: E-mail *
                        - textbox "E-mail" [ref=e493]:
                            - /placeholder: seu@email.com
                    - generic [ref=e494]:
                        - generic [ref=e495]: Mensagem *
                        - textbox "Mensagem" [ref=e496]:
                            - /placeholder: Sua mensagem (pelo menos 10 caracteres)
                    - button "Enviar Mensagem" [ref=e497] [cursor=pointer]
    - contentinfo [ref=e498]:
        - generic [ref=e499]:
            - generic [ref=e500]:
                - generic [ref=e501]:
                    - heading "Navegar" [level=2] [ref=e502]
                    - list [ref=e503]:
                        - listitem [ref=e504]:
                            - link "Início" [ref=e505]:
                                - /url: "#home"
                        - listitem [ref=e506]:
                            - link "Projetos" [ref=e507]:
                                - /url: "#projects"
                        - listitem [ref=e508]:
                            - link "Experiência" [ref=e509]:
                                - /url: "#experience"
                        - listitem [ref=e510]:
                            - link "Habilidades" [ref=e511]:
                                - /url: "#skills"
                        - listitem [ref=e512]:
                            - link "Contato" [ref=e513]:
                                - /url: "#contact"
                        - listitem [ref=e514]:
                            - link "Usado neste site" [ref=e515]:
                                - /url: "#tech-stack"
                - generic [ref=e516]:
                    - heading "Idiomas" [level=2] [ref=e517]
                    - list [ref=e518]:
                        - listitem [ref=e519]:
                            - link "Português (pt-BR)" [ref=e520]:
                                - /url: /pt-BR
                        - listitem [ref=e521]:
                            - link "English (en)" [ref=e522]:
                                - /url: /en
                        - listitem [ref=e523]:
                            - link "Español (es)" [ref=e524]:
                                - /url: /es
                - generic [ref=e525]:
                    - heading "Conectar" [level=2] [ref=e526]
                    - list [ref=e527]:
                        - listitem [ref=e528]:
                            - link "E-mail Profissional" [ref=e529]:
                                - /url: mailto:contato@rogeriodocarmo.com
                                - img [ref=e530]
                                - generic [ref=e533]: contato@rogeriodocarmo.com
                        - listitem [ref=e534]:
                            - link "Baixar currículo em formato PDF" [ref=e535]:
                                - /url: /resumes/resume.pdf
                                - img [ref=e536]
                                - generic [ref=e538]: Baixar Currículo
                        - listitem [ref=e539]:
                            - link "Baixar dissertação de mestrado em formato PDF" [ref=e540]:
                                - /url: /academic/masters_degree_dissertation_rogerio_do_carmo.pdf
                                - img [ref=e541]
                                - generic [ref=e543]: Baixar Dissertação
                        - listitem [ref=e544]:
                            - link "Linktree profile" [ref=e545]:
                                - /url: https://linktr.ee/rogeriodocarmo
                                - img [ref=e546]
                                - generic [ref=e548]: Linktree
                        - listitem [ref=e549]:
                            - link "LinkedIn profile" [ref=e550]:
                                - /url: https://www.linkedin.com/in/rogeriodocarmo/
                                - img [ref=e551]
                                - generic [ref=e553]: LinkedIn
                        - listitem [ref=e554]:
                            - link "GitHub profile" [ref=e555]:
                                - /url: https://github.com/RogerioDoCarmo/curriculo
                                - img [ref=e556]
                                - generic [ref=e558]: GitHub
                        - listitem [ref=e559]:
                            - button "Imprimir página do site" [ref=e560] [cursor=pointer]:
                                - img [ref=e561]
                                - generic [ref=e565]: Imprimir Página
            - paragraph [ref=e567]: © 2026 Rogério do Carmo. Todos os direitos reservados.
```

# Test source

```ts
  137 |       await expect(banner).toBeVisible();
  138 |
  139 |       // Click Reject button
  140 |       await banner.getByRole("button", { name: /rejeitar|reject/i }).click();
  141 |
  142 |       // Banner should hide immediately (no reload for reject)
  143 |       await expect(banner).not.toBeVisible();
  144 |     });
  145 |
  146 |     test("should persist rejection across page reloads", async ({ page }) => {
  147 |       await page.goto("/");
  148 |
  149 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  150 |       await banner.getByRole("button", { name: /rejeitar|reject/i }).click();
  151 |
  152 |       // Check localStorage
  153 |       const consentStatus = await page.evaluate(() => localStorage.getItem("cookie-consent"));
  154 |       expect(consentStatus).toBe("rejected");
  155 |
  156 |       const preferences = await page.evaluate(() =>
  157 |         JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
  158 |       );
  159 |       expect(preferences.analytics).toBe(false);
  160 |       expect(preferences.functional).toBe(false);
  161 |
  162 |       // Reload page
  163 |       await page.reload();
  164 |
  165 |       // Banner should not be visible after reload
  166 |       await expect(banner).not.toBeVisible();
  167 |     });
  168 |
  169 |     test("should NOT enable Firebase Analytics after rejecting", async ({ page }) => {
  170 |       await page.goto("/");
  171 |
  172 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  173 |       await banner.getByRole("button", { name: /rejeitar|reject/i }).click();
  174 |
  175 |       // Check that analytics consent is NOT granted
  176 |       const hasConsent = await page.evaluate(() => {
  177 |         const status = localStorage.getItem("cookie-consent");
  178 |         const prefs = JSON.parse(localStorage.getItem("cookie-preferences") || "{}");
  179 |         return status === "accepted" || (status === "customized" && prefs.analytics === true);
  180 |       });
  181 |       expect(hasConsent).toBe(false);
  182 |     });
  183 |   });
  184 |
  185 |   test.describe("Customize flow", () => {
  186 |     test("should show customize view when clicked", async ({ page }) => {
  187 |       await page.goto("/");
  188 |
  189 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  190 |       await expect(banner).toBeVisible();
  191 |
  192 |       // Click Customize button
  193 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  194 |
  195 |       // Verify customize view is shown
  196 |       await expect(banner.getByText(/personalizar|customize preferences/i)).toBeVisible();
  197 |
  198 |       // Verify checkboxes are present
  199 |       await expect(banner.getByRole("checkbox", { name: /essenciais|essential/i })).toBeVisible();
  200 |       await expect(banner.getByRole("checkbox", { name: /analíticos|analytics/i })).toBeVisible();
  201 |       await expect(banner.getByRole("checkbox", { name: /funcionais|functional/i })).toBeVisible();
  202 |     });
  203 |
  204 |     test("should have essential cookies always enabled", async ({ page }) => {
  205 |       await page.goto("/");
  206 |
  207 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  208 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  209 |
  210 |       // Essential checkbox should be checked and disabled
  211 |       const essentialCheckbox = banner.getByRole("checkbox", { name: /essenciais|essential/i });
  212 |       await expect(essentialCheckbox).toBeChecked();
  213 |       await expect(essentialCheckbox).toBeDisabled();
  214 |     });
  215 |
  216 |     test("should allow toggling analytics preference", async ({ page }) => {
  217 |       await page.goto("/");
  218 |
  219 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  220 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  221 |
  222 |       const analyticsCheckbox = banner.getByRole("checkbox", { name: /analíticos|analytics/i });
  223 |
  224 |       // Should be checked by default
  225 |       await expect(analyticsCheckbox).toBeChecked();
  226 |
  227 |       // Uncheck analytics
  228 |       await analyticsCheckbox.click();
  229 |       await expect(analyticsCheckbox).not.toBeChecked();
  230 |
  231 |       // Check analytics again
  232 |       await analyticsCheckbox.click();
  233 |       await expect(analyticsCheckbox).toBeChecked();
  234 |     });
  235 |
  236 |     test("should allow toggling functional preference", async ({ page }) => {
> 237 |       await page.goto("/");
      |                  ^ Error: page.goto: Navigation to "http://localhost:3000/" is interrupted by another navigation to "http://localhost:3000/pt-BR/"
  238 |
  239 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  240 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  241 |
  242 |       const functionalCheckbox = banner.getByRole("checkbox", { name: /funcionais|functional/i });
  243 |
  244 |       // Should be checked by default
  245 |       await expect(functionalCheckbox).toBeChecked();
  246 |
  247 |       // Uncheck functional
  248 |       await functionalCheckbox.click();
  249 |       await expect(functionalCheckbox).not.toBeChecked();
  250 |
  251 |       // Check functional again
  252 |       await functionalCheckbox.click();
  253 |       await expect(functionalCheckbox).toBeChecked();
  254 |     });
  255 |
  256 |     test("should save custom preferences", async ({ page }) => {
  257 |       await page.goto("/");
  258 |
  259 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  260 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  261 |
  262 |       // Disable analytics, keep functional enabled
  263 |       const analyticsCheckbox = banner.getByRole("checkbox", { name: /analíticos|analytics/i });
  264 |       await analyticsCheckbox.click(); // Uncheck
  265 |
  266 |       // Save preferences
  267 |       await banner.getByRole("button", { name: /salvar|save/i }).click();
  268 |
  269 |       // Wait for reload
  270 |       await page.waitForLoadState("networkidle");
  271 |
  272 |       // Check localStorage
  273 |       const consentStatus = await page.evaluate(() => localStorage.getItem("cookie-consent"));
  274 |       expect(consentStatus).toBe("customized");
  275 |
  276 |       const preferences = await page.evaluate(() =>
  277 |         JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
  278 |       );
  279 |       expect(preferences.analytics).toBe(false);
  280 |       expect(preferences.functional).toBe(true);
  281 |     });
  282 |
  283 |     test("should persist custom preferences across reloads", async ({ page }) => {
  284 |       await page.goto("/");
  285 |
  286 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  287 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  288 |
  289 |       // Enable only functional, disable analytics
  290 |       await banner.getByRole("checkbox", { name: /analíticos|analytics/i }).click();
  291 |       await banner.getByRole("button", { name: /salvar|save/i }).click();
  292 |
  293 |       // Wait for reload
  294 |       await page.waitForLoadState("networkidle");
  295 |
  296 |       // Reload page manually
  297 |       await page.reload();
  298 |
  299 |       // Banner should not be visible
  300 |       await expect(banner).not.toBeVisible();
  301 |
  302 |       // Verify preferences persisted
  303 |       const preferences = await page.evaluate(() =>
  304 |         JSON.parse(localStorage.getItem("cookie-preferences") || "{}")
  305 |       );
  306 |       expect(preferences.analytics).toBe(false);
  307 |       expect(preferences.functional).toBe(true);
  308 |     });
  309 |
  310 |     test("should respect analytics preference for tracking", async ({ page }) => {
  311 |       await page.goto("/");
  312 |
  313 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  314 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  315 |
  316 |       // Disable analytics
  317 |       await banner.getByRole("checkbox", { name: /analíticos|analytics/i }).click();
  318 |       await banner.getByRole("button", { name: /salvar|save/i }).click();
  319 |
  320 |       // Wait for reload
  321 |       await page.waitForLoadState("networkidle");
  322 |
  323 |       // Verify analytics is disabled
  324 |       const hasAnalyticsConsent = await page.evaluate(() => {
  325 |         const status = localStorage.getItem("cookie-consent");
  326 |         const prefs = JSON.parse(localStorage.getItem("cookie-preferences") || "{}");
  327 |         return status === "accepted" || (status === "customized" && prefs.analytics === true);
  328 |       });
  329 |       expect(hasAnalyticsConsent).toBe(false);
  330 |     });
  331 |
  332 |     test("should return to main view when back button clicked", async ({ page }) => {
  333 |       await page.goto("/");
  334 |
  335 |       const banner = page.getByRole("dialog", { name: /cookies|privacidade/i });
  336 |       await banner.getByRole("button", { name: /personalizar|customize/i }).click();
  337 |
```
